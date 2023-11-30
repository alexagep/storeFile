// import { Injectable } from '@nestjs/common';
// import {
//   IStorageProvider,
//   IStorageProviderFactory,
// } from './storage-provider.interface';
// import * as fs from 'fs';
// import { randomUUID } from 'crypto';
// import { join } from 'path';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class S3StorageProviderFactory implements IStorageProviderFactory {
//   constructor(private readonly configService: ConfigService) {}

//   createStorageProvider(): IStorageProvider {
//     return new S3Storage(this.configService);
//   }
// }
