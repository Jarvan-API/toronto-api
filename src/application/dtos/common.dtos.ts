import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ExceptionDTO {
  @ApiProperty({
    description: "The status code of the response",
    type: Number,
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: "The message of the response",
    type: String,
    example: "Bad Request",
  })
  message: string;

  @ApiProperty({
    description: "The timestamp of the response",
    type: Date,
    example: "2021-07-01T15:00:00.000Z",
  })
  timestamp: Date;

  @ApiProperty({
    description: "The path of the response",
    type: String,
    example: "/v1/auth/login",
  })
  path: string;
}

export class DefaultApiResponse {
  @ApiProperty({
    description: "The message of the response",
    type: String,
  })
  message?: string;

  @ApiProperty({
    description: "The status code of the response",
    type: Number,
    example: 200,
  })
  status: number;
}

export class DefaultAdminActionApiRequest {
  @ApiProperty({
    description: "Reason of the action",
    type: String,
    example: "Because I wanted to",
    default: "Unknown",
  })
  @IsString()
  action_reason: string;
}

export class EncryptableAction {
  @ApiProperty({
    description: "Encryption key",
    type: String,
    example: "a3d24f44369f10b68908a1f2b2c4e5f6a7b8c9d0e1f21324566789a0b1c2d3e2",
  })
  @IsString()
  @IsOptional()
  encryptionKey;
}
