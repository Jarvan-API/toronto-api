import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";

import { SignInDTO, SignUpDTO } from "src/application/dtos";
import { DefaultApiResponse, ExceptionDTO } from "src/application/dtos/common.dtos";
import { UserCreated, UserLoggedIn } from "src/application/presentations";
import { UserSignIn, UserSignUp } from "src/application/use-cases";
import { ISession } from "src/domain/entities";
import { AuthenticatedGuard, LocalAuthGuard } from "src/infrastructure/config";

@Controller({
  path: "auth",
  version: "1",
})
@ApiTags("Auth")
@UseGuards(ThrottlerGuard)
export class AuthControllerV1 {
  private readonly logger = new Logger(AuthControllerV1.name);

  constructor(private readonly signupUseCase: UserSignUp,
    private readonly signInUseCase: UserSignIn) {}

  @Post("sign-up")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register user" })
  @ApiBody({
    type: SignUpDTO,
  })
  @ApiOkResponse({
    description: "User created",
    type: UserCreated,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async signUp(@Body() data: SignUpDTO): Promise<UserCreated> {
    const userId = await this.signupUseCase.exec(data);

    return { message: "New user created", info: { id: userId }, status: HttpStatus.CREATED };
  }

  @Post("sign-in")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login with email and password" })
  @ApiBody({
    type: SignInDTO,
  })
  @ApiOkResponse({
    description: "User logged",
    type: UserLoggedIn,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
    type: ExceptionDTO,
  })
  async signIn(@Request() req): Promise<UserLoggedIn> {
    await this.signInUseCase.exec(req.sessionID);

    return { message: "User logged", data: { session_id: req.sessionID, userStatus: req.user.status, id: req.user.id }, status: HttpStatus.OK}
  }

  @Get("/")
  @UseGuards(ThrottlerGuard, AuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Check session status" })
  @ApiOkResponse({
    description: "User is logged correctly",
    type: UserLoggedIn,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
    type: ExceptionDTO,
  })
  async check(): Promise<DefaultApiResponse> {
    return { message: "User is logged", status: HttpStatus.OK}
  }
}
