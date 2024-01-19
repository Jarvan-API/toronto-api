import { Inject, Injectable, Logger } from "@nestjs/common";
import { SendMessageDTO } from "src/application/dtos";
import { PORT } from "src/application/enums";
import { IChat } from "src/domain/entities";
import { IChatRepository } from "src/domain/interfaces";

@Injectable()
export class SendMessage {
  private readonly logger = new Logger(SendMessage.name);

  constructor(@Inject(PORT.Chat) private readonly chatRepository: IChatRepository) {}

  async exec(data: SendMessageDTO, userId: string): Promise<IChat> {
    const chat: IChat = {
      sender: userId,
      message: data.message,
      recipient: "",
    };

    const generatedChat = await this.chatRepository.create(chat);
    return generatedChat;
  }
}
