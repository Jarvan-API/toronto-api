import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { VerifySignUp } from "src/application/use-cases/sessions/verify-sign-up.use-case";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly verifySignUpUseCase: VerifySignUp) {
    super({
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    });
  }

  async validate(req:any, email: string, password: string): Promise<any> {
    return await this.verifySignUpUseCase.exec({ email, password });
  }
}
