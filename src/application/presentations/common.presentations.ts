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
