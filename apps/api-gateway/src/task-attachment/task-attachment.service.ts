import { MessagingService } from '@app/common';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class TaskAttachmentService implements OnModuleInit {
   constructor(private readonly messagingService: MessagingService) {}

   async onModuleInit() {
      this.messagingService.subscribeToResponseOf('task-manager.create.task-attachment');
      this.messagingService.subscribeToResponseOf('task-manager.findAll.task-attachments');
      this.messagingService.subscribeToResponseOf('task-manager.findOne.task-attachment');
      this.messagingService.subscribeToResponseOf('task-manager.update.task-attachment');
      this.messagingService.subscribeToResponseOf('task-manager.remove.task-attachment');
   }
}
