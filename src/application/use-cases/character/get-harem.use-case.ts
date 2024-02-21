import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { PORT } from "src/application/enums";
import { UserNotFound } from "src/application/exceptions";
import { IMarry } from "src/application/presentations";
import { IUserRepository } from "src/domain/interfaces";

@Injectable()
export class GetHarem {
  private readonly logger = new Logger(GetHarem.name);

  constructor(@Inject(PORT.User) private readonly userRepository: IUserRepository) {}

  async exec(userId: string): Promise<IMarry[]> {
    const user = await this.userRepository.findOne({ _id: new Types.ObjectId(userId) }, "harem");

    if (!Boolean(user)) throw new UserNotFound();

    const harem: IMarry[] = user.harem.map(character => {
      return {
        id: character._id.toString(),
        name: character?.["name"],
        age: character?.["age"],
        gender: character?.["gender"],
        picture: character?.["picture"],
      };
    });

    return harem;
  }
}
