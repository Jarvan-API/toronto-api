import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Put, Request, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";
import { OnboardingDTO } from "src/application/dtos";

import { DefaultApiResponse, ExceptionDTO } from "src/application/dtos/common.dtos";
import { PendingUsers, UserProfile } from "src/application/presentations";
import { ChangePendingUser, GetUserProfile, ListPendingUsers, Onboarding } from "src/application/use-cases";
import { AuthenticatedAdminGuard, AuthenticatedGuard } from "src/infrastructure/config";

@Controller({
  path: "user",
  version: "1",
})
@ApiTags("User")
@UseGuards(ThrottlerGuard, AuthenticatedGuard)
export class UserControllerV1 {
  private readonly logger = new Logger(UserControllerV1.name);

  constructor(
    private readonly getUserProfileUseCase: GetUserProfile,
    private readonly onboardingUseCase: Onboarding,
    private readonly listPendingUsersUseCase: ListPendingUsers,
    private readonly changePendingUserUseCase: ChangePendingUser,
  ) {}

  @Get("/")
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({ summary: "Search for current logged user's information" })
  @ApiOkResponse({
    description: "User found",
    type: UserProfile,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async getProfile(@Request() req): Promise<UserProfile> {
    const userId = req.user?._doc?._id;

    const user = await this.getUserProfileUseCase.exec(userId);

    return { message: "User found", user, status: HttpStatus.FOUND };
  }

  @Put("/onboarding")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Complete user's information" })
  @ApiBody({
    description: "Onboarding data",
    type: OnboardingDTO,
  })
  @ApiOkResponse({
    description: "Onboarding made",
    type: DefaultApiResponse,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async onboarding(@Request() req, @Body() body: OnboardingDTO): Promise<DefaultApiResponse> {
    const userId = req.user?._doc?._id;
    await this.onboardingUseCase.exec(body, userId);

    return { message: "Onboarding made", status: HttpStatus.OK };
  }

  @Get("/pending-users")
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(AuthenticatedAdminGuard)
  @ApiOperation({ summary: "Retrieves list of pending users waiting for approval" })
  @ApiOkResponse({
    description: "Pending users list",
    type: PendingUsers,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async listPendingUsers(): Promise<PendingUsers> {
    const users = await this.listPendingUsersUseCase.exec();

    return { message: "List of pending users retrieved successfully", users, status: HttpStatus.FOUND };
  }

  @Put("/pending-users/accept/:userId")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedAdminGuard)
  @ApiOperation({ summary: "Approves user from pending list" })
  @ApiParam({
    name: "userId",
    description: "Pending user ID",
    type: String,
  })
  @ApiOkResponse({
    description: "Ok request",
    type: DefaultApiResponse,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async acceptPendingUser(@Param("userId") userId: string): Promise<DefaultApiResponse> {
    await this.changePendingUserUseCase.exec(userId, true);

    return { message: "Pending user accepted successfully", status: HttpStatus.OK };
  }

  @Put("/pending-users/reject/:userId")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedAdminGuard)
  @ApiOperation({ summary: "Rejects user from pending list" })
  @ApiParam({
    name: "userId",
    description: "Pending user ID",
    type: String,
  })
  @ApiOkResponse({
    description: "Ok request",
    type: DefaultApiResponse,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async rejectPendingUser(@Param("userId") userId: string): Promise<DefaultApiResponse> {
    await this.changePendingUserUseCase.exec(userId, false);

    return { message: "Pending user rejected successfully", status: HttpStatus.OK };
  }
}
