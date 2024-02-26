import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

import { ENotificationSeverity } from "src/domain/entities";

import { DefaultApiResponse } from "../dtos";

export class IGetNotification {
  id: string;
  emitter: Types.ObjectId;
  emitterReference: string;
  message: string;
  severity: ENotificationSeverity;
  expiresAt?: Date;
}

export class GetNotifications extends DefaultApiResponse {
  @ApiProperty({
    description: "The data of the notifications",
  })
  info: IGetNotification;
}
