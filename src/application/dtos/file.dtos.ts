import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator";

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

export class InitializeFileDTO {
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
  @IsNumber()
  chunkNumber: number;

  @IsNumber()
  totalChunks: number;
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
