import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Request, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";

import { ExceptionDTO, ModifyKakeraDTO } from "src/application/dtos";
import { GetHaremPresentation, UpdateKakeraPresentation } from "src/application/presentations";
import { DepositKakera, GetHarem, WithdrawKakera } from "src/application/use-cases";
import { AuthenticatedAdminGuard, AuthenticatedGuard } from "src/infrastructure/config";

@Controller({
  path: "harem",
  version: "1",
})
@UseGuards(ThrottlerGuard)
export class HaremControllerV1 {
  constructor(
    private readonly getHaremUseCase: GetHarem,
    private readonly depositKakeraUseCase: DepositKakera,
    private readonly withdrawKakeraUseCase: WithdrawKakera,
  ) {}

  @UseGuards(AuthenticatedGuard)
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

  @UseGuards(AuthenticatedAdminGuard)
  @Put(":userId/deposit")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Adds kakera to user" })
  @ApiOkResponse({
    description: "Deposit successfully made",
    type: UpdateKakeraPresentation,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async depositKakera(@Param("userId") userId: string, @Request() req, @Body() body: ModifyKakeraDTO): Promise<UpdateKakeraPresentation> {
    const adminId = req.user._doc._id;

    const deposit = await this.depositKakeraUseCase.exec(userId, adminId, body);

    return { message: "Deposit successfully made", info: deposit, status: HttpStatus.OK };
  }

  @UseGuards(AuthenticatedAdminGuard)
  @Put(":userId/withdraw")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Removes kakera from user" })
  @ApiOkResponse({
    description: "Withdraw successfully made",
    type: UpdateKakeraPresentation,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async withdrawKakera(@Param("userId") userId: string, @Request() req, @Body() body: ModifyKakeraDTO): Promise<UpdateKakeraPresentation> {
    const adminId = req.user._doc._id;

    const withdraw = await this.withdrawKakeraUseCase.exec(userId, adminId, body);

    return { message: "Withdraw successfully made", info: withdraw, status: HttpStatus.OK };
  }
}
