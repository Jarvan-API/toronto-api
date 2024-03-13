import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { PORT } from "src/application/enums";
import { SlackRepository } from "src/infrastructure/repositories";
import { FlagService } from "./flag.service";

@Module({
  imports: [HttpModule],
  providers: [
    FlagService,
    {
      provide: PORT.Slack,
      useClass: SlackRepository,
    },
  ],
  exports: [FlagService],
})
export class FlagModule {}
