import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
    fileFilter: fileFilter //Mandamos solo la referencia!! no la ejecutamos fileFilter() ✖️
  }) )
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File 
  ){
    if ( !file ){
      throw new BadRequestException('Asegurate que el archivo sea una imagen.')
    }
    return {
      fileName: file.originalname
    };
  }
}
