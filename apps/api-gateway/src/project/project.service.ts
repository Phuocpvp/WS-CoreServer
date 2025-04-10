import { MessagingService } from '@app/common';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ProjectService implements OnModuleInit {
   constructor(private readonly messagingService: MessagingService) {}

   async onModuleInit() {
      this.messagingService.subscribeToResponseOf('task-manager.create.project');
      this.messagingService.subscribeToResponseOf('task-manager.findAll.projects');
      this.messagingService.subscribeToResponseOf('task-manager.findOne.project');
      this.messagingService.subscribeToResponseOf('task-manager.update.project');
      this.messagingService.subscribeToResponseOf('task-manager.remove.project');
   }
}
