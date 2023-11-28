import { Body, Controller, Post } from '@nestjs/common';
import { UploadInfoService } from './uploadInfos.service';
import { DownloadDataDto, UploadDataDto } from './DTO/uploadInfos.dto';
import { Response } from './uploadInfos.interface';

@Controller('data')
export class UploadInfoController {
  constructor(private readonly uploadInfoService: UploadInfoService) {}

  @Post('upload')
  async create(@Body() body: UploadDataDto): Promise<Response> {
    const result = await this.uploadInfoService.upload(body);
    return result;
  }

  @Post('download')
  async resend(@Body() body: DownloadDataDto): Promise<Response> {
    const result = await this.uploadInfoService.download(body);
    return result;
  }
}
