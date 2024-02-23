import { Model, Types, UpdateQuery, FilterQuery as MongooseFilterQuery } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";

import { ICreateDocument } from "src/application/types";
import { IRepository } from "src/domain/interfaces";
import { EncryptionService } from "src/application/services";

@Injectable()
export abstract class Repository<T> implements IRepository<T> {
  protected readonly logger: Logger;

  constructor(
    private readonly model: Model<T>,
    protected readonly encryptionService?: EncryptionService,
  ) {
    this.logger = new Logger(model.name);
  }

  async create(data: ICreateDocument<T>): Promise<T> {
    // encriptar
    return await this.model.create(data.value || data);
  }

  async findAll(filter?: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter);
  }

  async findOne(filter: FilterQuery<T>): Promise<T> {
    const query = this.model.findOne(filter);

    if (Boolean(filter.populate)) query.populate(filter.populate);

    return await query.exec();
  }

  async update(_id: string, data: UpdateQuery<T>): Promise<any> {
    return await this.model.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, data);
  }

  async delete(_id: string): Promise<any> {
    return await this.model.deleteOne({ _id });
  }
}

export class FilterQuery<T> {
  query: MongooseFilterQuery<T>;
  populate: string | string[];
}
