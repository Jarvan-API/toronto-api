import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { ChangeUserStatus, ChangeProfilePicture, GetAuthSession, GetUserProfile, ListPendingUsers, Onboarding } from "src/application/use-cases";
import { AdminLogSchema, SessionSchema, UserSchema } from "src/domain/entities";

import { UserControllerV1 } from "../controllers";
import { AdminLogRepository, SessionRepository, StorageRepository, UserRepository } from "../repositories";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.User, schema: UserSchema },
      { name: Entity.Session, schema: SessionSchema },
      { name: Entity.AdminLog, schema: AdminLogSchema },
    ]),
  ],
  controllers: [UserControllerV1],
  providers: [
    GetUserProfile,
    ListPendingUsers,
    ChangeUserStatus,
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
    {
      provide: PORT.AdminLog,
      useClass: AdminLogRepository,
    },
  ],
  exports: [],
})
export class UserModule {}
