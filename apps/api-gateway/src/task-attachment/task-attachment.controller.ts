import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   Post,
   Put,
   Query,
   Request,
} from '@nestjs/common';
import { MessagingService } from '@app/common';
import {
   CreateTaskAttachmentDTO,
   QueryTaskAttachmentDTO,
   UpdateTaskAttachmentDTO,
} from '@app/types';

@Controller('task-attachment')
export class TaskAttachmentController {
   constructor(private readonly messagingService: MessagingService) {}

   @Post()
   create(@Body() createTaskAttachmentDTO: CreateTaskAttachmentDTO) {
      return this.messagingService.send(
         'task-manager.create.task-attachment',
         createTaskAttachmentDTO,
      );
   }

   @Get()
   findAll(@Query() query: QueryTaskAttachmentDTO, @Request() req) {
      return this.messagingService.send(
         'task-manager.findAll.task-attachments',
         {
            query,
            IDUser: req.user.IDUser,
         },
      );
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.messagingService.send(
         'task-manager.findOne.task-attachment',
         id,
      );
   }

   @Put(':id')
   update(
      @Param('id') id: string,
      @Body() updateTaskAttachmentDTO: UpdateTaskAttachmentDTO,
   ) {
      return this.messagingService.send('task-manager.update.task-attachment', {
         id,
         updateTaskAttachmentDTO,
      });
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.messagingService.send(
         'task-manager.remove.task-attachment',
         id,
      );
   }
}
