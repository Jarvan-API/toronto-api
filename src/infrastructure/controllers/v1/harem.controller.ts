import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { DefaultApiResponse, ExceptionDTO } from "src/application/dtos";
import { GetHaremPresentation } from "src/application/presentations";
import { GetHarem, UploadCharacter } from "src/application/use-cases";

@Controller({
  path: "harem",
  version: "1",
})
export class HaremControllerV1 {
  constructor(
    private readonly getHaremUseCase: GetHarem,
    private readonly uploadCharacterUseCase: UploadCharacter,
  ) {}

  @Get(":userId")
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({ summary: "List user harem" })
  @ApiOkResponse({
    description: "List of user's marries",
    type: GetHaremPresentation,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async getHarem(@Param("userId") userId: string): Promise<GetHaremPresentation> {
    const marries = await this.getHaremUseCase.exec(userId);

    return { message: "Harem successfully retrieved", info: marries, status: HttpStatus.FOUND };
  }
}
