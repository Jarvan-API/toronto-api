import { Types } from "mongoose";
import { Inject, Injectable, Logger } from "@nestjs/common";

import { OnboardingDTO } from "src/application/dtos";
import { EUserStatus, PORT } from "src/application/enums";
import { OnboardingAlreadyMade, UserNotFound } from "src/application/exceptions";
import { IUserRepository } from "src/domain/interfaces";
import { FlagService } from "src/application/services";

@Injectable()
export class Onboarding {
  private readonly logger = new Logger(Onboarding.name);

  constructor(
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
    private readonly flag: FlagService,
  ) {}

  async exec(data: OnboardingDTO, userId: string): Promise<any> {
    const obid = new Types.ObjectId(userId);
    this.flag.mark("OBID created", { name: "Onboarding" });

    const user = await this.userRepository.findOne({ query: { _id: obid } });
    this.flag.mark("User collected from DB");

    if (!Boolean(user)) throw new UserNotFound();
    this.flag.mark("User found");

    if (user.status !== EUserStatus.PENDING_ONBOARDING) throw new OnboardingAlreadyMade();
    this.flag.mark("User status checked");

    await this.userRepository.update(userId, { ...data, status: EUserStatus.PENDING });
    this.flag.mark("User updated");
  }
}
