import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { LoginUserDto , CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

//import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    
  ) {}


  async create(createAuthDto: CreateUserDto) {

    try {
          const { password, ...userData } = createAuthDto;
          
          const user = this.userRepository.create({
            ...userData,
            password: bcrypt.hashSync( password, 10 )
          });

          await this.userRepository.save( user );
          const{password: pass, ...userInfo} = user;   //que no muestre el password
          return {
            ...userInfo,
            token: this.getJwtToken( { id: user.id } )

          };
          //todo: retornar el JWT de acceso

    } catch (error) {
      this.handleDBErrors(error);
    }
   }

  async login( loginUserDto: LoginUserDto ) {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, fullName: true, roles: true }
    });

    if ( !user ) 
      throw new UnauthorizedException('Credentials are not valid (email)');
    
    if ( !bcrypt.compareSync( password, user.password ) ) 
      throw new BadRequestException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken( { id: user.id } )
    };
          //todo: retornar el JWT de acceso
  }

    async checkAuthStatus( user: User ){

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }

  private getJwtToken( payload: JwtPayload) {
    const token = this.jwtService.sign( payload );
    return token;
  }

  private handleDBErrors( error: any ): never {
    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');
  }

}
