import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { ChatSchema } from "src/domain/entities";
import { ChatRepository } from "../repositories";
import { ChatGateway } from "../gateways/chat.gateway";
import { GetChats, SendMessage } from "src/application/use-cases";

@Module({
  imports: [MongooseModule.forFeature([{ name: Entity.Chat, schema: ChatSchema }])],
  providers: [GetChats, SendMessage, ChatGateway, { provide: PORT.Chat, useClass: ChatRepository }],
  exports: [],
})
export class ChatModule {}
