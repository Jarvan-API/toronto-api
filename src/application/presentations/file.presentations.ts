import { ApiProperty } from "@nestjs/swagger";

import { SearchDefaultApiResponse } from "./common.presentations";
import { EFileStatus, IFileMetadata } from "src/domain/entities";

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

export class IFileInitialized {
  @ApiProperty({
    description: "File ID",
    type: String,
    example: "ddad4c48-5e39-4dba-94f8-19c4c16c446a",
  })
  id: string;

  @ApiProperty({
    description: "File name",
    type: String,
    example: "File A",
  })
  name: string;
}

export class FileInitialized extends DefaultApiResponse {
  @ApiProperty({
    description: "The data of the response",
    type: IFileInitialized,
  })
  data: IFileInitialized;
}

export class IFilePresentation {
  metadata: IFileMetadata;
  status: EFileStatus;
}

export class FilePresentation extends DefaultApiResponse {
  @ApiProperty({
    description: "File",
    type: IFilePresentation,
  })
  file: IFilePresentation;
}
