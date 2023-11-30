import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { IStorageProvider } from '../interfaces/storage.interface';
import { MinioService } from 'nestjs-minio-client';
import { Stream } from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3StorageService extends IStorageProvider {
  private readonly objectName: string;
  constructor(
    @Inject(MinioService) 
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.minioService.client.bucketExists('my-bucket', (err, exists) => {
      if (err) {
        console.log(err);
      } else {
        if (!exists) {
          this.minioService.client.makeBucket('my-bucket', (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Bucket created successfully');
            }
          });
        }
      }
    });

    this.objectName = this.configService.get<string>('MINIO_OBJECT_NAME')
  }

  async saveFile(data: string): Promise<string> {
    const metaData = {
      'Content-Type': 'text/plain',
      'X-Amz-Meta-Testing': 1234,
      example: 5678,
    };

    await this.minioService.client.putObject(
      'my-bucket',
      data,
      this.objectName,
      metaData,
    );

    return data;
  }

  async deleteFile(location: string): Promise<void> {
    // Remove the object from the Minio bucket
    await this.minioService.client.removeObject('my-bucket', location);
  }

  async readFile(location: string): Promise<string> {
    // Get the object from the Minio bucket
    const objectStream = await this.minioService.client.getObject(
      'my-bucket',
      location
      // this.objectName,
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
