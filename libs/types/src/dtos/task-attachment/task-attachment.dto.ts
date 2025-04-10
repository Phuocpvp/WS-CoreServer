import { IsString, IsMongoId, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { fileType } from '../../enums/file-type.enum';

export class CreateTaskAttachmentDTO {
  @IsMongoId()
  idTask: string;

  @IsMongoId()
  uploadedBy: string;

  @IsString()
  fileName: string;

  @IsEnum(fileType)
  fileType: fileType;

  @IsString()
  fileURL: string;

  @IsBoolean()
  @IsOptional()
  isFinalFile?: boolean;
}

export class UpdateTaskAttachmentDTO {
  @IsString()
  @IsOptional()
  fileName?: string;

  @IsEnum(fileType)
  @IsOptional()
  fileType?: fileType;

  @IsString()
  @IsOptional()
  fileURL?: string;

  @IsBoolean()
  @IsOptional()
  isFinalFile?: boolean;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}

export class QueryTaskAttachmentDTO {
  @IsMongoId()
  @IsOptional()
  idTask?: string;

  @IsMongoId()
  @IsOptional()
  uploadedBy?: string;

  @IsString()
  @IsOptional()
  fileName?: string;

  @IsEnum(fileType)
  @IsOptional()
  fileType?: fileType;

  @IsBoolean()
  @IsOptional()
  isFinalFile?: boolean;
}