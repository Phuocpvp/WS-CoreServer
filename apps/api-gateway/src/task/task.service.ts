import { MessagingService } from '@app/common';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class TaskService implements OnModuleInit {
   constructor(private readonly messagingService: MessagingService) {}

   async onModuleInit() {
      this.messagingService.subscribeToResponseOf('task-manager.create.task');
      this.messagingService.subscribeToResponseOf('task-manager.findAll.tasks');
      this.messagingService.subscribeToResponseOf('task-manager.findOne.task');
      this.messagingService.subscribeToResponseOf('task-manager.update.task');
      this.messagingService.subscribeToResponseOf('task-manager.remove.task');
   }
}
