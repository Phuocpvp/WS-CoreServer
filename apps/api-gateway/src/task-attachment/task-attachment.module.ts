import { Module } from '@nestjs/common';
import { TaskAttachmentService } from './task-attachment.service';
import { TaskAttachmentController } from './task-attachment.controller';
import { MessagingModule } from '@app/common';

@Module({
   imports: [MessagingModule],
   controllers: [TaskAttachmentController],
   providers: [TaskAttachmentService],
})
export class TaskAttachmentModule {}
