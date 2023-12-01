import { Module } from '@nestjs/common';
import { UploadInfoController } from './uploadInfos.controller';
import { UploadInfoService } from './uploadInfos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadInfos } from './uploadInfos.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { storageServiceFactory } from '../common/providers-factory/storage-service.factory';
import { MinioModule } from 'nestjs-minio-client';
import { minioConfig } from '../config/minio.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadInfos]),
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: minioConfig,
      inject: [ConfigService],
    })
  ],
  controllers: [UploadInfoController],
  providers: [
    UploadInfoService,
    ConfigService,
    storageServiceFactory,
  ],
})
export class UploadInfoModule {}
