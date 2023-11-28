import { Test, TestingModule } from '@nestjs/testing';
import { UploadInfoService } from './uploadInfos.service';

describe('UploadInfoService', () => {
  let service: UploadInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadInfoService],
    }).compile();

    service = module.get<UploadInfoService>(UploadInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
