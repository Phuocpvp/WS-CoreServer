import { MessagingService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkspaceService {
   constructor(private readonly messagingService: MessagingService) {}

   async onModuleInit() {
      this.messagingService.subscribeToResponseOf('workspace.create.workspace');
      this.messagingService.subscribeToResponseOf('workspace.findAll.workspaces');
      this.messagingService.subscribeToResponseOf('workspace.findOne.workspace');
      this.messagingService.subscribeToResponseOf('workspace.update.workspace');
      this.messagingService.subscribeToResponseOf('workspace.remove.workspace');
      this.messagingService.subscribeToResponseOf('workspace.addCollaborator.workspace');
      this.messagingService.subscribeToResponseOf('workspace.removeCollaborator.workspace');
      this.messagingService.subscribeToResponseOf(
         'workspace.addMember.workspace',
      );
      this.messagingService.subscribeToResponseOf(
         'workspace.removeMember.workspace',
      );
   }
}
