import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { KakeraDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { IUpdateKakera } from "src/application/presentations";
import { EActionType, IHarem, IHaremHistory } from "src/domain/entities";
import { IHaremRepository, IUserRepository } from "src/domain/interfaces";

@Injectable()
export class DepositKakera {
  private readonly logger = new Logger(DepositKakera.name);

  constructor(
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
    @Inject(PORT.Harem) private readonly haremRepository: IHaremRepository,
  ) {}

  async exec(userId: string, data: KakeraDTO): Promise<IUpdateKakera> {
    const { amount, reason } = data;

    const user = await this.userRepository.findOne({ _id: new Types.ObjectId(userId) });

    const history: IHaremHistory = {
      notes: reason,
      kakera: amount,
      types: EActionType.KAKERA_DEPOSIT,
      reference: new Types.ObjectId(userId),
    };

    const kakera = await this.haremRepository.updateKakera(user.harem, amount, history);

    return { kakera, history };
  }
}
