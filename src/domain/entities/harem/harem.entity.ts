import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { HaremHistorySchema, IHaremHistory } from "./harem-history.entity";
import { Entity } from "src/application/enums";

export interface IHarem {
  _id?: string;
  characters: Types.ObjectId[];
  kakera: number;
  history: IHaremHistory[];
  reatedAt?: Date;
  updatedAt?: Date;
}

@Schema({ versionKey: false, timestamps: true })
export class Harem extends Document {
  @Prop({ type: [{ type: Types.ObjectId }], ref: Entity.Character, default: [] })
  characters: Types.ObjectId[];

  @Prop({
    type: Number,
  })
  kakera: number;

  @Prop({ type: [{ type: HaremHistorySchema }] })
  history: IHaremHistory[];
}

export const HaremSchema = SchemaFactory.createForClass(Harem);
