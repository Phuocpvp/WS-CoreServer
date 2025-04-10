import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsMongoId, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { TeamMember } from '@app/types/interfaces/team-member.interface';
import { TeamMemberDTO } from './team-member.dto';

export class CreateTeamDTO {
  @IsMongoId()
  @IsNotEmpty()
  manager: string;

  @IsString()
  @IsNotEmpty()
  teamName: string;

  @IsNumber()
  teamSize: number;

  @IsString()
  @IsNotEmpty()
  teamDescription: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDTO)
  members?: TeamMember[];
}