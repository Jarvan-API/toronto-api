import { ThrottlerGuard } from "@nestjs/throttler";
import { Controller, Logger, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { GetChats } from "src/application/use-cases";
import { AuthenticatedGuard } from "src/infrastructure/config";

@Controller({
  path: "chat",
  version: "1",
})
@ApiTags("Chat")
@UseGuards(ThrottlerGuard, AuthenticatedGuard)
export class ChatControllerV1 {
  private readonly logger = new Logger(ChatControllerV1.name);

  constructor(private readonly getChatsUseCase: GetChats) {}
}
