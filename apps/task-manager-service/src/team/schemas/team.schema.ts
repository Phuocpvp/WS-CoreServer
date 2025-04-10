import { TeamMember } from '@app/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema({ timestamps: true })
export class Team {
   _id: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
   manager: Types.ObjectId;

   @Prop({ type: String, required: true })
   teamName: string;

   @Prop({ type: String, required: true })
   teamDescription: string;

   @Prop({ type: Number, required: true })
   teamSize: number;

   @Prop({ type: Boolean, default: false })
   isDeleted: boolean;

   @Prop({ type: Array })
   members: TeamMember[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);