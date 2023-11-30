// storage-service.factory.ts
import { ConfigService } from '@nestjs/config';
import { LocalStorageService } from 'src/common/providers-factory/local-storage-provider';
import { S3StorageService } from './s3-storage-provider';
import { MinioService } from 'nestjs-minio-client';

export const storageServiceFactory = {
  provide: 'STORAGE_PROVIDER_FACTORY',
  useFactory: (
    configService: ConfigService,
    minioService: MinioService
  ): S3StorageService | LocalStorageService => {
    const storageType = configService.get<string>('STORAGE_TYPE');

    if (storageType === 'S3') {
      return new S3StorageService(minioService, configService);
    }
    return new LocalStorageService();
  },
  inject: [ConfigService, MinioService],
};
