import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { IStorageProvider } from '../interfaces/storage.interface';
import { MinioService } from 'nestjs-minio-client';
import { Stream } from 'stream';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

@Injectable()
export class S3StorageService extends IStorageProvider {
  private readonly bucketName: string;

  constructor(
    @Inject(MinioService) 
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.bucketName = this.configService.get<string>('MINIO_BUCKET_NAME')
    this.minioService.client.bucketExists(this.bucketName, (err, exists) => {
      if (err) {
        console.log(err);
      } else {
        if (!exists) {
          this.minioService.client.makeBucket(this.bucketName, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Bucket created successfully');
            }
          });
        }
      }
    });
  }

  async saveFile(data: string): Promise<string> {
    const metaData = {
      'Content-Type': 'text/plain',
      'X-Amz-Meta-Testing': 1234,
      example: 5678,
    };

    const randomString = randomBytes(8).toString('hex');


    await this.minioService.client.putObject(
      this.bucketName,
      randomString,
      data,
      metaData,
    );

    return randomString;
  }

  async deleteFile(location: string): Promise<void> {
    await this.minioService.client.removeObject(this.bucketName, location);
  }

  async readFile(location: string): Promise<string> {
    const objectStream = await this.minioService.client.getObject(
      this.bucketName,
      location
    );

    const string = await this.streamToString(objectStream);

    return string;
  }

  streamToString(stream: Stream): Promise<string> {
    const chunks = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }
}
