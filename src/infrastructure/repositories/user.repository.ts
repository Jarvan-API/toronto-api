import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { IUser, User } from "src/domain/entities";
import { IUserRepository, Repository } from "src/domain/interfaces";
import { Entity } from "src/application/enums";

@Injectable()
export class UserRepository extends Repository<IUser> implements IUserRepository {
  constructor(@InjectModel(Entity.User) private readonly userModel: Model<User>) {
    super(userModel);
  }
}
