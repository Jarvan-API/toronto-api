import { Inject, Injectable, Logger } from "@nestjs/common";

import { SignInDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { InvalidCredentials } from "src/application/exceptions";
import { IUser } from "src/domain/entities";
import { IUserRepository } from "src/domain/interfaces";
import { BcryptService } from "src/infrastructure/config";

@Injectable()
export class VerifySignUp {
  private readonly logger = new Logger(VerifySignUp.name);

  constructor(
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async exec(data: SignInDTO): Promise<IUser> {
    const { email, password } = data;
    const user: IUser = await this.userRepository.findOne({ query: { email } });

    if (!Boolean(user)) throw new InvalidCredentials();

    const matchPassword = await this.bcryptService.comparePasswords(password, user.password);

    if (!matchPassword) {
      throw new InvalidCredentials();
    }

    return user;
  }
}
