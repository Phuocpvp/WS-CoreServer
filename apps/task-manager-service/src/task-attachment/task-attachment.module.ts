import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskAttachmentService } from './task-attachment.service';
import { TaskAttachmentController } from './task-attachment.controller';
import { TaskAttachment, TaskAttachmentSchema } from './schemas/task-attachment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TaskAttachment.name, schema: TaskAttachmentSchema }]),
  ],
  controllers: [TaskAttachmentController],
  providers: [TaskAttachmentService],
})
export class TaskAttachmentModule {}
