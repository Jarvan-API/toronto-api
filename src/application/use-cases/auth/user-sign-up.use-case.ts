import { Inject, Injectable, Logger } from "@nestjs/common";

import { SignUpDTO } from "src/application/dtos";
import { EUserRole, EUserStatus, PORT } from "src/application/enums";
import { EmailAlreadyUsed } from "src/application/exceptions";
import { IUser } from "src/domain/entities";
import { IUserRepository } from "src/domain/interfaces";
import { BcryptService } from "src/infrastructure/config";

@Injectable()
export class UserSignUp {
  private readonly logger = new Logger(UserSignUp.name);

  constructor(
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async exec(data: SignUpDTO): Promise<string> {
    const { email, password } = data;

    const dup = await this.userRepository.findOne({ email });
    if (Boolean(dup)) throw new EmailAlreadyUsed();

    const hashedPassword = await this.bcryptService.encriptPassword(password);

    const user: IUser = {
      email,
      password: hashedPassword,
      status: EUserStatus.PENDING_ONBOARDING,
      role: EUserRole.USER,
    };

    const userCreated = await this.userRepository.create(user);

    return userCreated._id;
  }
}
