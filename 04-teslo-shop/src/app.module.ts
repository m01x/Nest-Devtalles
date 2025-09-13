import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,        //!Si o si requerira variables de entorno.
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,                  //! No queremos que el ORM mute la BD en producción, pero por ahora se dejara asi.
    }),
    ProductsModule
  ],
})
export class AppModule {

  constructor(){
    console.log(`👌 Corriendo en el puerto: ${process.env.DB_PORT}`);
  }
}
