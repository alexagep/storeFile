import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { UploadInfos } from 'src/uploadInfos/uploadInfos.entity';
import { IStorageProvider } from '../interfaces/storage.interface';

@Injectable()
export class LocalStorageService extends IStorageProvider {
  async saveFile(data: string, filename: string): Promise<string> {
    const newName = `maani-file-${randomUUID()}-${filename}.txt`;
    const saveTo = join(
      process.cwd(),
      process.env.STORE_LOCATION,
      newName,
    );
    await fs.promises.writeFile(saveTo, data);
    return saveTo;
  }

  async deleteFile(location: string): Promise<void> {
    await fs.promises.unlink(location);
  }

  async readFile(location: string): Promise<string> {
    return await fs.promises.readFile(location, 'utf8');
  }
}
