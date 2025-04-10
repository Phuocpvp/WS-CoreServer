import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { MessagingModule } from '@app/common';

@Module({
   imports: [MessagingModule],
   controllers: [NoteController],
   providers: [NoteService],
})
export class NoteModule {}
