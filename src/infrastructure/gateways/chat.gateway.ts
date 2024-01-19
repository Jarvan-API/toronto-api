import { Bind } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { NestGateway } from "@nestjs/websockets/interfaces/nest-gateway.interface";
import { SendMessageDTO } from "src/application/dtos";
import { GetChats, SendMessage } from "src/application/use-cases";

@WebSocketGateway()
export class ChatGateway implements NestGateway {
  constructor(
    private readonly getChatsUseCase: GetChats,
    private readonly sendMessageUseCase: SendMessage,
  ) {}

  afterInit?: (server: any) => void;

  async handleConnection(socket: any) {
    const chats = await this.getChatsUseCase.exec();
    socket.emit("allChats", chats);
  }

  handleDisconnect?: (client: any) => void;

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage("chat")
  handleNewMessage(data: SendMessageDTO, sender: any) {
    const chat = this.sendMessageUseCase.exec(data, "65aadadc84150df9721c3c6f");
    sender.emit("newChat", chat);
    sender.broadcast.emit("newChat", chat);
  }
}
