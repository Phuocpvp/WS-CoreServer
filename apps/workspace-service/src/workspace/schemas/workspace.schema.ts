import { WorkspaceAccess } from '@app/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type WorkspaceDocument = Workspace & Document;

@Schema({ timestamps: true })
export class Workspace {
   _id: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
   owner: Types.ObjectId;

   @Prop({ type: String, required: true })
   workspaceName: string;

   @Prop({ type: String, required: true })
   workspaceDescription: string;

   @Prop({ type: Boolean, default: false })
   isDeleted: boolean;

   @Prop({ type: Array })
   access: WorkspaceAccess[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
