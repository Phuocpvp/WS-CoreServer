import { IsString, IsOptional, IsDate, IsEnum, IsArray, IsMongoId } from 'class-validator';

// Enum for task priority
export enum TaskPriorityEnum {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

// Tag DTO
export interface TagDTO {
  tagName: string;
}

export class CreateTaskDTO {
  @IsMongoId()
  idProject: string;

  @IsMongoId()
  idAssignee: string;

  @IsMongoId()
  status: string;

  @IsString()
  taskName: string;

  @IsEnum(TaskPriorityEnum)
  @IsOptional()
  priority?: TaskPriorityEnum;

  @IsDate()
  startDay: Date;

  @IsDate()
  endDay: Date;

  @IsDate()
  dueDay: Date;

  @IsArray()
  @IsOptional()
  tag?: TagDTO[];
}

export class UpdateTaskDTO {
  @IsMongoId()
  @IsOptional()
  idProject?: string;

  @IsMongoId()
  @IsOptional()
  idAssignee?: string;

  @IsMongoId()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  taskName?: string;

  @IsEnum(TaskPriorityEnum)
  @IsOptional()
  priority?: TaskPriorityEnum;

  @IsDate()
  @IsOptional()
  startDay?: Date;

  @IsDate()
  @IsOptional()
  endDay?: Date;

  @IsDate()
  @IsOptional()
  dueDay?: Date;

  @IsArray()
  @IsOptional()
  tag?: TagDTO[];
}

export class QueryTaskDTO {
  @IsMongoId()
  @IsOptional()
  idProject?: string;

  @IsMongoId()
  @IsOptional()
  idAssignee?: string;

  @IsMongoId()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  taskName?: string;

  @IsEnum(TaskPriorityEnum)
  @IsOptional()
  priority?: TaskPriorityEnum;
}