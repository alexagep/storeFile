import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DownloadDataDto {
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsString({ message: 'tag must be a string' })
  @IsOptional()
  @ApiProperty()
  tag: string;
}

class MetaDataDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  @ApiProperty()
  name: string;

  @IsString({ message: 'tag must be a string' })
  @IsNotEmpty({ message: 'tag is required' })
  @ApiProperty()
  tag: string;

  @IsString({ message: 'type must be a string' })
  @IsNotEmpty({ message: 'type is required' })
  @ApiProperty()
  type: string;
}

export class UploadDataDto {
  
  @IsNotEmpty({ message: 'metadata is required' })
  @ValidateNested()
  @ApiProperty()
  @Type(() => MetaDataDto)
  metadata: MetaDataDto;

  @IsString({ message: 'data must be a string' })
  @IsNotEmpty({ message: 'data is required' })
  @ApiProperty()
  data: string;
}