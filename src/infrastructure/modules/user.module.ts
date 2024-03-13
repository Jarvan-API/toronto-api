import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";

import { Entity, PORT } from "src/application/enums";
import { ChangeUserStatus, ChangeProfilePicture, GetAuthSession, GetUserProfile, ListPendingUsers, Onboarding, RequestRecovery, ChangePassword } from "src/application/use-cases";
import { AdminLogSchema, SessionSchema, UserSchema, NotificationSchema } from "src/domain/entities";
import { FlagModule } from "src/application/services";

import { UserControllerV1 } from "../controllers";
import { AdminLogRepository, NotificationRepository, RedisRepository, SessionRepository, SlackRepository, StorageRepository, UserRepository } from "../repositories";
import { BcryptService } from "../config";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.User, schema: UserSchema },
      { name: Entity.Session, schema: SessionSchema },
      { name: Entity.AdminLog, schema: AdminLogSchema },
      { name: Entity.Notification, schema: NotificationSchema },
    ]),
    FlagModule,
  ],
  controllers: [UserControllerV1],
  providers: [
    GetUserProfile,
    ListPendingUsers,
    ChangeUserStatus,
    Onboarding,
    GetAuthSession,
    ChangeProfilePicture,
    RequestRecovery,
    ChangePassword,
    BcryptService,
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
    {
      provide: PORT.Redis,
      useClass: RedisRepository,
    },
    {
      provide: PORT.Notification,
      useClass: NotificationRepository,
    },
  ],
  exports: [],
})
export class UserModule {}
