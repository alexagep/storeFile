import { Module } from '@nestjs/common';
import { UploadInfoController } from './uploadInfos.controller';
import { UploadInfoService } from './uploadInfos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadInfos } from './uploadInfos.entity';
import { ConfigService } from '@nestjs/config';
import { LocalStorageProviderFactory } from 'src/common/providers-factory/local-storage-provider.factory';
// import { S3StorageProviderFactory } from 'src/common/providers-factory/s3-storage-provider';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { TransformInterceptor } from 'src/interceptors/transform.interceptor';

let storageProviderFactoryClass = null;
if (process.env.STORAGE_TYPE === 'local') {
  storageProviderFactoryClass = LocalStorageProviderFactory;
} 
// else if (process.env.STORAGE_TYPE === 's3') {
//   storageProviderFactoryClass = S3StorageProviderFactory;
// } 
else {
  throw new Error('Invalid storage type');
}


@Module({
  imports: [TypeOrmModule.forFeature([UploadInfos])],
  controllers: [UploadInfoController],
  providers: [
    UploadInfoService,
    ConfigService,
    {
      provide: 'STORAGE_PROVIDER_FACTORY',
      useClass: storageProviderFactoryClass
    }
  ],
})
export class UploadInfoModule {}
