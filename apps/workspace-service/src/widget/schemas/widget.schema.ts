import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type WidgetDocument = Widget & Document;

@Schema({ timestamps: true })
export class Widget {
   _id: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'Workspace' })
   IDWorkSpace: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'Note' })
   IDNote: Types.ObjectId;

   @Prop({ type: String, required: true })
   widgetType: string;

   @Prop({ type: Boolean, default: false })
   isDeleted: boolean;

   @Prop({ type: Number })
   z_Index: number;

   @Prop({
      type: {
         width: { type: Number },
         height: { type: Number },
      },
   })
   dimension: {
      width: number;
      height: number;
   };

   @Prop({
      type: {
         positionX: { type: Number },
         positionY: { type: Number },
      },
   })
   position: {
      positionX: number;
      positionY: number;
   };

   @Prop({
      type: {
         color: { type: String },
         theme: { type: String },
      },
   })
   style: {
      color: string;
      theme: string;
   };
}

export const WidgetSchema = SchemaFactory.createForClass(Widget);
