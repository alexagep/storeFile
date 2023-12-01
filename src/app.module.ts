import { Module } from '@nestjs/common';
import { UploadInfoModule } from './uploadInfos/uploadInfos.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { MinioModule } from 'nestjs-minio-client';
import { minioConfig } from './config/minio.config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: minioConfig,
      inject: [ConfigService],
    }),
    UploadInfoModule,
  ],
})
export class AppModule {}
