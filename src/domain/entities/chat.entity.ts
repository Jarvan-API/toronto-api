import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";

export interface IChat {
  _id?: string;
  message: string;
  sender;
  recipient;
  createdAt?: Date;
  updatedAt?: Date;
}

@Schema({ versionKey: false, timestamps: true })
export class Chat extends Document {
  @Prop({
    required: true,
    type: String,
  })
  message: string;

  @Prop({
    required: true,
    type: String,
  })
  sender: string;

  @Prop({
    required: true,
    type: String,
  })
  recipient: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
