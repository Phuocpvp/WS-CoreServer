import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note, NoteDocument } from './schemas/note.schema';
import {
   APIResponse,
   CreateNoteDTO,
   QueryNoteDTO,
   UpdateNoteDTO,
} from '@app/types';

@Injectable()
export class NoteService {
   constructor(
      @InjectModel(Note.name)
      private noteModel: Model<NoteDocument>,
   ) {}

   async create(
      createNoteDTO: CreateNoteDTO,
   ): Promise<APIResponse<NoteDocument>> {
      // Check if a note with the same widget, author, and title already exists
      const existingNote = await this.noteModel
         .findOne({
            IDWidget: new Types.ObjectId(createNoteDTO.IDWidget),
            IDAuthor: new Types.ObjectId(createNoteDTO.IDAuthor),
            title: createNoteDTO.title,
            isDeleted: false,
         })
         .exec();

      if (existingNote) {
         throw new RpcException({
            message: 'Note with this title, widget, and author already exists',
            statusCode: HttpStatus.CONFLICT,
         });
      }

      // Create a new note
      const savedNote = await new this.noteModel({
         ...createNoteDTO,
         IDWidget: new Types.ObjectId(createNoteDTO.IDWidget),
         IDAuthor: new Types.ObjectId(createNoteDTO.IDAuthor),
      }).save();

      if (!savedNote) {
         throw new RpcException({
            message: 'Failed to create note',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
         });
      }

      return {
         message: 'Note created successfully',
         data: savedNote,
      };
   }

   async findAll(query: QueryNoteDTO): Promise<APIResponse<NoteDocument[]>> {
      const filter: any = { isDeleted: { $ne: true } };

      if (query.IDWidget) {
         filter.IDWidget = new Types.ObjectId(query.IDWidget);
      }
      if (query.IDAuthor) {
         filter.IDAuthor = new Types.ObjectId(query.IDAuthor);
      }
      if (query.title) {
         filter.title = { $regex: query.title, $options: 'i' };
      }

      const notes = await this.noteModel.find(filter).exec();

      if (!notes || notes.length === 0) {
         throw new RpcException({
            message: 'No notes found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Notes retrieved successfully',
         data: notes,
      };
   }

   async findOne(id: string): Promise<APIResponse<NoteDocument>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid note ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const note = await this.noteModel.findOne({
         _id: new Types.ObjectId(id),
         isDeleted: { $ne: true }
      }).exec();

      if (!note) {
         throw new RpcException({
            message: 'Note not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Note retrieved successfully',
         data: note,
      };
   }

   async update(
      id: string,
      updateNoteDTO: UpdateNoteDTO,
   ): Promise<APIResponse<NoteDocument>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid note ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const updatedNote = await this.noteModel
         .findOneAndUpdate(
            {
               _id: new Types.ObjectId(id),
               isDeleted: { $ne: true }
            },
            { ...updateNoteDTO, $inc: { __v: 1 } },
            { new: true }
         )
         .exec();

      if (!updatedNote) {
         throw new RpcException({
            message: 'Note not found',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Note updated successfully',
         data: updatedNote,
      };
   }

   async remove(id: string): Promise<APIResponse<null>> {
      if (!Types.ObjectId.isValid(id)) {
         throw new RpcException({
            message: 'Invalid note ID',
            statusCode: HttpStatus.BAD_REQUEST,
         });
      }

      const result = await this.noteModel
         .findOneAndUpdate(
            {
               _id: new Types.ObjectId(id),
               isDeleted: { $ne: true }
            },
            { isDeleted: true },
            { new: true }
         )
         .exec();

      if (!result) {
         throw new RpcException({
            message: 'Note not found or already deleted',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }

      return {
         message: 'Note deleted successfully',
         data: null,
      };
   }
}
