import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";

import { IUserLog, UserLog } from "src/domain/entities";
import { Entity } from "src/application/enums";
import { IUserLogRepository } from "src/domain/interfaces";

@Injectable()
export class UserLogRepository implements IUserLogRepository {
  private readonly logger = new Logger(UserLogRepository.name);

  constructor(@InjectModel(Entity.UserLog) private readonly userLogModel: Model<UserLog>) {}

  async create(userLog: IUserLog): Promise<IUserLog> {
    return await this.userLogModel.create(userLog);
  }

  async findAll(filter?: FilterQuery<IUserLog>): Promise<IUserLog[]> {
    return this.userLogModel.find(filter).exec();
  }

  async findOne(filter: FilterQuery<IUserLog>): Promise<IUserLog> {
    return await this.userLogModel.findOne(filter);
  }

  async update(_id: string, data: UpdateQuery<IUserLog>): Promise<any> {
    return await this.userLogModel.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, data);
  }

  async delete(_id: string): Promise<any> {
    return await this.userLogModel.deleteOne({ _id: new Types.ObjectId(_id) });
  }
}
