import { ApiProperty } from "@nestjs/swagger";

import { DefaultApiResponse } from "../dtos";
import { EUserRole, EUserStatus } from "../enums";

export interface IUserProfile {
  firstname: string;
  lastname: string;
  email: string;
  status: EUserStatus;
  role: EUserRole;
  createdAt: Date;
}

export class UserProfile extends DefaultApiResponse {
  @ApiProperty({
    description: "The data of the user",
  })
  user: IUserProfile;
}

export interface IPendingUser {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: Date;
}

export class PendingUsers extends DefaultApiResponse {
  @ApiProperty({
    description: "List of pending users",
  })
  users: IPendingUser[];
}