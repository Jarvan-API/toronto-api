import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { ChangePendingUser, ChangeProfilePicture, GetAuthSession, GetUserProfile, ListPendingUsers, Onboarding } from "src/application/use-cases";
import { SessionSchema, UserSchema } from "src/domain/entities";

import { UserControllerV1 } from "../controllers";
import { SessionRepository, StorageRepository, UserRepository } from "../repositories";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.User, schema: UserSchema },
      { name: Entity.Session, schema: SessionSchema },
    ]),
  ],
  controllers: [UserControllerV1],
  providers: [
    GetUserProfile,
    ListPendingUsers,
    ChangePendingUser,
    Onboarding,
    GetAuthSession,
    ChangeProfilePicture,
    {
      provide: PORT.User,
      useClass: UserRepository,
    },
    {
      provide: PORT.Session,
      useClass: SessionRepository,
    },
    {
      provide: PORT.Storage,
      useClass: StorageRepository,
    },
  ],
  exports: [],
})
export class UserModule {}
