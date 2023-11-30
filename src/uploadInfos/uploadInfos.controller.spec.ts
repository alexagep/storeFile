// Import the necessary modules and dependencies
import { Test, TestingModule } from '@nestjs/testing';
import { UploadInfoController } from './uploadInfos.controller';
import { UploadInfoService } from './uploadInfos.service';
import { UploadDataDto, DownloadDataDto } from './DTO/uploadInfos.dto';
import { Response } from './uploadInfos.interface';

// Create a mock service that returns some dummy data
const mockUploadInfoService = {
  upload: jest.fn((body: UploadDataDto) => {
    return {
      data: body,
    };
  }),
  download: jest.fn((body: DownloadDataDto) => {
    return {
      data: body,
    };
  }),
};

// Create a test suite for the UploadInfoController
describe('UploadInfoController', () => {
  let controller: UploadInfoController;

  // Set up the testing module before each test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadInfoController],
      providers: [UploadInfoService],
    })
      .overrideProvider(UploadInfoService)
      .useValue(mockUploadInfoService)
      .compile();

    controller = module.get<UploadInfoController>(UploadInfoController);
  });

  // Test if the controller is defined
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test the create method with a valid body
  it('should upload data and return a success response', async () => {
    const body: UploadDataDto = {
      metadata: {
        name: 'string',
        tag: 'string',
        type: 'string',
      },
      data: 'stringdatsalamasasa',
    };

    const expectedResponse = {
      data: {
        metadata: {
          name: 'string',
          tag: 'string',
          type: 'string',
        },
        data: 'stringdatsalamasasa',
      },
    };

    expect(await controller.upload(body)).toEqual(expectedResponse);
    expect(mockUploadInfoService.upload).toHaveBeenCalledWith(body);
  });

  it('should download data and return a success response', async () => {
    const body: DownloadDataDto = {
      name: 'string0',
      tag: 'string',
    };
    const expectedResponse = {
      data: {
        name: 'string0',
        tag: 'string',
      },
    };
    expect(await controller.download(body)).toEqual(expectedResponse);
    expect(mockUploadInfoService.download).toHaveBeenCalledWith(body);
  });
});
