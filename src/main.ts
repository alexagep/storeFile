import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/error.filter';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (!fs.existsSync(`${process.cwd()}/uploads`)) {
    fs.mkdirSync(`${process.cwd()}/uploads`);
  }

  await app.listen(3000, (): void => {
    console.log('server is running on port', 3000);
  });
}
bootstrap();
