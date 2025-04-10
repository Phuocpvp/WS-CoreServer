import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDTO, QueryWorkspaceDTO, UpdateWorkspaceDTO, WorkspaceAccess } from '@app/types';

@Controller()
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @MessagePattern('workspace.create.workspace')
  create(@Payload() createWorkspaceDTO: CreateWorkspaceDTO) {
    return this.workspaceService.create(createWorkspaceDTO);
  }

  @MessagePattern('workspace.findAll.workspaces')
  findAll(@Payload() payload: { query: QueryWorkspaceDTO; IDUser: string }) {
    return this.workspaceService.findAll(payload.query, payload.IDUser);
  }

  @MessagePattern('workspace.findOne.workspace')
  findOne(@Payload() id: string) {
    return this.workspaceService.findOne(id);
  }

  @MessagePattern('workspace.update.workspace')
  update(@Payload() payload: { id: string; updateWorkspaceDTO: UpdateWorkspaceDTO }) {
    return this.workspaceService.update(payload.id, payload.updateWorkspaceDTO);
  }

  @MessagePattern('workspace.remove.workspace')
  remove(@Payload() id: string) {
    return this.workspaceService.remove(id);
  }

  @MessagePattern('workspace.addCollaborator.workspace')
  addCollaborator(@Payload() payload: { IDWorkspace: string; IDCollaborator: string }) {
    return this.workspaceService.addCollaborator(payload.IDWorkspace, payload.IDCollaborator);
  }

  @MessagePattern('workspace.removeCollaborator.workspace')
  removeCollaborator(@Payload() payload: { IDWorkspace: string; IDCollaborator: string }) {
    return this.workspaceService.removeCollaborator(payload.IDWorkspace, payload.IDCollaborator);
  }
}
