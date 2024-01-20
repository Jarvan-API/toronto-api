import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { GetAuthSession } from "src/application/use-cases";
import { FolderSchema, SessionSchema } from "src/domain/entities";
import { CreateFolder, GetFolder, SearchFolders, UpdateFolder } from "src/application/use-cases/folder";

import { FolderRepository, SessionRepository } from "../repositories";
import { FolderControllerV1 } from "../controllers/v1/folder.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.Folder, schema: FolderSchema },
      { name: Entity.Session, schema: SessionSchema },
    ]),
  ],
  controllers: [FolderControllerV1],
  providers: [
    SearchFolders,
    CreateFolder,
    UpdateFolder,
    GetFolder,
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
