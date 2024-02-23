import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class ModifyKakeraDTO {
  @ApiProperty({
    description: "Amount to modify",
  })
  @IsPositive()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: "Reason of modification",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  reason: string;
}
