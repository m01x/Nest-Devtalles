import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2'); //* Prefijo global, para que la url quede localhost:3000/api/v2/pokemon.. y no tener que especificarlo en cada controller

  //useGlobalPipes , para que class validator y class transformer ejecuten sus validaciones,
  //aqui se configuran.

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
