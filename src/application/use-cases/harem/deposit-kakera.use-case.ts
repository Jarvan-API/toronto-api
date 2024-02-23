import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { ModifyKakeraDTO } from "src/application/dtos";
import { Events, PORT } from "src/application/enums";
import { UserNotFound } from "src/application/exceptions";
import { IUpdateKakera } from "src/application/presentations";
import { EAdminAction } from "src/application/types";
import { EActionType, IAdminLog, IHaremHistory } from "src/domain/entities";
import { IHaremRepository, IUserRepository } from "src/domain/interfaces";

@Injectable()
export class DepositKakera {
  private readonly logger = new Logger(DepositKakera.name);

  constructor(
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
    @Inject(PORT.Harem) private readonly haremRepository: IHaremRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async exec(userId: string, ourUserId: string, data: ModifyKakeraDTO): Promise<IUpdateKakera> {
    const { amount, reason } = data;
    const myOwnRequest = userId === ourUserId;

    const user = await this.userRepository.findOne({ query: { _id: new Types.ObjectId(userId) } });

    if (!Boolean(user)) throw new UserNotFound();

    const history: IHaremHistory = {
      notes: reason,
      kakera: amount,
      types: EActionType.KAKERA_DEPOSIT,
      reference: myOwnRequest ? undefined : new Types.ObjectId(ourUserId),
    };

    const kakera = await this.haremRepository.updateKakera(user.harem, amount, history);

    const adminLog: IAdminLog = {
      admin: new Types.ObjectId(ourUserId),
      action: EAdminAction.ADD_KAKERA,
      target: new Types.ObjectId(userId),
    };

    this.eventEmitter.emit(Events.ADMIN_LOG, adminLog);

    return { kakera, history };
  }
}
