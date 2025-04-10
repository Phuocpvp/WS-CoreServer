import { MessagingService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TeamService {
   constructor(private readonly messagingService: MessagingService) {}

   async onModuleInit() {
      this.messagingService.subscribeToResponseOf('task-manager.create.team');
      this.messagingService.subscribeToResponseOf('task-manager.findAll.teams');
      this.messagingService.subscribeToResponseOf('task-manager.findOne.team');
      this.messagingService.subscribeToResponseOf('task-manager.update.team');
      this.messagingService.subscribeToResponseOf('task-manager.remove.team');
      this.messagingService.subscribeToResponseOf('task-manager.addMember.team');
      this.messagingService.subscribeToResponseOf('task-manager.removeMember.team');
   }
}
