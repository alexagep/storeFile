import { Module } from '@nestjs/common';
import { UploadInfoModule } from './uploadInfos/uploadInfos.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [databaseConfig],
        }),
      ],
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('typeorm'),

      inject: [ConfigService],
    }),
    UploadInfoModule,
  ],
})
export class AppModule {}
