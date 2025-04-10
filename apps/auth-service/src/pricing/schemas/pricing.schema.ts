import { DurationEnum } from '@app/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type PricingDocument = Pricing & Document;

@Schema({ timestamps: true })
export class Pricing {
   _id: Types.ObjectId;

   @Prop({ type: [String], required: true })
   features: string[];

   @Prop({ type: String, required: true })
   name: string;

   @Prop({ type: String, required: true })
   description: string;

   @Prop({ type: Number, required: true })
   projectLimit: number;

   @Prop({ type: Number, required: true })
   teamLimit: number;

   @Prop({ type: Boolean, required: true })
   unlimitedProjects: boolean;

   @Prop({ type: String, enum: DurationEnum, required: true })
   duration: DurationEnum;

   @Prop({ type: Boolean, default: false })
   isDeleted: boolean;
}

export const PricingSchema = SchemaFactory.createForClass(Pricing);
