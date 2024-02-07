import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";

import { ICreateDocument } from "src/application/types";
import { IRepository } from "src/domain/interfaces";
import { EncryptionService } from "src/application/services";
import { ENCRYPTABLE_KEY } from "src/domain/decorators";

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
    if (this.encryptionService) {
      this._encryptObjectFields(data.value);
    }
    return await this.model.create(data.value);
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

  private _encryptObjectFields(obj: any, key?: string): void {
    Object.keys(obj).forEach(field => {
      const isEncryptable = Reflect.getMetadata(ENCRYPTABLE_KEY, obj, field);
      console.log(isEncryptable);
      if (isEncryptable) {
        obj[field] = this.encryptionService.encrypt(obj[field], key);
      } else if (typeof obj[field] === "object" && obj[field] !== null) {
        this._encryptObjectFields(obj[field], key);
      }
    });
  }
}
