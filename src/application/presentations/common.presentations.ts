import { ApiProperty } from "@nestjs/swagger";

import { DefaultApiResponse } from "../dtos";

export class SearchDefaultApiResponse extends DefaultApiResponse {
  @ApiProperty({
    name: "Result count",
    type: Number,
    example: 3,
  })
  count: number;
}

export class IPaginatedList<T> {
  @ApiProperty({
    description: "The current page number displayed",
    type: Number,
    default: 1,
  })
  page: number;

  @ApiProperty({
    description: "An array of items for the current page",
    type: Array,
    default: [],
  })
  items: Array<T>;

  @ApiProperty({
    description: "The total number of items available on this page",
    type: Number,
    default: 1,
  })
  count: number;

  @ApiProperty({
    description: "Information about the items and pagination",
    type: Number,
    default: 1,
  })
  pages: number;
}

export class PaginatedList<T> extends DefaultApiResponse {
  @ApiProperty({
    description: "Items and pagination query",
    type: IPaginatedList<T>,
  })
  info: IPaginatedList<T>;
}
