import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export interface ISession {
  _id?: string;
  session: string;
  expiredAt: Date;
}

@Schema({ versionKey: false, timestamps: true })
export class Session extends Document {
  @Prop({
    type: String,
  })
  public _id: string;

  @Prop({
    type: String,
  })
  public session: string;

  @Prop({
    type: Date,
  })
  public expiredAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
