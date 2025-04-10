import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
   _id: Types.ObjectId;

   @Prop({ required: true, unique: true })
   username: string;

   @Prop()
   password: string;

   @Prop({ unique: true })
   email: string;

   @Prop()
   displayName: string;

   @Prop()
   githubID: string;

   @Prop()
   GithubAccessToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
