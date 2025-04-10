import { MessagingService } from '@app/common';
import {
   CreateWorkspaceDTO,
   QueryWorkspaceDTO,
   UpdateWorkspaceDTO,
   WorkspacePermission,
} from '@app/types';
import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   Query,
   UseGuards,
   Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { access } from 'fs';

@Controller('workspace')
@UseGuards(AuthGuard('jwt'))
export class WorkspaceController {
   constructor(private readonly messagingService: MessagingService) {}

   @Post()
   create(@Body() createWorkspaceDTO: CreateWorkspaceDTO, @Request() req) {
      Object.assign(createWorkspaceDTO, {
         owner: req.user.IDUser,
         access: [
            {
               IDCollaborator: req.user.IDUser,
               permission: WorkspacePermission.OWNER,
               isDeleted: false,
            },
         ],
      });
      return this.messagingService.send(
         'workspace.create.workspace',
         createWorkspaceDTO,
      );
   }

   @Get()
   findAll(@Query() query: QueryWorkspaceDTO, @Request() req) {
      return this.messagingService.send('workspace.findAll.workspaces', {
         query,
         IDUser: req.user.IDUser,
      });
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.messagingService.send('workspace.findOne.workspace', id);
   }

   @Patch(':id')
   update(@Param('id') id: string, @Body() updateWorkspaceDTO: UpdateWorkspaceDTO) {
      return this.messagingService.send('workspace.update.workspace', {
         id,
         updateWorkspaceDTO,
      });
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.messagingService.send('workspace.remove.workspace', id);
   }

   @Patch('add-collaborator/:id')
   addCollaborator(@Param('id') IDWorkspace: string, @Body() body) {
      return this.messagingService.send('workspace.addCollaborator.workspace', {
         IDWorkspace,
         IDCollaborator: body.IDCollaborator,
      });
   }

   @Delete('remove-collaborator/:id')
   removeCollaborator(@Param('id') IDWorkspace: string, @Body() body) {
      return this.messagingService.send('workspace.removeCollaborator.workspace', {
         IDWorkspace,
         IDCollaborator: body.IDCollaborator,
      });
   }
}
