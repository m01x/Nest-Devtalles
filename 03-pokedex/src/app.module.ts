import { join } from 'path'; //viene con Node, va al inicio
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PokemonModule

  ],
})
export class AppModule {}

/**
 * para utilizar ServeStaticModule, hay que instalar las dependencias serve-static, para que podamos
 * servir una web estatica (esta en Public) como un sitio basico de entrara a la API
 * en mi caso, para mencionar que está online.
 * 
 * ? yarn add @nestjs/serve-static
 * 
 * ------
 */