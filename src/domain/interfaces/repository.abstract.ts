import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export abstract class Repository<T> {
  protected readonly logger: Logger;

  constructor(private readonly model: Model<T>) {
    this.logger = new Logger(model.name);
  }

  async create(value: T): Promise<T> {
    return await this.model.create(value);
  }

  async findAll(filter?: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter);
  }

  async findOne(filter: FilterQuery<T>): Promise<T> {
    return await this.model.findOne(filter);
  }

  async update(_id: string, data: UpdateQuery<T>): Promise<any> {
    return await this.model.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, data);
  }

  async delete(_id: string): Promise<any> {
    return await this.model.deleteOne({ _id });
  }
}
