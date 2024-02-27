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
    return await this.model.create(data.value || data);
  }

  async findAll(filter?: FilterQuery<T>): Promise<T[]> {
    const query = this.model.find(filter.query);

    if (Boolean(filter.populate)) query.populate(filter.populate);

    if (Boolean(filter.skip) && Boolean(filter.limit)) {
      const skip = Boolean(filter.skip) ? (filter.skip - 1) * filter.limit : undefined;
      query.skip(skip);
      query.limit(filter.limit);
    }

    return await query.exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T> {
    const query = this.model.findOne(filter.query);

    if (Boolean(filter.populate)) query.populate(filter.populate);

    return await query.exec();
  }

  async update(_id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate({ _id }, data, { new: true }).exec();
  }

  async updateAll(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<any> {
    return this.model.updateMany(filter.query, data);
  }

  async delete(_id: string): Promise<any> {
    return await this.model.deleteOne({ _id });
  }

  async count(filter?: FilterQuery<T>): Promise<number> {
    return await this.model.countDocuments(filter.query);
  }
}

export class FilterQuery<T> {
  query: MongooseFilterQuery<T>;
  populate?: string | string[];
  skip?: number;
  limit?: number;
}
