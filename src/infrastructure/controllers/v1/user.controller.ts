import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";

import { ChangePasswordDTO, OnboardingDTO, RequestRecoveryDTO } from "src/application/dtos";
import { DefaultAdminActionApiRequest, DefaultApiResponse, ExceptionDTO } from "src/application/dtos/common.dtos";
import { EUserStatus } from "src/application/enums";
import { IPendingUser, PaginatedList, ProfilePictureChange, RequestRecoveryPresentation, UserProfile } from "src/application/presentations";
import { ChangePassword, ChangeProfilePicture, ChangeUserStatus, GetUserProfile, ListPendingUsers, Onboarding, RequestRecovery } from "src/application/use-cases";
import { AuthenticatedAdminGuard, AuthenticatedGuard, LowAuthenticatedGuard } from "src/infrastructure/config";

@Controller({
  path: "user",
  version: "1",
})
@ApiTags("User")
@UseGuards(ThrottlerGuard)
export class UserControllerV1 {
  private readonly logger = new Logger(UserControllerV1.name);

  constructor(
    private readonly getUserProfileUseCase: GetUserProfile,
    private readonly onboardingUseCase: Onboarding,
    private readonly listPendingUsersUseCase: ListPendingUsers,
    private readonly changeUserStatusUseCase: ChangeUserStatus,
    private readonly changeProfilePictureUseCase: ChangeProfilePicture,
    private readonly requestRecoveryUseCase: RequestRecovery,
    private readonly changePasswordUseCase: ChangePassword,
  ) {}

  @Get("/me")
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(LowAuthenticatedGuard)
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
    const userId = req.user._doc._id;

    const user = await this.getUserProfileUseCase.exec(userId);

    return { message: "User found", user, status: HttpStatus.FOUND };
  }

  @Put("/onboarding")
  @HttpCode(HttpStatus.OK)
  @UseGuards(LowAuthenticatedGuard)
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

  @Put("/change-picture")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({ summary: "Changes profile picture from user" })
  @ApiOkResponse({
    description: "Ok request",
    type: ProfilePictureChange,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  @UseInterceptors(FileInterceptor("file"))
  async changePicture(@UploadedFile() file: Express.Multer.File, @Request() req): Promise<ProfilePictureChange> {
    const userId = req.user._doc._id;

    const picture = await this.changeProfilePictureUseCase.exec(file, userId);

    return { message: "Profile picture changed successfully", path: picture.path, status: HttpStatus.OK };
  }

  /* Administrator endpoints */
  @Get("/pending-users")
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(AuthenticatedAdminGuard)
  @ApiOperation({ summary: "Retrieves list of pending users waiting for approval" })
  @ApiOkResponse({
    description: "Pending users list",
    type: PaginatedList<IPendingUser>,
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
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async listPendingUsers(@Query("page") page: number, @Query("count") count: number): Promise<PaginatedList<IPendingUser>> {
    const list = await this.listPendingUsersUseCase.exec({ page, size: count });

    return { message: "List of pending users retrieved successfully", info: list, status: HttpStatus.FOUND };
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
  async acceptPendingUser(@Param("userId") userId: string, @Request() req): Promise<DefaultApiResponse> {
    const adminId = req.user._doc._id;

    await this.changeUserStatusUseCase.exec(EUserStatus.ACTIVE, adminId, userId, this.acceptPendingUser.name, "", EUserStatus.PENDING);

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
  @ApiBody({
    description: "Reject information",
    type: DefaultAdminActionApiRequest,
  })
  @ApiOkResponse({
    description: "Ok request",
    type: DefaultApiResponse,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async rejectPendingUser(@Param("userId") userId: string, @Request() req, @Body() data: DefaultAdminActionApiRequest): Promise<DefaultApiResponse> {
    const adminId = req.user._doc._id;

    await this.changeUserStatusUseCase.exec(EUserStatus.BLOCKED, adminId, userId, this.rejectPendingUser.name, data.action_reason, EUserStatus.PENDING_ONBOARDING);

    return { message: "Pending user rejected successfully", status: HttpStatus.OK };
  }

  @Put("block/:userId")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedAdminGuard)
  @ApiOperation({ summary: "Blocks user" })
  @ApiParam({
    name: "userId",
    description: "Pending user ID",
    type: String,
  })
  @ApiBody({
    description: "Block information",
    type: DefaultAdminActionApiRequest,
  })
  @ApiOkResponse({
    description: "Ok request",
    type: DefaultApiResponse,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async blockUser(@Param("userId") userId: string, @Body() data: DefaultAdminActionApiRequest, @Request() req): Promise<DefaultApiResponse> {
    const adminId = req.user._doc._id;

    await this.changeUserStatusUseCase.exec(EUserStatus.BLOCKED, adminId, userId, this.blockUser.name, data.action_reason);

    return { message: "User blocked successfully", status: HttpStatus.OK };
  }

  @Post("request-recovery")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Creates a recovery password token" })
  @ApiBody({
    description: "User email",
    type: RequestRecoveryDTO,
  })
  @ApiOkResponse({
    description: "Ok request",
    type: DefaultApiResponse,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async requestRecovery(@Body() body: RequestRecoveryDTO): Promise<RequestRecoveryPresentation> {
    const { email } = body;

    const token = await this.requestRecoveryUseCase.exec(email);

    return { message: "Recovery password request created", info: { token }, status: HttpStatus.OK };
  }

  @Put("change-password/:token")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Changes password by token" })
  @ApiBody({
    description: "User new password",
    type: ChangePasswordDTO,
  })
  @ApiParam({
    name: "token",
    description: "Request token",
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
  async changePassword(@Body() body: ChangePasswordDTO, @Param("token") token: string): Promise<DefaultApiResponse> {
    const { password } = body;

    await this.changePasswordUseCase.exec(password, token);

    return { message: "Changed password successfully", status: HttpStatus.OK };
  }
}
