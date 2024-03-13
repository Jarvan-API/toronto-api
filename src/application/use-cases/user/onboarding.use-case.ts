import { Types } from "mongoose";
import { Inject, Injectable, Logger } from "@nestjs/common";

import { OnboardingDTO } from "src/application/dtos";
import { EUserStatus, PORT } from "src/application/enums";
import { OnboardingAlreadyMade, UserNotFound } from "src/application/exceptions";
import { IUserRepository } from "src/domain/interfaces";

@Injectable()
export class Onboarding {
  private readonly logger = new Logger(Onboarding.name);

  constructor(@Inject(PORT.User) private readonly userRepository: IUserRepository) {}

  async exec(data: OnboardingDTO, userId: string): Promise<any> {
    const obid = new Types.ObjectId(userId);

    const user = await this.userRepository.findOne({ query: { _id: obid } });

    if (!Boolean(user)) throw new UserNotFound();
    if (user.status !== EUserStatus.PENDING_ONBOARDING) throw new OnboardingAlreadyMade();

    await this.userRepository.update(userId, { ...data, status: EUserStatus.PENDING });
  }
}
