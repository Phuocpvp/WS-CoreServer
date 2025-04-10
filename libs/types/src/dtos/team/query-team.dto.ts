import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class QueryTeamDTO {
  @IsOptional()
  @IsMongoId()
  id?: string;

  @IsOptional()
  @IsString()
  teamName?: string;

  @IsOptional()
  @IsMongoId()
  manager?: string;
}