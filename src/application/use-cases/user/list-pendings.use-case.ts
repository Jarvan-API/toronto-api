import { Inject, Injectable, Logger } from "@nestjs/common";

import { PaginationQuery } from "src/application/dtos";
import { EUserStatus, PORT } from "src/application/enums";
import { IPaginatedList, IPendingUser } from "src/application/presentations";
import { IUser } from "src/domain/entities";
import { IUserRepository } from "src/domain/interfaces";
import { FilterQuery } from "src/infrastructure/repositories";

@Injectable()
export class ListPendingUsers {
  private readonly logger = new Logger(ListPendingUsers.name);

  constructor(@Inject(PORT.User) private readonly userRepository: IUserRepository) {}

  async exec(query: PaginationQuery): Promise<IPaginatedList<IPendingUser>> {
    const filter: FilterQuery<IUser> = { query: { status: EUserStatus.PENDING } };

    const users = await this.userRepository.findAll({ ...filter, skip: query.page, limit: query.size });
    const count = await this.userRepository.count(filter);
    const pages = Math.ceil(count / query.size) | 1;

    const items = users.map(user => {
      return { _id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email, createdAt: user.createdAt };
    });

    return {
      items,
      pages,
      count,
      page: query.page | 1,
    };
  }
}
