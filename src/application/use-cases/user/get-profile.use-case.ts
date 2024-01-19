import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";
import { PORT } from "src/application/enums";
import { IUserProfile } from "src/application/presentations";
import { IUserRepository } from "src/domain/interfaces";

@Injectable()
export class GetUserProfile {
  private readonly logger = new Logger(GetUserProfile.name);

  constructor(@Inject(PORT.User) private readonly userRepository: IUserRepository) {}

  async exec(userId: string): Promise<IUserProfile> {
    const user = await this.userRepository.findOne({ _id: new Types.ObjectId(userId) });

    const userProfile: IUserProfile = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
    };

    return userProfile;
  }
}
