import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { ExceptionDTO, KakeraDTO } from "src/application/dtos";
import { GetHaremPresentation, UpdateKakeraPresentation } from "src/application/presentations";
import { DepositKakera, GetHarem, UploadCharacter } from "src/application/use-cases";
import { WithdrawKakera } from "src/application/use-cases/harem/withdraw-kakera.use-case";

@Controller({
  path: "harem",
  version: "1",
})
export class HaremControllerV1 {
  constructor(
    private readonly getHaremUseCase: GetHarem,
    private readonly depositKakeraUseCase: DepositKakera,
    private readonly withdrawKakeraUseCase: WithdrawKakera,
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

  @Put(":userId/deposit")
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({ summary: "List user harem" })
  @ApiOkResponse({
    description: "List of user's marries",
    type: UpdateKakeraPresentation,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async depositKakera(@Param("userId") userId: string, @Body() body: KakeraDTO): Promise<UpdateKakeraPresentation> {
    const deposit = await this.depositKakeraUseCase.exec(userId, body);

    return { message: "Deposit successful", info: deposit, status: HttpStatus.FOUND };
  }

  @Put(":userId/withdraw")
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({ summary: "List user harem" })
  @ApiOkResponse({
    description: "List of user's marries",
    type: UpdateKakeraPresentation,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async withdrawKakera(@Param("userId") userId: string, @Body() body: KakeraDTO): Promise<UpdateKakeraPresentation> {
    const deposit = await this.withdrawKakeraUseCase.exec(userId, body);

    return { message: "Deposit successful", info: deposit, status: HttpStatus.FOUND };
  }
}
