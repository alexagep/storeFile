import { Module } from '@nestjs/common';
import { UploadInfoController } from './uploadInfos.controller';
import { UploadInfoService } from './uploadInfos.service';

@Module({
  controllers: [UploadInfoController],
  providers: [UploadInfoService]
})
export class UploadInfoModule {}
