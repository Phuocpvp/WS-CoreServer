import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type TaskDocument = Task & Document;

interface Tag {
   idTag: Types.ObjectId;
   tagName: string;
   isDeleted: boolean;
}

@Schema({ timestamps: true })
export class Task {
   @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
   _id: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'Project' })
   idProject: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
   idAssignee: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'Status' })
   status: Types.ObjectId;

   @Prop({
      type: [{
         idTag: {
            type: Types.ObjectId,
            default: () => new Types.ObjectId(),
         },
         tagName: { type: String, required: true },
         isDeleted: { type: Boolean, default: false },
      }],
      default: [],
   })
   tag: Tag[];

   @Prop({ type: String, required: true })
   taskName: string;

   @Prop({ type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' })
   priority: string;

   @Prop({ type: Date, default: Date.now })
   createAt: Date;

   @Prop({ type: Date, required: true })
   startDay: Date;

   @Prop({ type: Date, required: true })
   endDay: Date;

   @Prop({ type: Date, required: true })
   dueDay: Date;

   @Prop({ type: Boolean, default: false })
   isDeleted: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);