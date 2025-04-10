import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

// Define the type for the Project document
export type ProjectDocument = Project & Document;

// Define the tag sub-schema as an interface
interface tag {
   idTag: Types.ObjectId;
   tagName: string;
   isDeleted: boolean;
}

// Define the status sub-schema as an interface
interface status {
   idStatus: Types.ObjectId;
   statusName: string;
   order: number;
   isDeleted: boolean;
}

// Define the access sub-schema as an interface
interface access {
   idCollaborator: Types.ObjectId;
   permission: string; // Assuming permission is a string or enum
   isDeleted: boolean;
}

// Main Project schema
@Schema({ timestamps: true })
export class Project {
   @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
   _id: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'Team' })
   idTeam: Types.ObjectId;

   @Prop({ type: String, required: true })
   projectName: string;

   @Prop({ type: String, required: true })
   projectDescription: string;

   @Prop({ type: Boolean, default: false })
   isDeleted: boolean;

   @Prop({
      type: [
         {
            idTag: {
               type: Types.ObjectId,
               default: () => new Types.ObjectId(),
            },
            tagName: { type: String, required: true },
            isDeleted: { type: Boolean, default: false },
         },
      ],
      default: [],
   })
   tag: tag[];

   @Prop({
      type: [
         {
            idStatus: {
               type: Types.ObjectId,
               default: () => new Types.ObjectId(),
            },
            statusName: { type: String, required: true },
            order: { type: Number, required: true },
            isDeleted: { type: Boolean, default: false },
         },
      ],
      default: [],
   })
   status: status[];

   @Prop({
      type: [
         {
            idCollaborator: {
               type: Types.ObjectId,
               required: true,
               ref: 'User',
            }, // References a User model
            permission: { type: String, required: true }, // Assuming permission is a string or enum
            isDeleted: { type: Boolean, default: false },
         },
      ],
      default: [],
   })
   access: access[];
}

// Create the schema for the Project class
export const ProjectSchema = SchemaFactory.createForClass(Project);
