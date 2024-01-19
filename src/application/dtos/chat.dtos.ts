import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SendMessageDTO {
  @ApiProperty({
    description: "Message body",
    example: "This is a message",
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
