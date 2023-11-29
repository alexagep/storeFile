import { Module } from '@nestjs/common';
import { UploadInfoController } from './uploadInfos.controller';
import { UploadInfoService } from './uploadInfos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadInfos } from './uploadInfos.entity';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { TransformInterceptor } from 'src/interceptors/transform.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([UploadInfos])],
  controllers: [UploadInfoController],
  providers: [
    UploadInfoService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformInterceptor,
    // },
  ],
})
export class UploadInfoModule {}
