import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap')

  //Agregaremos el prefijo '/api/' en los endpoints de mi aplicacion.
  app.setGlobalPrefix('api');

  //Agregamos el , useGlobalPipes y ValidationPipe para activar las validaciones en nuestros DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  //Corremos la app.
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`App running on port ${process.env.PORT}⚡⚡⚡`)
}
bootstrap();
