import { Inject, Injectable, Logger } from "@nestjs/common";
import { Types } from "mongoose";

import { PORT } from "src/application/enums";
import { UserNotFound } from "src/application/exceptions";
import { IGetHarem } from "src/application/presentations";
import { IHaremRepository, IUserRepository } from "src/domain/interfaces";

@Injectable()
export class GetHarem {
  private readonly logger = new Logger(GetHarem.name);

  constructor(
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
    @Inject(PORT.User) private readonly haremRepository: IHaremRepository,
  ) {}

  async exec(userId: string): Promise<IGetHarem> {
    const user = await this.userRepository.findOne({ query: { _id: new Types.ObjectId(userId) }, populate: "harem" });
    if (!Boolean(user)) throw new UserNotFound();
    const marries = user.harem?.["characters"].map(character => {
      return {
        name: character?.["name"],
        age: character?.["age"],
        gender: character?.["gender"],
        picture: character?.["picture"],
      };
    });

    return {
      marries: marries,
      kakera: user.harem?.["kakera"],
    };
  }
}
