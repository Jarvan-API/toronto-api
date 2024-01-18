import { FindOptionsWhere } from "typeorm";

import { ISession } from "../entities/session.entity";

export interface ISessionRepository {
  create: (session: ISession) => Promise<ISession>;
  findOne: (filters: FindOptionsWhere<ISession>) => Promise<ISession>;
  delete: (id: string) => Promise<any>;
}
