import { ConfigService } from '@nestjs/config';

export const minioConfig = (configService: ConfigService) => ({
  endPoint: configService.get('MINIO_ENDPOINT'),
  port: parseInt(configService.get('MINIO_PORT')),
  useSSL: false,
  accessKey: configService.get('MINIO_ACCESSKEY'),
  secretKey: configService.get('MINIO_SECRETKEY'),
});
