import { MigrationInterface, QueryRunner } from 'typeorm';

export class UploadInfos1701191511831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        create table if not exists "UploadInfos"
        (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" varchar(255) unique NOT NULL,
            "tag" varchar(255) NOT NULL,
            "type" varchar(255) NOT NULL,
            "location" varchar(255) NOT NULL,
            "path" varchar(255),
            "isDownloaded" boolean default false,
            "createdAt"     timestamp not null default CURRENT_TIMESTAMP,
            "updatedAt"     timestamp,
            CONSTRAINT "UQ_name_tag" UNIQUE ("name", "tag")
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(` DROP TABLE "uploadinfos" `);
  }
}
