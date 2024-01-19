import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Put, Request, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";
import { OnboardingDTO } from "src/application/dtos";

import { DefaultApiResponse, ExceptionDTO } from "src/application/dtos/common.dtos";
import { UserProfile } from "src/application/presentations";
import { GetUserProfile, Onboarding } from "src/application/use-cases";
import { AuthenticatedGuard } from "src/infrastructure/config";

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
}
