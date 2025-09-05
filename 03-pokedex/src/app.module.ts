import { join } from 'path'; //viene con Node, va al inicio
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
      validationSchema: JoiValidationSchema
    }),                                 //!Esta linea mejor que quede al inicio, para que mongoose no detecte undefined cuando se instancie.
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot( process.env.MONGODB || '' ),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {

  constructor(){}
}

/**
 * para utilizar ServeStaticModule, hay que instalar las dependencias serve-static, para que podamos
 * servir una web estatica (esta en Public) como un sitio basico de entrara a la API
 * en mi caso, para mencionar que está online.
 * 
 * ? yarn add @nestjs/serve-static
 * 
 * ------
 */