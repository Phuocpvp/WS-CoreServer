import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MessagingModule } from '@app/common';

@Module({
   imports: [MessagingModule],
   controllers: [TaskController],
   providers: [TaskService],
})
export class TaskModule {}
