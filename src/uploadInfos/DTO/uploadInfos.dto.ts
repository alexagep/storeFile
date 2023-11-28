import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

class MetaDataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}

export class UploadDataDto {
  @IsNotEmpty()
  metadata: MetaDataDto;

  @IsString()
  @IsNotEmpty()
  data: string;
}

export class DownloadDataDto {
  @IsString()
  @IsOptional()
  name: MetaDataDto;

  @IsString()
  @IsOptional()
  tag: string;
}
