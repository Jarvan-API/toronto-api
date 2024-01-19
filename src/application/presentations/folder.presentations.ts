import { ApiProperty } from "@nestjs/swagger";
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
  info: IFolderCreated;
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
}

export class UserFoldersSearch extends DefaultApiResponse {
  @ApiProperty({
    description: "List of folders",
    type: Array,
  })
  folders: IUserFolderSearch[];
}
