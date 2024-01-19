import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateFolderDTO {
  @ApiProperty({
    description: "Folder title",
    example: "Photos",
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "Folder visibility settings",
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  isPublic: boolean;
}
