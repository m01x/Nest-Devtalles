import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {

    getStaticProductImage( imageName: string ) {
        // La constante `path` construye la ruta absoluta hacia la imagen del producto,
        // uniendo el directorio actual con la carpeta relativa de productos y el nombre de la imagen.
        // La función `existsSync` verifica si existe un archivo en la ruta construida.
        // Si el archivo no existe, lanza una excepción indicando que no se encontró el producto.
        const path = join(process.cwd(), 'static','products', imageName);
        console.log(path)
        if ( !existsSync(path) )
            throw new BadRequestException(`No product found with image name ${ imageName }`);

        return path;
    }    
}
