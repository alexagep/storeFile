import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ErrorFilter } from './common/error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalFilters(new ErrorFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true, // Only allow properties defined in the DTO
      transform: true,
    }),
  );

  await app.listen(3000, (): void => {
    console.log('server is running on port', 3000);
  });
}
bootstrap();
