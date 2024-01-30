import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { CreateFolder, DeleteFolder, GetAuthSession, GetFolder, MoveFiles, SaveUserLog, SearchFolders, UpdateFolder } from "src/application/use-cases";
import { FileChunkSchema, FileSchema, FolderSchema, SessionSchema, UserLogScheme } from "src/domain/entities";
import { EncryptionService } from "src/application/services";

import { FileChunkRepository, FileRepository, FolderRepository, SessionRepository, StorageRepository, UserLogRepository } from "../repositories";
import { FolderControllerV1 } from "../controllers";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.Folder, schema: FolderSchema },
      { name: Entity.File, schema: FileSchema },
      { name: Entity.FileChunk, schema: FileChunkSchema },
      { name: Entity.Session, schema: SessionSchema },
      { name: Entity.UserLog, schema: UserLogScheme },
    ]),
  ],
  controllers: [FolderControllerV1],
  providers: [
    SearchFolders,
    CreateFolder,
    UpdateFolder,
    GetFolder,
    DeleteFolder,
    MoveFiles,
    GetAuthSession,
    EncryptionService,
    SaveUserLog,
    {
      provide: PORT.UserLog,
      useClass: UserLogRepository,
    },
    {
      provide: PORT.Folder,
      useClass: FolderRepository,
    },
    {
      provide: PORT.File,
      useClass: FileRepository,
    },
    {
      provide: PORT.FileChunk,
      useClass: FileChunkRepository,
    },
    {
      provide: PORT.Storage,
      useClass: StorageRepository,
    },
    {
      provide: PORT.Session,
      useClass: SessionRepository,
    },
  ],
  exports: [],
})
export class FolderModule {}
