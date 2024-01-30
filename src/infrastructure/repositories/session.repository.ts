import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Entity } from "src/application/enums";
import { ISession, Session } from "src/domain/entities";
import { ISessionRepository, Repository } from "src/domain/interfaces";

@Injectable()
export class SessionRepository extends Repository<ISession> implements ISessionRepository {
  constructor(@InjectModel(Entity.Session) private readonly sessionModel: Model<Session>) {
    super(sessionModel);
  }
}
