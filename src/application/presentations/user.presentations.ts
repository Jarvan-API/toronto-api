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
  picturePath: string;
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

export class ProfilePictureChange extends DefaultApiResponse {
  @ApiProperty({
    description: "New profile picture path",
  })
  path: string;
}

export interface IRecoveryPassword {
  token: string;
}

export class RequestRecoveryPresentation extends DefaultApiResponse {
  @ApiProperty({
    description: "Recovery token",
  })
  info: IRecoveryPassword;
}
