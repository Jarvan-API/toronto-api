import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export interface IFileChunk {
  _id?: Types.ObjectId;
  sequence: number;
  size: number;
  status: EChunkStatus;
  sum: string;
  storagePath: string;
  storageName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum EChunkStatus {
  PENDING = "pending",
  COMPLETE = "completed",
  INTERRUPTED = "interrupted",
}

@Schema({ versionKey: false, timestamps: true })
export class FileChunk extends Document {
  @Prop({ required: true })
  sequence: number;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true, enum: EChunkStatus })
  status: EChunkStatus;

  @Prop({ required: true })
  sum: string;

  @Prop({ required: true })
  storagePath: string;

  @Prop({ required: true })
  storageName: string;
}

export const FileChunkSchema = SchemaFactory.createForClass(FileChunk);
