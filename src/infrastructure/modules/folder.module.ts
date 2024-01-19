import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { ChangePendingUser, GetAuthSession, GetUserProfile, ListPendingUsers, Onboarding } from "src/application/use-cases";
import { FolderSchema, SessionSchema, UserSchema } from "src/domain/entities";

import { UserControllerV1 } from "../controllers";
import { FolderRepository, SessionRepository, UserRepository } from "../repositories";
import { FolderControllerV1 } from "../controllers/v1/folder.controller";
import { CreateFolder, GetFolders } from "src/application/use-cases/folder";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.Folder, schema: FolderSchema },
      { name: Entity.Session, schema: SessionSchema },
    ]),
  ],
  controllers: [FolderControllerV1],
  providers: [
    GetFolders,
    CreateFolder,
    GetAuthSession,
    {
      provide: PORT.Folder,
      useClass: FolderRepository,
    },
    {
      provide: PORT.Session,
      useClass: SessionRepository,
    },
  ],
  exports: [],
})
export class FolderModule {}
