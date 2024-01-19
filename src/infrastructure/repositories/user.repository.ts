import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";

import { IUser, User } from "src/domain/entities";
import { IUserRepository } from "src/domain/interfaces";
import { Entity } from "src/application/enums";

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(@InjectModel(Entity.User) private readonly userModel: Model<User>) {}

  async create(user: IUser): Promise<IUser> {
    return await this.userModel.create(user);
  }

  async findAll(): Promise<IUser[]> {
    return this.userModel.find();
  }

  async findOne(filter: FilterQuery<IUser>): Promise<IUser> {
    return await this.userModel.findOne(filter);
  }

  async update(_id: string, data: UpdateQuery<IUser>): Promise<any> {
    return await this.userModel.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, data);
  }

  async delete(_id: string): Promise<any> {
    return await this.userModel.deleteOne({ _id: new Types.ObjectId(_id) });
  }
}
