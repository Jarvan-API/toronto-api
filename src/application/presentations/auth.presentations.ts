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

export class IUserLogged {
  @ApiProperty({
    description: "Session ID",
    type: String,
  })
  session_id: string;

  @ApiProperty({
    description: "User's current status",
    type: String,
  })
  userStatus: string;

  @ApiProperty({
    description: "User ID",
    type: String,
  })
  id: string;
}

export class UserLoggedIn extends DefaultApiResponse {
  @ApiProperty({
    description: "User log data",
    type: IUserLogged,
  })
  data: IUserLogged;
}
