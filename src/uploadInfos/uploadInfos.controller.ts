import { Body, Controller, Post } from '@nestjs/common';
import { UploadInfoService } from './uploadInfos.service';
import { DownloadDataDto, UploadDataDto } from './DTO/uploadInfos.dto';
import { Response } from './uploadInfos.interface';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('UploadInfo')
@Controller('data')
export class UploadInfoController {
  constructor(private readonly uploadInfoService: UploadInfoService) {}

  @ApiCreatedResponse({ type: UploadDataDto, description: 'Upload A Data' })
  @Post('upload')
  async create(@Body() body: UploadDataDto): Promise<Response> {
    const result = await this.uploadInfoService.upload(body);
    return result;
  }

  @ApiCreatedResponse({ type: DownloadDataDto, description: 'Download Data' })
  @ApiNotFoundResponse()
  @Post('download')
  async resend(@Body() body: DownloadDataDto): Promise<Response> {
    const result = await this.uploadInfoService.download(body);
    return result;
  }
}
