import { Logger } from "@nestjs/common";
import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Entities } from "src/application/enums";
import { ISession, Session } from "src/domain/entities";
import { ISessionRepository } from "src/domain/interfaces";

export class SessionRepository implements ISessionRepository {
  private readonly logger = new Logger(SessionRepository.name);

  constructor(@InjectModel(Entities.Session) private readonly sessionModel: Model<Session>) {}

  async create(session: ISession): Promise<ISession> {
    return await this.sessionModel.create(session);
  }

  async findAll(): Promise<ISession[]> {
    return this.sessionModel.find();
  }

  async findOne(filter: FilterQuery<ISession>): Promise<ISession> {
    return await this.sessionModel.findOne(filter);
  }

  async update(_id: string, data: UpdateQuery<ISession>): Promise<any> {
    return await this.sessionModel.findOneAndUpdate({ _id }, data);
  }

  async delete(_id: string): Promise<any> {
    return await this.sessionModel.deleteOne({ _id });
  }
}
