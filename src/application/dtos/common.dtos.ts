import { ApiProperty } from "@nestjs/swagger";

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
