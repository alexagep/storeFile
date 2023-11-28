import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { UploadInfos } from '../uploadInfos/uploadInfos.entity';
const CONNECTION_TYPE = 'postgres';

export default registerAs(
  'typeorm',
  (): DataSourceOptions => ({
    type: CONNECTION_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [UploadInfos],
  }),
);
