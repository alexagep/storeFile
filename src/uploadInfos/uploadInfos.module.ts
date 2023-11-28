import { Module } from '@nestjs/common';
import { UploadInfoController } from './uploadInfos.controller';
import { UploadInfoService } from './uploadInfos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadInfos } from './uploadInfos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UploadInfos])],
  controllers: [UploadInfoController],
  providers: [UploadInfoService]
})
export class UploadInfoModule {}
