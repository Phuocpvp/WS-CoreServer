import { IsOptional, IsString } from 'class-validator';

export class QueryWorkspaceDTO {
   @IsOptional()
   @IsString()
   workspaceName?: string;
}