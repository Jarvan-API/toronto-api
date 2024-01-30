import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

import { Chat, IChat } from "src/domain/entities";
import { IChatRepository, Repository } from "src/domain/interfaces";
import { Entity } from "src/application/enums";

@Injectable()
export class ChatRepository extends Repository<IChat> implements IChatRepository {
  constructor(@InjectModel(Entity.Chat) private readonly chatModel: Model<Chat>) {
    super(chatModel);
  }
}
