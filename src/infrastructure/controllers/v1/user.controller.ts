import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";

import { ChangePasswordDTO, OnboardingDTO, RequestRecoveryDTO } from "src/application/dtos";
import { DefaultAdminActionApiRequest, DefaultApiResponse } from "src/application/dtos/common.dtos";
import { EUserStatus } from "src/application/enums";
import { IPendingUser, PaginatedList, ProfilePictureChange, RequestRecoveryPresentation, UserProfile } from "src/application/presentations";
import { ChangePassword, ChangeProfilePicture, ChangeUserStatus, GetUserProfile, ListPendingUsers, Onboarding, RequestRecovery } from "src/application/use-cases";
import { AuthenticatedAdminGuard, AuthenticatedGuard, LowAuthenticatedGuard } from "src/infrastructure/config";
import { GenericSwagger } from "src/infrastructure/decorators/swagger.decorator";

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
  @GenericSwagger({ summary: "Search for current logged user's information" })
  async getProfile(@Request() req): Promise<UserProfile> {
    const userId = req.user._doc._id;

    const user = await this.getUserProfileUseCase.exec(userId);

    return { message: "User found", user, status: HttpStatus.FOUND };
  }

  @Put("/onboarding")
  @HttpCode(HttpStatus.OK)
  @UseGuards(LowAuthenticatedGuard)
  @GenericSwagger({ summary: "Complete user's information", body: OnboardingDTO })
  async onboarding(@Request() req, @Body() body: OnboardingDTO): Promise<DefaultApiResponse> {
    const userId = req.user?._doc?._id;
    await this.onboardingUseCase.exec(body, userId);

    return { message: "Onboarding made", status: HttpStatus.OK };
  }

  @Put("/change-picture")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedGuard)
  @GenericSwagger({ summary: "Changes profile picture from user" })
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
  @GenericSwagger({ summary: "Retrieves list of pending users waiting for approval" })
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
    description: "Pending users list",
    type: PaginatedList<IPendingUser>,
  })
  async listPendingUsers(@Query("page") page: number, @Query("count") count: number): Promise<PaginatedList<IPendingUser>> {
    const list = await this.listPendingUsersUseCase.exec({ page, size: count });

    return { message: "List of pending users retrieved successfully", info: list, status: HttpStatus.FOUND };
  }

  @Put("/pending-users/accept/:userId")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedAdminGuard)
  @GenericSwagger({ summary: "Approves user from pending list", apiParam: "userId" })
  async acceptPendingUser(@Param("userId") userId: string, @Request() req): Promise<DefaultApiResponse> {
    const adminId = req.user._doc._id;

    await this.changeUserStatusUseCase.exec(EUserStatus.ACTIVE, adminId, userId, this.acceptPendingUser.name, "", EUserStatus.PENDING);

    return { message: "Pending user accepted successfully", status: HttpStatus.OK };
  }

  @Put("/pending-users/reject/:userId")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedAdminGuard)
  @GenericSwagger({ summary: "Rejects user from pending list", apiParam: "userId" })
  async rejectPendingUser(@Param("userId") userId: string, @Request() req, @Body() data: DefaultAdminActionApiRequest): Promise<DefaultApiResponse> {
    const adminId = req.user._doc._id;

    await this.changeUserStatusUseCase.exec(EUserStatus.BLOCKED, adminId, userId, this.rejectPendingUser.name, data.action_reason, EUserStatus.PENDING_ONBOARDING);

    return { message: "Pending user rejected successfully", status: HttpStatus.OK };
  }

  @Put("block/:userId")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticatedAdminGuard)
  @GenericSwagger({ summary: "Blocks user", apiParam: "userId" })
  async blockUser(@Param("userId") userId: string, @Body() data: DefaultAdminActionApiRequest, @Request() req): Promise<DefaultApiResponse> {
    const adminId = req.user._doc._id;

    await this.changeUserStatusUseCase.exec(EUserStatus.BLOCKED, adminId, userId, this.blockUser.name, data.action_reason);

    return { message: "User blocked successfully", status: HttpStatus.OK };
  }

  @Post("request-recovery")
  @HttpCode(HttpStatus.OK)
  @GenericSwagger({ summary: "Creates a recovery password token", body: RequestRecoveryDTO })
  async requestRecovery(@Body() body: RequestRecoveryDTO): Promise<RequestRecoveryPresentation> {
    const { email } = body;

    const token = await this.requestRecoveryUseCase.exec(email);

    return { message: "Recovery password request created", info: { token }, status: HttpStatus.OK };
  }

  @Put("change-password/:token")
  @HttpCode(HttpStatus.OK)
  @GenericSwagger({ summary: "Changes password by token", apiParam: "token", body: ChangePasswordDTO })
  async changePassword(@Body() body: ChangePasswordDTO, @Param("token") token: string): Promise<DefaultApiResponse> {
    const { password } = body;

    await this.changePasswordUseCase.exec(password, token);

    return { message: "Changed password successfully", status: HttpStatus.OK };
  }
}
