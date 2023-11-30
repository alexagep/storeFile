import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UploadDataDto, DownloadDataDto } from '../src/uploadInfos/DTO/uploadInfos.dto';
import { randomUUID } from 'crypto';

describe('UploadInfoController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const uuidName = randomUUID()

  it('/data/upload (POST)', async () => {
    const uploadData: UploadDataDto = {
      metadata: {
        name: uuidName,
        type: 'text/plain',
        tag: 'test',
      },
      data: 'Hello world',
    };
    const response = await request(app.getHttpServer())
      .post('/data/upload')
      .send(uploadData)
      .expect(201);
    expect(response.body.message).toEqual('data is saved now');
  });

  it('/data/download (POST)', async () => {
    const downloadData: DownloadDataDto = {
      name: uuidName,
      tag: 'test',
    };
    const response = await request(app.getHttpServer())
      .post('/data/download')
      .send(downloadData)
      .expect(201);
    expect(response.body.message).toHaveLength(1);
    expect(response.body.message[0].metadata).toEqual({
      name: uuidName,
      type: 'text/plain',
      tag: 'test',
    });
    expect(response.body.message[0].data).toEqual('Hello world');
  });
});
