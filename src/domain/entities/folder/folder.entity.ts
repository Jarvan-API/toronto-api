import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export interface IFolder {
  _id?: string;
  name: string;
  owner: Types.ObjectId;
  whitelist: Types.ObjectId[];
  isPublic: boolean;
  files: Types.ObjectId[];
  storagePath: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Schema({ versionKey: false, timestamps: true })
export class Folder extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  owner: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }], default: [] })
  whitelist: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "File" }], default: [] })
  files: Types.ObjectId[];

  @Prop({ required: true, default: false })
  isPublic: boolean;

  @Prop({ type: String, required: true })
  storagePath: string;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
