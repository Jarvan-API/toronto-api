import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { ExceptionDTO } from "src/application/dtos";
import { GetHaramPresentation, IMarry } from "src/application/presentations/character.presentations";
import { GetHaram } from "src/application/use-cases/character/get-haram.use-case";

@Controller({
  path: "marry",
  version: "1",
})
export class MarryControllerV1 {
  constructor(private readonly getHaramUseCase: GetHaram) {}

  @Get(":userId")
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({ summary: "Search for current logged user's information" })
  @ApiOkResponse({
    description: "User found",
    type: GetHaramPresentation,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async getHaram(@Query() userId: string): Promise<GetHaramPresentation> {
    const info = await this.getHaramUseCase.exec(userId);

    return { message: "User found", info, status: HttpStatus.FOUND };
  }
}
