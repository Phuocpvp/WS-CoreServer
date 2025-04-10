import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskAttachmentService } from './task-attachment.service';
import {
   CreateTaskAttachmentDTO,
   QueryTaskAttachmentDTO,
   UpdateTaskAttachmentDTO,
} from '@app/types';

@Controller()
export class TaskAttachmentController {
   constructor(private readonly taskAttachmentService: TaskAttachmentService) {}

   @MessagePattern('task-manager.create.task-attachment')
   create(@Payload() createTaskAttachmentDTO: CreateTaskAttachmentDTO) {
      return this.taskAttachmentService.create(createTaskAttachmentDTO);
   }

   @MessagePattern('task-manager.findAll.task-attachments')
   findAll(@Payload() query: QueryTaskAttachmentDTO) {
      return this.taskAttachmentService.findAll(query);
   }

   @MessagePattern('task-manager.findOne.task-attachment')
   findOne(@Payload() id: string) {
      return this.taskAttachmentService.findOne(id);
   }

   @MessagePattern('task-manager.update.task-attachment')
   update(
      @Payload()
      payload: {
         id: string;
         updateTaskAttachmentDTO: UpdateTaskAttachmentDTO;
      },
   ) {
      return this.taskAttachmentService.update(
         payload.id,
         payload.updateTaskAttachmentDTO,
      );
   }

   @MessagePattern('task-manager.remove.task-attachment')
   remove(@Payload() id: string) {
      return this.taskAttachmentService.remove(id);
   }
}
