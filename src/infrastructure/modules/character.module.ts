import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { CharacterSchema, HaremSchema, SessionSchema, UserSchema } from "src/domain/entities";
import { GetCharacters } from "src/application/use-cases";

import { CharacterControllerV1 } from "../controllers";
import { CharacterRepository, SessionRepository, UserRepository } from "../repositories";
import { AdminLogEventModule } from "../events";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.Character, schema: CharacterSchema },
      { name: Entity.User, schema: UserSchema },
      { name: Entity.Harem, schema: HaremSchema },
      { name: Entity.Session, schema: SessionSchema },
    ]),
    AdminLogEventModule,
  ],
  controllers: [CharacterControllerV1],
  providers: [
    GetCharacters,
    { provide: PORT.User, useClass: UserRepository },
    { provide: PORT.Character, useClass: CharacterRepository },
    { provide: PORT.Session, useClass: SessionRepository },
  ],
  exports: [],
})
export class CharacterModule {}
