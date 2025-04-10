// note.controller.ts
import { MessagingService } from '@app/common';
import { CreateNoteDTO, QueryNoteDTO, UpdateNoteDTO } from '@app/types';
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

@Controller('note')
@UseGuards(AuthGuard('jwt'))
export class NoteController {
   constructor(private readonly messagingService: MessagingService) {}

   @Post()
   create(@Body() createNoteDTO: CreateNoteDTO) {
      return this.messagingService.send('note.create.note', createNoteDTO);
   }

   @Get()
   findAll(@Query() query: QueryNoteDTO, @Request() req) {
      return this.messagingService.send('note.findAll.notes', {
         query,
         IDUser: req.user.IDUser,
      });
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.messagingService.send('note.findOne.note', id);
   }

   @Put(':id')
   update(@Param('id') id: string, @Body() updateNoteDTO: UpdateNoteDTO) {
      return this.messagingService.send('note.update.note', {
         id,
         updateNoteDTO,
      });
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.messagingService.send('note.remove.note', id);
   }
}
