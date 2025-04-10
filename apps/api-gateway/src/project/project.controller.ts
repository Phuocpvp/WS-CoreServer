import { MessagingService } from '@app/common';
import {
   CreateProjectDTO,
   QueryProjectDTO,
   UpdateProjectDTO,
} from '@app/types';
import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
   Query,
   UseGuards,
   Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('project')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {
   constructor(private readonly messagingService: MessagingService) {}

   @Post()
   create(@Body() createProjectDTO: CreateProjectDTO) {
      return this.messagingService.send(
         'task-manager.create.project',
         createProjectDTO,
      );
   }

   @Get()
   findAll(@Query() query: QueryProjectDTO, @Request() req) {
      return this.messagingService.send('task-manager.findAll.projects', {
         query,
         IDUser: req.user.IDUser,
      });
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.messagingService.send('task-manager.findOne.project', id);
   }

   @Put(':id')
   update(@Param('id') id: string, @Body() updateProjectDTO: UpdateProjectDTO) {
      return this.messagingService.send('task-manager.update.project', {
         id,
         updateProjectDTO,
      });
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.messagingService.send('task-manager.remove.project', id);
   }
}
