import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";

import { SignInDTO, SignUpDTO } from "src/application/dtos";
import { DefaultApiResponse, ExceptionDTO } from "src/application/dtos/common.dtos";
import { UserCreated, UserLoggedIn } from "src/application/presentations";
import { UserSignIn, UserSignUp } from "src/application/use-cases";
import { LocalAuthGuard, LowAuthenticatedGuard } from "src/infrastructure/config";
import { GenericSwagger } from "src/infrastructure/decorators/swagger.decorator";

@Controller({
  path: "auth",
  version: "1",
})
@ApiTags("Auth")
@UseGuards(ThrottlerGuard)
export class AuthControllerV1 {
  private readonly logger = new Logger(AuthControllerV1.name);

  constructor(
    private readonly signupUseCase: UserSignUp,
    private readonly signInUseCase: UserSignIn,
  ) {}

  @Post("sign-up")
  @HttpCode(HttpStatus.CREATED)
  @GenericSwagger({ summary: "Register user", body: SignUpDTO })
  @ApiOkResponse({
    description: "User created",
    type: UserCreated,
  })
  async signUp(@Body() data: SignUpDTO): Promise<UserCreated> {
    const userId = await this.signupUseCase.exec(data);

    return { message: "New user created", data: { id: userId }, status: HttpStatus.CREATED };
  }

  @Post("sign-in")
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @GenericSwagger({ summary: "Login with email and password", body: SignInDTO })
  @ApiOkResponse({
    description: "User logged",
    type: UserLoggedIn,
  })
  async signIn(@Request() req): Promise<UserLoggedIn> {
    await this.signInUseCase.exec(req.sessionID);

    return { message: "User logged", data: { session_id: req.sessionID, userStatus: req.user.status, id: req.user.id }, status: HttpStatus.OK };
  }

  @Get("/")
  @UseGuards(ThrottlerGuard, LowAuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  @GenericSwagger({ summary: "Check session status" })
  @ApiOkResponse({
    description: "User is logged correctly",
    type: UserLoggedIn,
  })
  async check(): Promise<DefaultApiResponse> {
    return { message: "User is logged", status: HttpStatus.OK };
  }

  @Delete("sign-out")
  @HttpCode(HttpStatus.OK)
  @UseGuards(LowAuthenticatedGuard)
  @GenericSwagger({ summary: "Sign outs user" })
  @ApiOkResponse({
    description: "Ok request",
    type: DefaultApiResponse,
  })
  async signout(@Request() req): Promise<DefaultApiResponse> {
    req.session.destroy();
    return { message: "User signout successfully", status: HttpStatus.OK };
  }
}
