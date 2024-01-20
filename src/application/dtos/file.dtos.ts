import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

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
