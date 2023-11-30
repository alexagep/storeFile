import { Module } from '@nestjs/common';
import { UploadInfoController } from './uploadInfos.controller';
import { UploadInfoService } from './uploadInfos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadInfos } from './uploadInfos.entity';
import { ConfigService } from '@nestjs/config';
import { storageServiceFactory } from 'src/common/providers-factory/storage-service.factory';
import { MinioModule } from 'nestjs-minio-client';
import {config} from 'dotenv'

config();
@Module({
  imports: [
    TypeOrmModule.forFeature([UploadInfos]),
    MinioModule.register({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESSKEY,
      secretKey: process.env.MINIO_SECRETKEY,
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
