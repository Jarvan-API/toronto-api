import { UpdateQuery } from "mongoose";

import { ICreateDocument } from "src/application/types";
import { FilterQuery } from "src/infrastructure/repositories";

import { INotification } from "../entities";

export interface INotificationsRepository {
  create: (data: ICreateDocument<INotification> | INotification) => Promise<INotification>;
  findAll: (filter?: FilterQuery<INotification>) => Promise<INotification[]>;
  findOne: (filter?: FilterQuery<INotification>) => Promise<INotification>;
  update: (_id: string, data: UpdateQuery<INotification>) => Promise<any>;
  delete: (_id: string) => Promise<any>;
}
