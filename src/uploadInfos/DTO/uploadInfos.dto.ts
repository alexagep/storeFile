import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

export class DownloadDataDto {
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  name: string;

  @IsString({ message: 'tag must be a string' })
  @IsOptional()
  tag: string;
}

class MetaDataDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsString({ message: 'tag must be a string' })
  @IsNotEmpty({ message: 'tag is required' })
  tag: string;

  @IsString({ message: 'type must be a string' })
  @IsNotEmpty({ message: 'type is required' })
  type: string;
}

export class UploadDataDto {
  @ValidateNested()
  @Type(() => MetaDataDto)
  metadata: MetaDataDto;

  @IsString({ message: 'data must be a string' })
  @IsNotEmpty({ message: 'data is required' })
  data: string;
}