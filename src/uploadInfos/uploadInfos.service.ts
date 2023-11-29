import { Injectable } from '@nestjs/common';
import { DownloadDataDto, UploadDataDto } from './DTO/uploadInfos.dto';
import { Response } from './uploadInfos.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadInfos } from './uploadInfos.entity';
import { QueryRunner, Repository } from 'typeorm';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { join } from 'path';

@Injectable()
export class UploadInfoService {
  constructor(
    @InjectRepository(UploadInfos)
    private readonly uploadInfoRepository: Repository<UploadInfos>,
  ) {}

  async download(body: DownloadDataDto): Promise<Response> {
    // const { name, tag } = body;
    const uploadInfos = await this.getUploadInfo(body);

    const queryRunner =
      this.uploadInfoRepository.manager.connection.createQueryRunner();

    // start a new transaction
    await queryRunner.startTransaction();

    try {
      // Update isDownloaded field after download
      const data = await this.downloadAndUpdate(uploadInfos, queryRunner);

      console.log(data);

      // commit the transaction
      await queryRunner.commitTransaction();

      let message = null;

      if (data.length > 0) {
        message = '***Here is the data***';
      } else {
        message = 'there is no data with provided info';
      }
      return { message };
    } catch (err) {
      // if we have errors we rollback the transaction
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async downloadAndUpdate(
    uploadInfos: UploadInfos[],
    queryRunner: QueryRunner,
  ): Promise<string[]> {
    const data = [];
    for (const uploadInfo of uploadInfos) {
      const fileData = await this.readFile(uploadInfo.location);
      if (fileData) {
        const obj = {
          metadata: {
            tag: uploadInfo.tag,
            name: uploadInfo.name,
            type: uploadInfo.type,
          },
          data,
        };

        data.push(fileData);

        // Update isDownloaded field after download
        uploadInfo.isDownloaded = true;
        await queryRunner.manager.save(uploadInfo);
      }
    }
    return data;
  }

  async saveFile(data: string, filename: string): Promise<string> {
    const newName = `maani-file-${randomUUID()}-${filename}.txt`;
    const saveTo = join(process.cwd(), 'uploads', newName);
    await fs.promises.writeFile(saveTo, data);
    return saveTo;
  }

  async deleteFile(path: string): Promise<void> {
    await fs.promises.unlink(path);
  }

  async saveUploadInfo(metadata: any, location: string): Promise<UploadInfos> {
    const savedData = { ...metadata, location };
    const queryRunner =
      this.uploadInfoRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    let createdUser = null;

    try {
      createdUser = await queryRunner.manager.save(
        this.uploadInfoRepository.create(savedData),
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return createdUser;
  }

  async upload(body: UploadDataDto): Promise<Response> {
    const { metadata, data } = body;
    let createdUser = null;
    let saveTo = '';

    try {
      saveTo = await this.saveFile(data, metadata.name);
      createdUser = await this.saveUploadInfo(metadata, saveTo);
    } catch (error) {
      console.error(error);
      if (saveTo) {
        await this.deleteFile(saveTo);
      }
      throw error;
    }

    console.log(createdUser);

    return {
      message: 'data is saved now',
    };
  }

  async readFile(path: string): Promise<string> {
    return await fs.promises.readFile(path, 'utf8');
  }

  async getUploadInfo(body: DownloadDataDto): Promise<UploadInfos[]> {
    if (body) {
      return await this.uploadInfoRepository.find({
        where: { ...body, isDownloaded: false },
      });
    } else {
      const uploadInfos = await this.uploadInfoRepository.find({
        where: { isDownloaded: false },
        order: { createdAt: 'ASC' }, // Sort by createdAt
        take: 1, // Add this line to take only the first row
      });
      return uploadInfos.length > 0 ? uploadInfos : [];
    }
  }

  // async downloadData(uploadInfos: UploadInfos[]): Promise<string[]> {
  //   const data = [];
  //   for (const uploadInfo of uploadInfos) {
  //     const fileData = await this.readFile(uploadInfo.location);
  //     data.push(fileData);
  //   }
  //   return data;
  // }

  // async upload(body: UploadDataDto): Promise<Response> {
  //   // get the metadata and data from the uploadData object
  //   const { metadata, data } = body;
  //   const newName = `maani-file-${randomUUID()}-${metadata.name}.txt`;
  //   const saveTo = join(process.cwd(), 'uploads', newName);

  //   let createdUser = null;
  //   try {
  //     await fs.promises.writeFile(saveTo, data);

  //     const savedData = { ...metadata, location: saveTo };

  //     // Start a transaction
  //     const queryRunner =
  //       this.uploadInfoRepository.manager.connection.createQueryRunner();
  //     await queryRunner.startTransaction();

  //     try {
  //       createdUser = await queryRunner.manager.save(
  //         this.uploadInfoRepository.create(savedData),
  //       );
  //       await queryRunner.commitTransaction();
  //     } catch (err) {
  //       // If an error occurs, rollback the transaction
  //       await queryRunner.rollbackTransaction();
  //       throw err;
  //     } finally {
  //       // Release the query runner
  //       await queryRunner.release();
  //     }
  //   } catch (error) {
  //     console.error(error);

  //     // If an error occurs, delete the file
  //     await fs.promises.unlink(saveTo);

  //     throw error;
  //   }

  //   console.log(createdUser);

  //   return {
  //     message: 'data is saved now',
  //   };
  // }

  // async download(body: DownloadDataDto): Promise<Response> {
  //   console.log(body);
  //   return {
  //     message: 'here it is, you can see data',
  //   };
  // }
}
