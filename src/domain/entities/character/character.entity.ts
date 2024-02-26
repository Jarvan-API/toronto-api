import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Entity } from "src/application/enums";

export interface ICharacter {
  _id?: string;
  name: string;
  age: number;
  gender: EGender;
  picture: string;
  owner?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum EGender {
  FEMALE = "female",
  MALE = "male",
  FURRY = "furry",
}

@Schema({ versionKey: false, timestamps: true })
export class Character extends Document {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: Number,
  })
  age: number;

  @Prop({
    type: String,
    enum: EGender,
    required: true,
  })
  gender: EGender;

  @Prop({
    type: String,
  })
  picture: string;

  @Prop({ type: Types.ObjectId, ref: Entity.User, required: false })
  owner: Types.ObjectId;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
