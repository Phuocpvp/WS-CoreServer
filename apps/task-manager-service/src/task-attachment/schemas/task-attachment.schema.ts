import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { fileType } from '@app/types/enums/file-type.enum';

// Define the type for the TaskAttachment document
export type TaskAttachmentDocument = TaskAttachment & Document;

@Schema({ timestamps: true })
export class TaskAttachment {
   @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
   _id: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'Task' })
   idTask: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
   uploadedBy: Types.ObjectId;

   @Prop({ type: String, required: true })
   fileName: string;

   @Prop({ type: String, enum: Object.values(fileType), required: true })
   fileType: fileType;

   @Prop({ type: String, required: true })
   fileURL: string;

   @Prop({ type: Date, default: Date.now })
   uploadedAt: Date;

   @Prop({ type: Boolean, default: false })
   isFinalFile: boolean;

   @Prop({ type: Boolean, default: false })
   isDeleted: boolean;
}

export const TaskAttachmentSchema = SchemaFactory.createForClass(TaskAttachment);