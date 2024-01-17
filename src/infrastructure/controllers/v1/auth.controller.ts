import { Body, Controller, HttpCode, HttpStatus, Logger, Post, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";

import { SignUpDTO } from "src/application/dtos";
import { ExceptionDTO } from "src/application/dtos/common.dtos";
import { UserCreated } from "src/application/presentations";
import { SignUp } from "src/application/use-cases";

@Controller({
  path: "auth",
  version: "1",
})
@ApiTags("Auth")
@UseGuards(ThrottlerGuard)
export class AuthControllerV1 {
  private readonly logger = new Logger(AuthControllerV1.name);

  constructor(private readonly signupUseCase: SignUp) {}

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
}
