// local-storage-provider.factory.ts
import { Injectable } from '@nestjs/common';
import { IStorageProvider, IStorageProviderFactory } from './storage-provider.interface';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

// Implement a concrete subclass for local storage
@Injectable()
export class LocalStorageProviderFactory implements IStorageProviderFactory {
  constructor(private readonly configService: ConfigService) {}

  createStorageProvider(): IStorageProvider {
    return new LocalStorage(this.configService);
  }
}

// Implement the local storage provider
class LocalStorage implements IStorageProvider {
  constructor(private readonly configService: ConfigService) {}

  async saveFile(data: string, filename: string): Promise<string> {
    const newName = `maani-file-${randomUUID()}-${filename}.txt`;
    const saveTo = join(process.cwd(), `${this.configService.get<string>('STORE_LOCATION')}`, newName);
    await fs.promises.writeFile(saveTo, data);
    return saveTo;
  }

  async deleteFile(location: string): Promise<void> {
    await fs.promises.unlink(location);
  }
}
