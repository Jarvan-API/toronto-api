import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { CharacterSchema, HaremSchema, UserSchema } from "src/domain/entities";
import { WithdrawKakera, DepositKakera, GetHarem, UploadCharacter } from "src/application/use-cases";

import { HaremControllerV1 } from "../controllers";
import { CharacterRepository, UserRepository } from "../repositories";
import { HaremRepository } from "../repositories/harem.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.Character, schema: CharacterSchema },
      { name: Entity.User, schema: UserSchema },
      { name: Entity.Harem, schema: HaremSchema },
    ]),
  ],
  controllers: [HaremControllerV1],
  providers: [
    GetHarem,
    UploadCharacter,
    DepositKakera,
    WithdrawKakera,
    { provide: PORT.User, useClass: UserRepository },
    { provide: PORT.Character, useClass: CharacterRepository },
    { provide: PORT.Harem, useClass: HaremRepository },
  ],
  exports: [],
})
export class HaremModule {}
