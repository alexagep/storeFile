import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

class MetaDataDto {
  @IsString({ message: 'name must be a string' })
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
  @IsNotEmpty({ message: 'metadata is required' })
  metadata: MetaDataDto;

  @IsString({ message: 'data must be a string' })
  @IsNotEmpty({ message: 'data is required' })
  data: string;
}

export class DownloadDataDto {
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  name: string;

  @IsString({ message: 'tag must be a string' })
  @IsOptional()
  tag: string;
}
