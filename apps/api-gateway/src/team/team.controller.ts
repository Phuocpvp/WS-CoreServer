import { MessagingService } from '@app/common';
import {
   CreateTeamDTO,
   QueryTeamDTO,
   RoleTeamEnum,
   UpdateTeamDTO,
} from '@app/types';
import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   Query,
   UseGuards,
   Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('team')
@UseGuards(AuthGuard('jwt'))
export class TeamController {
   constructor(private readonly messagingService: MessagingService) {}

   @Post()
   create(@Body() createTeamDTO: CreateTeamDTO, @Request() req) {
      Object.assign(createTeamDTO, {
         manager: req.user.IDUser,
         teamSize: 0,
         members: [
            {
               IDMember: req.user.IDUser,
               roleInTeam: RoleTeamEnum.MANAGER,
               joinedAt: new Date(),
            },
         ],
      });
      return this.messagingService.send(
         'task-manager.create.team',
         createTeamDTO,
      );
   }

   @Get()
   findAll(@Query() query: QueryTeamDTO, @Request() req) {
      return this.messagingService.send('task-manager.findAll.teams', {
         query,
         IDUser: req.user.IDUser,
      });
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.messagingService.send('task-manager.findOne.team', id);
   }

   @Patch(':id')
   update(@Param('id') id: string, @Body() updateTeamDTO: UpdateTeamDTO) {
      return this.messagingService.send('task-manager.update.team', {
         id,
         updateTeamDTO,
      });
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.messagingService.send('task-manager.remove.team', id);
   }

   @Patch('add-member/:id')
   addMember(@Param('id') IDTeam: string, @Body() body) {
      return this.messagingService.send('task-manager.addMember.team', {
         IDTeam,
         IDMember: body.IDMember,
      });
   }

   @Delete('remove-member/:id')
   removeMember(@Param('id') IDTeam: string, @Body() body) {
      return this.messagingService.send('task-manager.removeMember.team', {
         IDTeam,
         IDMember: body.IDMember,
      });
   }
}
