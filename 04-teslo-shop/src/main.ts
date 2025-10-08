import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('Teslo RESTful API')
    .setDescription('Teslo Shop')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  //Corremos la app.
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`App running on port ${process.env.PORT}⚡⚡⚡`)
}
bootstrap();
