import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway( {cors: true} )
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtServices: JwtService,
  ) {}

  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtServices.verify( token );
      await this.messageWsService.registerClient(client, payload.id );

    } catch (error) {
      client.disconnect();
      return;
    }

    //console.log({payload});

    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients() );

    //console.log({ conectados: this.messageWsService.getConnectedClients() });
  }
  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
        
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients() );

    //console.log({ conectados: this.messageWsService.getConnectedClients() });
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient( client: Socket, payload: NewMessageDto ) {
    console.log( client.id, payload );

    // Emite a todo los clientes
    this.wss.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullName( client.id ),
      message: payload.message || 'no message!!!'
    });

}}
