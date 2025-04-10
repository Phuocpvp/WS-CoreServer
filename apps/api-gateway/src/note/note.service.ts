import { MessagingService } from '@app/common';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class NoteService implements OnModuleInit {
   constructor(private readonly messagingService: MessagingService) {}

   async onModuleInit() {
      this.messagingService.subscribeToResponseOf('note.create.note');
      this.messagingService.subscribeToResponseOf('note.findAll.notes');
      this.messagingService.subscribeToResponseOf('note.findOne.note');
      this.messagingService.subscribeToResponseOf('note.update.note');
      this.messagingService.subscribeToResponseOf('note.remove.note');
   }
}
