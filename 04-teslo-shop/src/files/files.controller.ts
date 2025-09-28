import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import express from 'express';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {

  //*Inyecciones, constructor
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService 
  ) {}

  /**
   * Esto lo que hace es lo siguiente:
   * 
   ** @Post: sirve como decorador para establecer que mi endpoint 'product' es de tipo post.
   ** @UseInterceptors: se usa para ejecutar lógica extra antes de llegar al método; en este caso 
   *    usamos FileInterceptor(), que se encarga de procesar y guardar temporalmente el archivo 
   *    que viene en la petición. 'file' es la key del campo en el body (form-data).
   ** @UploadedFile: es el decorador que indica que lo que recibe este endpoint es un archivo 
   *    (ya procesado por Multer).
   * 
   * @param file: archivo recibido desde el cliente (tipo Express.Multer.File).
   * @returns: retorna el mismo archivo recibido (puede reemplazarse por lógica para guardarlo 
   *    en disco, base de datos, o un servicio como S3).
   */

  @Post('product')
  @UseInterceptors( FileInterceptor('file',{
    fileFilter: fileFilter, //Mandamos solo la referencia!! no la ejecutamos fileFilter() ✖️
    //limits: { fileSize: 1000 },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  async uploadProductImage( 
    @UploadedFile() file: Express.Multer.File 
  ){
    if ( !file ){
      throw new BadRequestException('Asegurate que el archivo sea una imagen.')
    }

    const secureUrl = `${ this.configService.get('HOST_API') }/static/products/${ file.filename }`;
    return {
      secureUrl
    };
  }


  @Get('product/:imageName')
  findProductImage( 
    @Res() res: express.Response, //Este decorador interrumpe la respuesta. Uno le dice a Nest que uno se hara cargo de procesar la respuesta.
    @Param('imageName') imageName: string
  ){

    const path = this.filesService.getStaticProductImage( imageName );

    /*
    !Ejemplo de respuesta custom con el red
    res.status(403).json({
      ok: false,
      path: path
    })
      */

    res.sendFile( path );

  }
}
