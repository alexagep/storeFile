import { Test, TestingModule } from '@nestjs/testing';
import { UploadInfoService } from './uploadInfos.service';
import { ConfigService } from '@nestjs/config';
import { UploadInfos } from './uploadInfos.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { storageServiceFactory } from '../common/providers-factory/storage-service.factory';
import { MinioModule } from 'nestjs-minio-client';
import {config} from 'dotenv'
import * as fs from 'fs'

config();

describe('UploadInfoService TEST', () => {
  let uploadInfoService: UploadInfoService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  jest.mock('fs', () => ({
    promises: {
      writeFile: jest.fn(),
    },
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadInfoService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(UploadInfos),
          useValue: jest.fn(),
        },
        storageServiceFactory,
        // MinioService, // You don't need to provide this explicitly
      ],
      imports: [
        // Import the MinioModule with the async options
        MinioModule.register({
          endPoint: process.env.MINIO_ENDPOINT,
          port: parseInt(process.env.MINIO_PORT),
          useSSL: false,
          accessKey: process.env.MINIO_ACCESSKEY,
          secretKey: process.env.MINIO_SECRETKEY,
        })
      ],
    }).compile();
  
    uploadInfoService = module.get<UploadInfoService>(UploadInfoService);
    configService = module.get<ConfigService>(ConfigService);
  });
  

  it('should be defined', () => {
    expect(uploadInfoService).toBeDefined();
  });

  it('should save the file and return the path', async () => {
    const data = 'data';
    const filename = 'file';

    configService.get = jest.fn().mockReturnValue('uploads');

    fs.promises.writeFile = jest.fn().mockResolvedValue(undefined);

    const result = await uploadInfoService.saveFile(data, filename);

    const regex = /file\.txt$/;

    expect(result).toMatch(regex);
  });

  it('should check if an object is empty', () => {
    // Arrange
    const emptyObj = {};
    const nonEmptyObj = { foo: 'bar' };
  
    // Act
    const result1 = uploadInfoService.isEmpty(emptyObj);
    const result2 = uploadInfoService.isEmpty(nonEmptyObj);
  
    // Assert
    expect(result1).toBe(true);
    expect(result2).toBe(false);
  });
  
});
