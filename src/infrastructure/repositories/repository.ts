import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";

import { ICreateDocument, IEncryptionOptions } from "src/application/types";
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
    if (Boolean(data.options?.encryption) && this.encryptionService) {
      this.encryptFields(data.value, data.options.encryption);
    }

    return await this.model.create(data.value || data);
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

  private encryptFields(obj: any, encryptionOptions: IEncryptionOptions) {
    if (!obj || typeof obj !== "object") {
      return;
    }

    Object.keys(obj).forEach(key => {
      const value = obj[key];

      // If the value is an object, recurse into it
      if (typeof value === "object") {
        this.encryptFields(value, encryptionOptions);
      } else {
        // Check if the field should be encrypted
        if (encryptionOptions.includeFields?.includes(key)) {
          obj[key] = this.encryptionService.encrypt(value);
        }
      }
    });
  }
}
