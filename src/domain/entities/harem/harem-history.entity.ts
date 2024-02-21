import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Entity } from "src/application/enums";

export interface IHaremHistory {
  notes: string;
  types: EActionType;
  kakera: number;
  target?: Types.ObjectId;
  reference?: Types.ObjectId;
  reatedAt?: Date;
  updatedAt?: Date;
}

export enum EActionType {
  KAKERA_DEPOSIT = "kakera_deposit",
  KAKERA_WITHDRAW = "kakera_withdraw",
  NEW_MARRY = "new_marry",
}

@Schema({ versionKey: false, timestamps: true, _id: false })
export class HaremHistory extends Document {
  @Prop({
    type: String,
  })
  notes: string;

  @Prop({
    type: String,
    enum: EActionType,
  })
  types: EActionType;

  @Prop({
    type: Number,
    default: 1000,
  })
  kakera: number;

  @Prop({
    type: [{ type: Types.ObjectId }],
    ref: Entity.Character,
    default: [],
  })
  target: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId }],
    ref: Entity.User,
  })
  reference: Types.ObjectId;
}

export const HaremHistorySchema = SchemaFactory.createForClass(HaremHistory);
