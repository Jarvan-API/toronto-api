import { ApiProperty } from "@nestjs/swagger";

import { IMarry } from "./character.presentations";
import { IHaremHistory } from "src/domain/entities";

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

export interface IUpdateKakera {
  history: IHaremHistory;
  kakera: number;
}

export class UpdateKakeraPresentation extends DefaultApiResponse {
  @ApiProperty({
    description: "The data about the update",
  })
  info: IUpdateKakera;
}
