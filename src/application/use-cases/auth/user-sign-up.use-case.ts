import { Inject, Injectable, Logger } from "@nestjs/common";

import { SignUpDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { EUserRole, EUserStatus, IUser } from "src/domain/entities";
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

    const hashedPassword = await this.bcryptService.encriptPassword(password);

    const user: IUser = {
      firstname: "",
      lastname: "",
      email,
      password: hashedPassword,
      status: EUserStatus.PENDING,
      role: EUserRole.USER,
    };

    const userCreated = await this.userRepository.create(user);

    return userCreated._id;
  }
}
