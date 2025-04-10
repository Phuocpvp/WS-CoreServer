import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskService } from './task.service';
import {
   CreateTaskDTO,
   QueryTaskDTO,
   UpdateTaskDTO,
} from '@app/types';

@Controller()
export class TaskController {
   constructor(private readonly taskService: TaskService) {}

   @MessagePattern('task-manager.create.task')
   create(@Payload() createTaskDTO: CreateTaskDTO) {
      return this.taskService.create(createTaskDTO);
   }

   @MessagePattern('task-manager.findAll.tasks')
   findAll(@Payload() query: QueryTaskDTO) {
      return this.taskService.findAll(query);
   }

   @MessagePattern('task-manager.findOne.task')
   findOne(@Payload() id: string) {
      return this.taskService.findOne(id);
   }

   @MessagePattern('task-manager.update.task')
   update(
      @Payload() payload: { id: string; updateTaskDTO: UpdateTaskDTO },
   ) {
      return this.taskService.update(payload.id, payload.updateTaskDTO);
   }

   @MessagePattern('task-manager.remove.task')
   remove(@Payload() id: string) {
      return this.taskService.remove(id);
   }
}
