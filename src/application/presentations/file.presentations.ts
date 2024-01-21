import { ApiProperty } from "@nestjs/swagger";

import { SearchDefaultApiResponse } from "./common.presentations";

import { DefaultApiResponse } from "../dtos";

export class IFileUploaded {
  @ApiProperty({
    description: "File ID",
    type: String,
    example: "ddad4c48-5e39-4dba-94f8-19c4c16c446a",
  })
  id: string;
}

export class FileUploaded extends DefaultApiResponse {
  @ApiProperty({
    description: "The data of the response",
    type: IFileUploaded,
  })
  data: IFileUploaded;
}

export class ISearchFile {
  @ApiProperty({
    description: "File name",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "File ID",
    type: String,
  })
  id: string;
}

export class FilesList extends SearchDefaultApiResponse {
  @ApiProperty({
    description: "File list",
    type: Array,
  })
  results: ISearchFile[];
}
