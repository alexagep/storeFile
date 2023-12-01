import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { QueryFailedExceptionFilter } from './common/uniqueError';

import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('upload + download service')
    .setVersion('1.0')
    .build();

  app.useGlobalFilters(new QueryFailedExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (!fs.existsSync(`${process.cwd()}/${configService.get<string>('STORE_LOCATION')}`)) {
    fs.mkdirSync(`${process.cwd()}/${configService.get<string>('STORE_LOCATION')}`);
  }

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger', app, document);

  const port = configService.get<number>('PORT');

  await app.listen(port, (): void => {
    console.log('server is running on port', port);
  });
}
bootstrap();
