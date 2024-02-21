import { ApiProperty } from "@nestjs/swagger";

import { IMarry } from "./character.presentations";

import { DefaultApiResponse } from "../dtos";

export interface IGetHarem {
  marries: IMarry[];
  kakera: number;
}

export class GetHaremPresentation extends DefaultApiResponse {
  @ApiProperty({
    description: "The data of the harem",
  })
  info: IGetHarem;
}
