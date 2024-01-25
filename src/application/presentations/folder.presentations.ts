import { ApiProperty } from "@nestjs/swagger";

import { IFolder } from "src/domain/entities";

import { DefaultApiResponse } from "../dtos";

export class IFolderCreated {
  @ApiProperty({
    description: "Folder ID",
    type: String,
    example: "ddad4c48-5e39-4dba-94f8-19c4c16c446a",
  })
  id: string;

  @ApiProperty({
    description: "Folder name",
    type: String,
    example: "Folder",
  })
  name: string;
}

export class FolderCreated extends DefaultApiResponse {
  @ApiProperty({
    description: "The data of the response",
    type: IFolderCreated,
  })
  data: IFolderCreated;
}

export class IFolderOwner {
  @ApiProperty({
    description: "Folder owner name",
    type: String,
    example: "Federico",
  })
  name: string;

  @ApiProperty({
    description: "Folder owner ID",
    type: String,
    example: "ddad4c48-5e39-4dba-94f8-19c4c16c446a",
  })
  id: string;
}

export class IUserFolderSearch {
  @ApiProperty({
    description: "Folder ID",
    type: String,
    example: "ddad4c48-5e39-4dba-94f8-19c4c16c446a",
  })
  id: string;

  @ApiProperty({
    description: "Folder name",
    type: String,
    example: "Folder",
  })
  name: string;

  @ApiProperty({
    description: "Folder files count",
    type: Number,
    example: 10,
  })
  fileCount: number;

  @ApiProperty({
    description: "Folder owner information",
    type: IFolderOwner,
  })
  owner: IFolderOwner;

  @ApiProperty({
    description: "Folder visibility",
    type: Boolean,
    example: true,
  })
  public: boolean;

  @ApiProperty({
    description: "Folder creation date",
    type: Date,
    example: "2024-01-20",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Folder last update date",
    type: Date,
    example: "2024-01-20",
  })
  updatedAt: Date;
}

export class UserFoldersSearch extends DefaultApiResponse {
  @ApiProperty({
    description: "List of folders",
    type: Array,
  })
  folders: IUserFolderSearch[];
}

export class FolderDetails extends DefaultApiResponse {
  @ApiProperty({
    description: "Folder details",
  })
  folder: IFolder;
}

export class IFolderDeleted {
  file_count: number;
  free_space: number;
}

export class FolderDeleted extends DefaultApiResponse {
  @ApiProperty({
    description: "The amount of files deleted",
    type: Number,
  })
  file_count: number;

  @ApiProperty({
    description: "The amount of free disk cleared",
    type: Number,
  })
  free_space: number;
}
