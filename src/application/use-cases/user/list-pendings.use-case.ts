import { Inject, Injectable, Logger } from "@nestjs/common";

import { EUserStatus, PORT } from "src/application/enums";
import { IPendingUser } from "src/application/presentations";
import { IUserRepository } from "src/domain/interfaces";

@Injectable()
export class ListPendingUsers {
  private readonly logger = new Logger(ListPendingUsers.name);

  constructor(@Inject(PORT.User) private readonly userRepository: IUserRepository) {}

  async exec(): Promise<IPendingUser[]> {
    const users = await this.userRepository.findAll({ query: { status: EUserStatus.PENDING } });

    return users.map(user => {
      return { _id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email, createdAt: user.createdAt };
    });
  }
}
