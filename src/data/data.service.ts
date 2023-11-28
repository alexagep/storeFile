import { Injectable } from '@nestjs/common';
import { DownloadDataDto, UploadDataDto } from './DTO/data.dto';
import { Response } from './data.interface';

@Injectable()
export class DataService {
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
