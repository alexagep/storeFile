import { Injectable } from '@nestjs/common';
import { DownloadDataDto, UploadDataDto } from './DTO/uploadInfos.dto';
import { Response } from './uploadInfos.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadInfos } from './uploadInfos.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class UploadInfoService {
  constructor(
    @InjectRepository(UploadInfos) private readonly uploadInfoRepository: Repository<UploadInfos>,
  ){}
  async upload(body: UploadDataDto): Promise<Response> {
    // console.log(body);

    // get the metadata and data from the uploadData object
    const { metadata, data } = body;
    // get the name, tag, and type from the metadata object
    const { name, tag, type } = metadata;
    console.log(metadata);

    // remove the data scheme prefix from the base64 string
    // const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
    // create a buffer from the base64 string
    // const buffer = Buffer.from(base64Data, 'base64');
    // write the buffer to a file in the uploads folder with the name, tag, and type
    const filepath = `uploads/${name}-${tag}.${type}.txt`;
    await fs.promises.writeFile(filepath, data);

    const savedData = {...metadata, location: filepath}
    const createdUser = await this.uploadInfoRepository.create(savedData);

    await this.uploadInfoRepository.save(createdUser);

    return {
      message: 'data is saved now',
    };
  }

  async download(body: DownloadDataDto): Promise<Response> {
    console.log(body);
    return {
      message: 'here it is, you can see data',
    };
  }
}
