import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class OnboardingDTO {
  @ApiProperty({
    description: "User firstname",
    example: "Lucas",
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    description: "User lastname",
    example: "Prodan",
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    description: "User date of birth",
    example: "1990-01-01",
    type: Date,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  dob: string;
}
