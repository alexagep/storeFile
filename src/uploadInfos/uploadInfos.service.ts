import { Inject, Injectable } from '@nestjs/common';
import { DownloadDataDto, UploadDataDto } from './DTO/uploadInfos.dto';
import { Response } from './uploadInfos.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadInfos } from './uploadInfos.entity';
import { QueryRunner, Repository } from 'typeorm';
import { StorageType } from 'src/common/providers.type';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class UploadInfoService {
  constructor(
    @InjectRepository(UploadInfos)
    private readonly uploadInfoRepository: Repository<UploadInfos>,
    @Inject('STORAGE_PROVIDER_FACTORY')
    private storage: StorageType,

    private readonly configService: ConfigService,
  ) {}

  async download(body: DownloadDataDto): Promise<Response> {
    const uploadInfos = await this.getUploadInfo(body);

    const queryRunner =
      this.uploadInfoRepository.manager.connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const data = await this.downloadAndUpdate(uploadInfos, queryRunner);

      await queryRunner.commitTransaction();

      let message = null;

      if (data.length > 0) {
        message = data;
      } else {
        message = 'there is no data with provided info';
      }
      return { message };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
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
          data: fileData,
        };

        data.push(obj);

        uploadInfo.isDownloaded = true;
        await queryRunner.manager.save(uploadInfo);
      }
    }

    return data;
  }

  async saveFile(data: string, filename: string): Promise<string> {
    return this.storage.saveFile(data, filename);
  }

  async deleteFile(path: string): Promise<void> {
    await this.storage.deleteFile(path);
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

    return {
      message: 'data is saved now',
    };
  }

  async readFile(location: string): Promise<string> {
    return await this.storage.readFile(location);
  }

  async getUploadInfo(body: DownloadDataDto): Promise<UploadInfos[]> {
    if (!this.isEmpty(body)) {
      return await this.uploadInfoRepository.find({
        where: { ...body, isDownloaded: false },
      });
    } else {
      const uploadInfos = await this.uploadInfoRepository.find({
        where: { isDownloaded: false },
        order: { createdAt: 'ASC' },
        take: 1,
      });
      return uploadInfos.length > 0 ? uploadInfos : [];
    }
  } 
 
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deleteDownloadedRowsAndFiles() {
    const rows = await this.uploadInfoRepository.find({
      where: { isDownloaded: true },
    });

    await Promise.all(
      rows.map(async (row) => {
        const path = row.location;
        try {
          await fs.promises.unlink(path);
        } catch (error) {
          console.error(error.message);
        }

        await this.uploadInfoRepository.delete(row.id);
        console.log(`Row ${row.id} deleted`);
      }),
    );
    console.log('Cron job completed');
  }

  isEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
  }
}
