import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User, Session, Role } from "src/domain/entities";
import { PORT } from "src/application/enums";
import { GetSession } from "src/application/use-cases";

import { SessionRepository } from "../repositories";

@Module({
  imports: [TypeOrmModule.forFeature([User, Session, Role])],
  controllers: [],
  providers: [
    GetSession,
    {
      provide: PORT.Session,
      useClass: SessionRepository,
    },
  ],
  exports: [],
})
export class SessionModule {}
