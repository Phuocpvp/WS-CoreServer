import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NoteService } from './note.service';
import { CreateNoteDTO, QueryNoteDTO, UpdateNoteDTO } from '@app/types';

@Controller()
export class NoteController {
   constructor(private readonly noteService: NoteService) {}

   @MessagePattern('note.create.note')
   create(@Payload() createNoteDTO: CreateNoteDTO) {
      return this.noteService.create(createNoteDTO);
   }

   @MessagePattern('note.findAll.notes')
   findAll(@Payload() query: QueryNoteDTO) {
      return this.noteService.findAll(query);
   }

   @MessagePattern('note.findOne.note')
   findOne(@Payload() id: string) {
      return this.noteService.findOne(id);
   }

   @MessagePattern('note.update.note')
   update(@Payload() payload: { id: string; updateNoteDTO: UpdateNoteDTO }) {
      return this.noteService.update(payload.id, payload.updateNoteDTO);
   }

   @MessagePattern('note.remove.note')
   remove(@Payload() id: string) {
      return this.noteService.remove(id);
   }
}
