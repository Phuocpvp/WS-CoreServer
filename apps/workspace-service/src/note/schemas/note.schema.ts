import { fileType } from '@app/types/enums/file-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

// Define the type for the Note document
export type NoteDocument = Note & Document;

// Define the attachment sub-schema as an interface
interface attachment {
   fileName: string;
   fileType: fileType;
   fileURL: string;
}

// Main Note schema
@Schema({ timestamps: true })
export class Note {
   @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
   _id: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'Widget' })
   IDWidget: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'User' }) // Assuming Author references a User model
   IDAuthor: Types.ObjectId;

   @Prop({ type: String, required: true })
   title: string;

   @Prop({ type: String, required: true })
   content: string;

   @Prop({ type: Date, default: Date.now })
   createAt: Date;

   @Prop({ type: Boolean, default: false })
   isDeleted: boolean;

   @Prop({
      type: [
         {
            fileName: { type: String },
            fileType: { type: String, enum: Object.values(fileType) },
            fileURL: { type: String },
         },
      ],
      default: [],
   })
   attachment: attachment[];
}

// Create the schema for the Note class
export const NoteSchema = SchemaFactory.createForClass(Note);
