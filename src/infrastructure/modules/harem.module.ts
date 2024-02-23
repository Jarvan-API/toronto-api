import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { AdminLogSchema, CharacterSchema, HaremSchema, SessionSchema, UserSchema } from "src/domain/entities";
import { WithdrawKakera, DepositKakera, GetHarem, UploadCharacter, GetAuthSession } from "src/application/use-cases";

import { HaremControllerV1 } from "../controllers";
import { AdminLogRepository, CharacterRepository, HaremRepository, SessionRepository, UserRepository } from "../repositories";
import { AdminLogEventModule } from "../events";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.Character, schema: CharacterSchema },
      { name: Entity.User, schema: UserSchema },
      { name: Entity.Harem, schema: HaremSchema },
      { name: Entity.AdminLog, schema: AdminLogSchema },
      { name: Entity.Session, schema: SessionSchema },
    ]),
    AdminLogEventModule,
  ],
  controllers: [HaremControllerV1],
  providers: [
    GetHarem,
    UploadCharacter,
    DepositKakera,
    WithdrawKakera,
    GetAuthSession,
    { provide: PORT.Harem, useClass: HaremRepository },
    { provide: PORT.User, useClass: UserRepository },
    { provide: PORT.Character, useClass: CharacterRepository },
    { provide: PORT.Session, useClass: SessionRepository },
    { provide: PORT.AdminLog, useClass: AdminLogRepository },
  ],
  exports: [],
})
export class HaremModule {}
