import { Prop, Schema } from "@nestjs/mongoose";

import { IUser } from "./user.entity";

export interface ISession {
  id?: string;
  expiredAt?: number;
  json?: string;
  destroyedAt: Date;
  user: IUser;
  created_at?: Date;
}

@Schema({ versionKey: false, timestamps: true })
export class Session extends Document {
  @Prop({
    type: Date,
  })
  public expiredAt = Date.now();

  @Prop({
    type: String,
  })
  public json = "";

  @Prop({
    type: Date,
  })
  public destroyedAt?: Date;
}
