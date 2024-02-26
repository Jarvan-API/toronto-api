import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";

import { ExceptionDTO } from "src/application/dtos";
import { IGetCharacters, PaginatedList } from "src/application/presentations";
import { GetCharacters } from "src/application/use-cases";

@Controller({
  path: "characters",
  version: "1",
})
@UseGuards(ThrottlerGuard)
export class CharacterControllerV1 {
  constructor(private readonly getCharactersUseCase: GetCharacters) {}

  @Get("/list")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "List characters" })
  @ApiOkResponse({
    description: "List of all characters",
    type: PaginatedList<IGetCharacters>,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  @ApiQuery({
    description: "Current pagination index",
    name: "page",
    type: Number,
  })
  @ApiQuery({
    description: "Current pagination index",
    name: "count",
    type: Number,
  })
  async getCharacters(@Query("page") page: number, @Query("count") size: number): Promise<PaginatedList<IGetCharacters>> {
    const characters = await this.getCharactersUseCase.exec({ page, size });

    return {
      message: "Character list retrieved successfully",
      info: characters,
      status: HttpStatus.OK,
    };
  }
}
