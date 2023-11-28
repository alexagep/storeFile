import { Injectable } from '@nestjs/common';
import { DownloadDataDto, UploadDataDto } from './DTO/uploadInfos.dto';
import { Response } from './uploadInfos.interface';

@Injectable()
export class UploadInfoService {
  async upload(body: UploadDataDto): Promise<Response> {
    console.log(body);

    return {
      message: 'otpCode is sent to your Email, check it out',
    };
  }

  async download(body: DownloadDataDto): Promise<Response> {
    console.log(body);
    return {
      message: 'otpCode is sent, check it out',
    };
  }
}
