import { IsString, IsOptional, IsArray, ValidateNested, IsMongoId, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { TeamMember } from '@app/types';
import { TeamMemberDTO } from './team-member.dto';

export class UpdateTeamDTO {
  @IsOptional()
  @IsMongoId()
  manager?: string;

  @IsOptional()
  @IsString()
  teamName?: string;

  @IsOptional()
  @IsString()
  teamDescription?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDTO)
  members?: TeamMember[];

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}