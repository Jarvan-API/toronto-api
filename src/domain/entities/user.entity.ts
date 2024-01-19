import { Exclude } from "class-transformer";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export interface IUser {
  _id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  status: EUserStatus;
  role: EUserRole;
}

export enum EUserStatus {
  ACTIVE = "active",
  PENDING = "pending",
  BLOCKED = "blocked",
}

export enum EUserRole {
  USER = "user",
  SUDO = "sudo",
}

@Schema({ versionKey: false, timestamps: true })
export class User extends Document {
  @Prop({
    type: String,
  })
  firstname: string;

  @Prop({
    type: String,
  })
  lastname: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  @Exclude()
  password: string;

  @Prop({
    type: String,
    enum: EUserStatus,
    default: EUserStatus.PENDING,
  })
  status: EUserStatus;

  @Prop({
    type: String,
    enum: EUserRole,
    default: EUserRole.USER,
  })
  role: EUserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
