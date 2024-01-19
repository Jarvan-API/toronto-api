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
