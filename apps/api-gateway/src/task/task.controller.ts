import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { MessagingService } from '@app/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDTO, QueryTaskDTO, UpdateTaskDTO } from '@app/types';

@Controller('task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
   constructor(private readonly messagingService: MessagingService) {}

   @Post()
   create(@Body() createTaskDTO: CreateTaskDTO) {
      return this.messagingService.send('task-manager.create.task', createTaskDTO);
   }

   @Get()
   findAll(@Query() query: QueryTaskDTO, @Request() req) {
      return this.messagingService.send('task-manager.findAll.tasks', {
         query,
         IDUser: req.user.IDUser,
      });
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.messagingService.send('task-manager.findOne.task', id);
   }

   @Put(':id')
   update(@Param('id') id: string, @Body() updateTaskDTO: UpdateTaskDTO) {
      return this.messagingService.send('task-manager.update.task', {
         id,
         updateTaskDTO,
      });
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.messagingService.send('task-manager.remove.task', id);
   }
}
