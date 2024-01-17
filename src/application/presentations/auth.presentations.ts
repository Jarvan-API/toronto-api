import { ApiProperty } from "@nestjs/swagger";

import { DefaultApiResponse } from "../dtos";

export class IUserCreated {
  @ApiProperty({
    description: "User ID",
    type: String,
    example: "ddad4c48-5e39-4dba-94f8-19c4c16c446a",
  })
  id: string;
}

export class UserCreated extends DefaultApiResponse {
  @ApiProperty({
    description: "The data of the response",
    type: IUserCreated,
  })
  info: IUserCreated;
}
