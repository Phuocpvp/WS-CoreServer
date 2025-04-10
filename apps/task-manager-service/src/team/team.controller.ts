import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TeamService } from './team.service';
import { CreateTeamDTO, QueryTeamDTO, UpdateTeamDTO } from '@app/types';

@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @MessagePattern('task-manager.create.team')
  create(@Payload() createTeamDTO: CreateTeamDTO) {
    return this.teamService.create(createTeamDTO);
  }

  @MessagePattern('task-manager.findAll.teams')
  findAll(@Payload() payload : { query: QueryTeamDTO, IDUser: string }) {
    return this.teamService.findAll(payload.query, payload.IDUser);
  }

  @MessagePattern('task-manager.findOne.team')
  findOne(@Payload() id: string) {
    return this.teamService.findOne(id);
  }

  @MessagePattern('task-manager.update.team')
  update(@Payload() payload: { id: string; updateTeamDTO: UpdateTeamDTO }) {
    return this.teamService.update(payload.id, payload.updateTeamDTO);
  }

  @MessagePattern('task-manager.remove.team')
  remove(@Payload() id: string) {
    return this.teamService.remove(id);
  }

  @MessagePattern('task-manager.addMember.team')
  addMember(@Payload() payload: { IDTeam: string; IDMember: string }) {
    return this.teamService.addMember(payload.IDTeam, payload.IDMember);
  }

  @MessagePattern('task-manager.removeMember.team')
  removeMember(@Payload() payload: { IDTeam: string; IDMember: string }) {
    return this.teamService.removeMember(payload.IDTeam, payload.IDMember);
  }
}
