import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { CharacterSchema, UserSchema } from "src/domain/entities";
import { GetHarem, UploadCharacter } from "src/application/use-cases";

import { HaremControllerV1 } from "../controllers";
import { CharacterRepository, UserRepository } from "../repositories";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.Character, schema: CharacterSchema },
      { name: Entity.User, schema: UserSchema },
    ]),
  ],
  controllers: [HaremControllerV1],
  providers: [GetHarem, UploadCharacter, { provide: PORT.User, useClass: UserRepository }, { provide: PORT.Character, useClass: CharacterRepository }],
  exports: [],
})
export class HaremModule {}
