import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { DefaultApiResponse, ExceptionDTO } from "src/application/dtos";
import { GetHaramPresentation } from "src/application/presentations";
import { GetHarem, UploadCharacter } from "src/application/use-cases";

@Controller({
  path: "marry",
  version: "1",
})
export class MarryControllerV1 {
  constructor(
    private readonly getHaremUseCase: GetHarem,
    private readonly uploadCharacterUseCase: UploadCharacter,
  ) {}

  @Get(":userId")
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({ summary: "List user haram" })
  @ApiOkResponse({
    description: "List of user's marries",
    type: GetHaramPresentation,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async getHaram(@Param("userId") userId: string): Promise<GetHaramPresentation> {
    const marries = await this.getHaremUseCase.exec(userId);

    return { message: "User found", info: marries, status: HttpStatus.FOUND };
  }

  // ONLY FOR TEST PORPOUSES
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "List user haram", deprecated: true })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async uploadCharacter(@Body() body: any): Promise<DefaultApiResponse> {
    await this.uploadCharacterUseCase.exec(body.name, body.age, body.gender, body.picture);

    return { message: "User found", status: HttpStatus.FOUND };
  }
}
