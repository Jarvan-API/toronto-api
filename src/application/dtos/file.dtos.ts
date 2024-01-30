import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Matches } from "class-validator";

import { EncryptableAction } from "./common.dtos";

export class UploadFileDTO {
  @ApiProperty({ description: "File name", type: String, example: "photo.jpg" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: "File visibility", type: Boolean, format: "binary" })
  isPublic: boolean;
}

export class SearchFileDTO {
  @ApiProperty({ description: "File name", type: String, example: "photo.jpg" })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: "File type", type: String, example: ".jpg" })
  @IsOptional()
  @IsString()
  mimetype: string;

  @ApiProperty({ description: "File owner ID", type: String, example: "65ab3a8aac48145f7552c0ae" })
  @IsOptional()
  @IsString()
  ownerId: string;
}

export class InitializeFileDTO extends EncryptableAction {
  @ApiProperty({ description: "File name", type: String, example: "photo.jpg" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: "File type", type: String, example: "image/jpg" })
  @IsNotEmpty()
  @IsString()
  fileType: string;

  @ApiProperty({ description: "File size", type: Number, example: 1024 })
  @IsNotEmpty()
  @IsNumber()
  totalBufferSize: number;
}

export class UploadChunkDTO {
  @ApiProperty({ description: "Chunk number of the file being uploaded", example: 1 })
  @IsNotEmpty()
  @IsString()
  chunkNumber: number;

  @ApiProperty({ description: "Total number of chunks for the file", example: 10 })
  @IsNotEmpty()
  @IsString()
  totalChunks: number;

  @ApiProperty({ description: "The file chunk being uploaded", type: "file", format: "binary" })
  @IsNotEmpty()
  @IsObject()
  file: any;
}

export class IMovingFile {
  @ApiProperty({
    description: "File thats going to be moved",
    type: String,
  })
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: "file_id must be a valid MongoDB ObjectId",
  })
  file_id: string;
}

export class MoveFilesDTO {
  @ApiProperty({
    description: "List of files that are going to be moved",
    type: Array,
  })
  @IsOptional()
  @IsArray()
  files?: IMovingFile[];

  @ApiProperty({
    description: "Target folder ID",
    type: String,
  })
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: "folder_id must be a valid MongoDB ObjectId",
  })
  folder_id: string;
}
