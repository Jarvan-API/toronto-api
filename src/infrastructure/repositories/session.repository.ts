import { FilterQuery, Model } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Entity } from "src/application/enums";
import { ISession, Session } from "src/domain/entities";
import { ISessionRepository } from "src/domain/interfaces";

@Injectable()
export class SessionRepository implements ISessionRepository {
  private readonly logger = new Logger(SessionRepository.name);

  constructor(@InjectModel(Entity.Session) private readonly sessionModel: Model<Session>) {}

  async create(session: ISession): Promise<ISession> {
    return await this.sessionModel.create(session);
  }

  async findOne(filter: FilterQuery<ISession>): Promise<ISession> {
    return await this.sessionModel.findOne(filter);
  }

  async delete(_id: string): Promise<any> {
    return await this.sessionModel.deleteOne({ _id });
  }
}
