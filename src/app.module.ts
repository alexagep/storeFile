import { Module } from '@nestjs/common';
import { UploadInfoModule } from './uploadInfos/uploadInfos.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { MinioModule } from 'nestjs-minio-client';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [databaseConfig],
        }),
      ],
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('typeorm'),

      inject: [ConfigService],
    }),
    MinioModule.register({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESSKEY,
      secretKey: process.env.MINIO_SECRETKEY,
    }),
    UploadInfoModule,
  ],
})
export class AppModule {}
