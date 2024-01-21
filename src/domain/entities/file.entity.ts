import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { FileChunkSchema, IFileChunk } from "./chunk.entity";
import { FileMetadataSchema, IFileMetadata } from "./file-metadata.entity";

export enum EFileStatus {
  PENDING = "pending",
  COMPLETE = "complete",
  CORRUPTED = "corrupted",
}

export interface IFile {
  _id?: Types.ObjectId;
  chunks: Types.ObjectId[];
  metadata: IFileMetadata;
  status: EFileStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

@Schema({ versionKey: false, timestamps: true })
export class File extends Document {
  @Prop({ type: [{ type: Types.ObjectId, ref: "FileChunks" }], required: true })
  chunks: Types.ObjectId[];

  @Prop({ type: [FileMetadataSchema], required: true })
  metadata: IFileMetadata;

  @Prop({ required: true, enum: EFileStatus })
  status: EFileStatus;
}

export const FileSchema = SchemaFactory.createForClass(File);
