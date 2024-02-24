import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, isString } from "class-validator";

export class CreateFolderDTO {
  @ApiProperty({
    description: "Folder title",
    example: "Photos",
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "Folder visibility settings",
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  isPublic: boolean;
}

export class SearchFolderDTO {
  @ApiProperty({
    description: "Folder matching title",
    example: "Photos",
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Folder visibility settings",
    example: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: "owner must be a valid MongoDB ObjectId",
  })
  owner: string;
}

export class UpdateFolderDTO {
  @ApiProperty({
    description: "Folder privacy and visibility",
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({
    description: "Folder name",
    type: String,
    example: "Games",
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: "User that must be added or removed from whitelist",
    type: String,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: "permission must be a valid MongoDB ObjectId",
  })
  permission?: string;
}

export class DeleteFolderDTO {
  @ApiProperty({
    description: "Folder on which files are going to be moved towards",
    type: String,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: "folder must be a valid MongoDB ObjectId",
  })
  folder?: string;
}
