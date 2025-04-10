import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectService } from './project.service';
import {
   CreateProjectDTO,
   QueryProjectDTO,
   UpdateProjectDTO,
} from '@app/types';

@Controller()
export class ProjectController {
   constructor(private readonly projectService: ProjectService) {}

   @MessagePattern('task-manager.create.project')
   create(@Payload() createProjectDTO: CreateProjectDTO) {
      return this.projectService.create(createProjectDTO);
   }

   @MessagePattern('task-manager.findAll.projects')
   findAll(@Payload() query: QueryProjectDTO) {
      return this.projectService.findAll(query);
   }

   @MessagePattern('task-manager.findOne.project')
   findOne(@Payload() id: string) {
      return this.projectService.findOne(id);
   }

   @MessagePattern('task-manager.update.project')
   update(
      @Payload() payload: { id: string; updateProjectDTO: UpdateProjectDTO },
   ) {
      return this.projectService.update(payload.id, payload.updateProjectDTO);
   }

   @MessagePattern('task-manager.remove.project')
   remove(@Payload() id: string) {
      return this.projectService.remove(id);
   }
}
