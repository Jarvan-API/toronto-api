import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { IUser, User } from "src/domain/entities";
import { IUserRepository } from "src/domain/interfaces";
import { Entity } from "src/application/enums";
import { Repository } from "./repository";

@Injectable()
export class UserRepository extends Repository<IUser> implements IUserRepository {
  constructor(@InjectModel(Entity.User) private readonly userModel: Model<User>) {
    super(userModel);
  }
}
