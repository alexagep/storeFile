import { Body, Controller, Post } from '@nestjs/common';
import { DataService } from './data.service';
import { DownloadDataDto, UploadDataDto } from './DTO/data.dto';
import { Response } from './data.interface';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('upload')
  async create(@Body() body: UploadDataDto): Promise<Response> {
    const result = await this.dataService.upload(body);
    return result;
  }

  @Post('download')
  async resend(@Body() body: DownloadDataDto): Promise<Response> {
    const result = await this.dataService.download(body);
    return result;
  }
}
