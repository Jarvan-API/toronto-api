import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";

import { IGetCharacters, PaginatedList } from "src/application/presentations";
import { GetCharacters } from "src/application/use-cases";
import { GenericSwagger } from "src/infrastructure/decorators/swagger.decorator";

@Controller({
  path: "characters",
  version: "1",
})
@UseGuards(ThrottlerGuard)
export class CharacterControllerV1 {
  constructor(private readonly getCharactersUseCase: GetCharacters) {}

  @Get("/list")
  @HttpCode(HttpStatus.OK)
  @GenericSwagger({ summary: "List characters" })
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
  @ApiOkResponse({
    description: "List of all characters",
    type: PaginatedList<IGetCharacters>,
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
