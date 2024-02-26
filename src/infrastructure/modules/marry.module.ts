import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { CharacterSchema, HaremSchema, SessionSchema, UserSchema } from "src/domain/entities";
import { CloseMarryJam, CreateMarryJam, GetAuthSession, JoinMarryJam, Marry, RollMarry } from "src/application/use-cases";

import { CharacterRepository, HaremRepository, RedisRepository, SessionRepository, UserRepository } from "../repositories";
import { MarryGateway } from "../gateways";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.User, schema: UserSchema },
      { name: Entity.Session, schema: SessionSchema },
      { name: Entity.Character, schema: CharacterSchema },
      { name: Entity.Harem, schema: HaremSchema },
    ]),
  ],
  controllers: [],
  providers: [
    MarryGateway,
    GetAuthSession,
    CreateMarryJam,
    JoinMarryJam,
    RollMarry,
    Marry,
    CloseMarryJam,
    { provide: PORT.Redis, useClass: RedisRepository },
    { provide: PORT.Session, useClass: SessionRepository },
    { provide: PORT.User, useClass: UserRepository },
    { provide: PORT.Character, useClass: CharacterRepository },
    { provide: PORT.Harem, useClass: HaremRepository },
  ],
  exports: [],
})
export class MarryModule {}
