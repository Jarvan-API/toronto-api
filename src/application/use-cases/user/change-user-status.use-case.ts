import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Types } from "mongoose";

import { EUserRole, EUserStatus, Events, PORT } from "src/application/enums";
import { TargetDidNotMetRequirements, UserNotAllowed, UserNotFound } from "src/application/exceptions";
import { EAdminAction } from "src/application/types";
import { IAdminLog } from "src/domain/entities";
import { IUserRepository } from "src/domain/interfaces";

@Injectable()
export class ChangeUserStatus {
  private readonly logger = new Logger(ChangeUserStatus.name);

  constructor(
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async exec(status: EUserStatus, adminId: string, userId: string, origin?: string, reason?: string, expectedStatus?: EUserStatus): Promise<any> {
    const user = await this.userRepository.findOne({ query: { _id: new Types.ObjectId(userId) } });

    if (!Boolean(user)) throw new UserNotFound();
    if (user.role === EUserRole.SUDO && user._id.toString() !== adminId) throw new UserNotAllowed();
    if (Boolean(expectedStatus) && user.status !== expectedStatus) throw new TargetDidNotMetRequirements();

    await this.userRepository.update(userId, { status });

    const log: IAdminLog = {
      admin: new Types.ObjectId(adminId),
      target: new Types.ObjectId(userId),
      action: this._getAdminAction(status),
      reason,
      origin,
    };

    this.eventEmitter.emit(Events.ADMIN_LOG, log);
  }

  _getAdminAction(status: EUserStatus): EAdminAction {
    if (status === EUserStatus.ACTIVE) return EAdminAction.ACTIVE_USER;
    if (status === EUserStatus.BLOCKED) return EAdminAction.BLOCK_USER;
  }
}
