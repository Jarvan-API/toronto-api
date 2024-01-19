import { Inject, Injectable, Logger } from "@nestjs/common";
import { PORT } from "src/application/enums";
import { IChat } from "src/domain/entities";
import { IChatRepository } from "src/domain/interfaces";

@Injectable()
export class GetChats {
  private readonly logger = new Logger(GetChats.name);

  constructor(@Inject(PORT.Chat) private readonly chatRepository: IChatRepository) {}

  async exec(): Promise<IChat[]> {
    const chats = await this.chatRepository.findAll();

    return chats;
  }
}
