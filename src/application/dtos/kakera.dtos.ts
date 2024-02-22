import { IsPositive, IsString } from "class-validator";

export class KakeraDTO {
  @IsPositive()
  amount: number;

  @IsString()
  reason: string;
}
