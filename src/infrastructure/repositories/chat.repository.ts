import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";

import { Chat, IChat } from "src/domain/entities";
import { IChatRepository } from "src/domain/interfaces";
import { Entity } from "src/application/enums";

@Injectable()
export class ChatRepository implements IChatRepository {
  private readonly logger = new Logger(ChatRepository.name);

  constructor(@InjectModel(Entity.Chat) private readonly chatModel: Model<Chat>) {}

  async create(user: IChat): Promise<IChat> {
    return await this.chatModel.create(user);
  }

  async findAll(filter?: FilterQuery<IChat>): Promise<IChat[]> {
    return this.chatModel.find(filter);
  }

  async findOne(filter: FilterQuery<IChat>): Promise<IChat> {
    return await this.chatModel.findOne(filter);
  }

  async update(_id: string, data: UpdateQuery<IChat>): Promise<any> {
    return await this.chatModel.findOneAndUpdate({ _id: new Types.ObjectId(_id) }, data);
  }

  async delete(_id: string): Promise<any> {
    return await this.chatModel.deleteOne({ _id: new Types.ObjectId(_id) });
  }
}
