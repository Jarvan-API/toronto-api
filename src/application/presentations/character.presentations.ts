import { ApiProperty } from "@nestjs/swagger";

import { EGender } from "src/domain/entities";

import { DefaultApiResponse } from "../dtos";

// relationship between user-character
export interface IMarry {
  name: string;
  age: number;
  gender: EGender;
  picture: string;
}

export class GetHaramPresentation extends DefaultApiResponse {
  @ApiProperty({
    description: "The data of the marrys",
  })
  info: IMarry[];
}
