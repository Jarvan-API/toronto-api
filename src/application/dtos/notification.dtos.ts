import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

import { ENotificationSeverity } from "src/domain/entities";

export class NotificationDTO {
  @ApiProperty({
    description: "Emitter ID",
  })
  @IsNotEmpty()
  emitter: Types.ObjectId;

  @ApiProperty({
    description: "Emitter reference",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  emitterReference: string;

  @ApiProperty({
    description: "message",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: "severity",
    type: ENotificationSeverity.INFO,
  })
  @IsNotEmpty()
  @IsString()
  severity: ENotificationSeverity.INFO;

  @ApiProperty({
    description: "ExpiresAt",
    type: Date,
  })
  @IsDate()
  @IsOptional()
  expiresAt: Date;
}
