import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";
import { EUserRole, EUserStatus, PORT } from "src/application/enums";
import { UserNotAllowed, UserNotFound } from "src/application/exceptions";
import { IUserRepository } from "src/domain/interfaces";

@Injectable()
export class ChangePendingUser {
  private readonly logger = new Logger(ChangePendingUser.name);

  constructor(@Inject(PORT.User) private readonly userRepository: IUserRepository) {}

  async exec(userId: string, approved: boolean): Promise<any> {
    const user = await this.userRepository.findOne({ _id: new Types.ObjectId(userId) });

    if (user.role === EUserRole.SUDO) throw new UserNotAllowed();

    const result = await this.userRepository.update(userId, { status: approved ? EUserStatus.ACTIVE : EUserStatus.BLOCKED });

    if (!Boolean(result)) throw new UserNotFound();

    return true;
  }
}
