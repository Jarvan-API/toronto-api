import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { ModifyKakeraDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { IUpdateKakera } from "src/application/presentations";
import { EAdminAction } from "src/application/types";
import { EActionType, IAdminLog, IHaremHistory } from "src/domain/entities";
import { IAdminLogRepository, IHaremRepository, IUserRepository } from "src/domain/interfaces";

@Injectable()
export class DepositKakera {
  private readonly logger = new Logger(DepositKakera.name);

  constructor(
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
    @Inject(PORT.Harem) private readonly haremRepository: IHaremRepository,
    @Inject(PORT.AdminLog) private readonly adminLogRepoistory: IAdminLogRepository,
  ) {}

  async exec(userId: string, ourUserId: string, data: ModifyKakeraDTO): Promise<IUpdateKakera> {
    const { amount, reason } = data;
    const myOwnRequest = userId === ourUserId;

    const user = await this.userRepository.findOne({ query: { _id: new Types.ObjectId(userId) } });

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

    await this.adminLogRepoistory.create(adminLog);

    return { kakera, history };
  }
}
