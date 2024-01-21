import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";

import { AdminLog, IAdminLog } from "src/domain/entities";
import { Entity } from "src/application/enums";
import { IAdminLogRepository } from "src/domain/interfaces";

@Injectable()
export class AdminLogRepository implements IAdminLogRepository {
  private readonly logger = new Logger(AdminLogRepository.name);

  constructor(@InjectModel(Entity.AdminLog) private readonly AdminLogModel: Model<AdminLog>) {}

  async create(adminLog: IAdminLog): Promise<IAdminLog> {
    return await this.AdminLogModel.create(adminLog);
  }

  async findAll(filter?: FilterQuery<IAdminLog>): Promise<IAdminLog[]> {
    return this.AdminLogModel.find(filter).exec();
  }

  async findOne(filter: FilterQuery<IAdminLog>): Promise<IAdminLog> {
    return await this.AdminLogModel.findOne(filter);
  }

  async update(_id: string, data: UpdateQuery<IAdminLog>): Promise<any> {
    return await this.AdminLogModel.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, data);
  }

  async delete(_id: string): Promise<any> {
    return await this.AdminLogModel.deleteOne({ _id: new Types.ObjectId(_id) });
  }
}
