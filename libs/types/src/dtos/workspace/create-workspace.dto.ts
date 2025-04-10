import { WorkspaceAccess } from '@app/types/interfaces/workspace-access.interface';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateWorkspaceDTO {
   @IsNotEmpty()
   @IsString()
   workspaceName: string;

   @IsOptional()
   @IsString()
   workspaceDescription?: string;

   @IsNotEmpty()
   owner: Types.ObjectId;

   access: WorkspaceAccess[];
}