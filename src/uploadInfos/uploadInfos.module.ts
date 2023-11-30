import { Module } from '@nestjs/common';
import { UploadInfoController } from './uploadInfos.controller';
import { UploadInfoService } from './uploadInfos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadInfos } from './uploadInfos.entity';
import { ConfigService } from '@nestjs/config';
import { LocalStorageProviderFactory } from 'src/common/providers-factory/local-storage-provider.factory';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { TransformInterceptor } from 'src/interceptors/transform.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([UploadInfos])],
  controllers: [UploadInfoController],
  providers: [
    UploadInfoService,
    ConfigService,
    {
      provide: 'STORAGE_PROVIDER',
      useClass: () => {
        // Use some logic to decide which storage provider to use
        // For example, based on an environment variable
        if (process.env.STORAGE_TYPE === 'local') {
          return LocalStorageProviderFactory
        } else if (process.env.STORAGE_TYPE === 's3') {
          return new S3Storage();
        } else {
          throw new Error('Invalid storage type');
        }
      },
    }
  ],
})
export class UploadInfoModule {}
