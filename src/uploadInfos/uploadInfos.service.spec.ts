import { Test, TestingModule } from '@nestjs/testing';
import { UploadInfoService } from './uploadInfos.service';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { join } from 'path';
import * as fs from 'fs';
import { UploadInfos } from './uploadInfos.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UploadInfoService TEST', () => {
  let uploadInfoService: UploadInfoService; // Rename the variable to avoid confusion
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
      ],
    }).compile();

    uploadInfoService = module.get<UploadInfoService>(UploadInfoService); // Use UploadInfoService as the type parameter
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(uploadInfoService).toBeDefined();
  });

  it('should save the file and return the path', async () => {
    const data = 'data';
    const filename = 'file';

    const newName = `maani-file-${randomUUID()}-${filename}.txt`;
    const saveTo = join(
      process.cwd(),
      `${configService.get<string>('STORE_LOCATION')}`,
      newName,
    );

    configService.get = jest.fn().mockReturnValue('uploads');

    fs.promises.writeFile = jest.fn().mockResolvedValue(undefined);

    // const result = await uploadInfoService.saveFile(data, filename);

    const regex = /file\.txt$/;

    expect(result).toMatch(regex);

    expect(configService.get).toHaveBeenCalledWith('STORE_LOCATION');
  });
});
