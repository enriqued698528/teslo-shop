import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import express from 'express';
import { fileFilter, fileNamer } from './helpers/index';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files - get and Upload files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
    
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: express.Response,
    @Param('imageName') imageName: string
  ) {
    
    const path = this.filesService.getStaticProductImage( imageName );

    res.sendFile(path);

    //return path;//this.filesService.findAll();
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter,
    storage: diskStorage ({
      destination: './static/products',
      filename: fileNamer
    }) 
  }))
  uploadProductImage(
     @UploadedFile() file: Express.Multer.File,
  ) {

    if ( !file ) {
      return new BadRequestException( 'No file uploaded or invalid file type' );
    }

    const secureUrl = `${ process.env.HOST_API }/files/product/${ file.filename }`;
    //const secureUrl = `${ file.filename }`;


    return {  secureUrl  };
  }
}
