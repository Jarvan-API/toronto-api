import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";

import { Entity, PORT } from "src/application/enums";
import { FileChunkSchema, FileSchema, FolderSchema, SessionSchema } from "src/domain/entities";
import { DownloadFile, GetAuthSession, InitializeFile, UploadChunk } from "src/application/use-cases";

import { FileChunkRepository, FileRepository, FolderRepository, SessionRepository, StorageRepository } from "../repositories";
import { FileControllerV1 } from "../controllers";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.Session, schema: SessionSchema },
      { name: Entity.Folder, schema: FolderSchema },
      { name: Entity.File, schema: FileSchema },
      { name: Entity.FileChunk, schema: FileChunkSchema },
    ]),
  ],
  controllers: [FileControllerV1],
  providers: [
    InitializeFile,
    UploadChunk,
    DownloadFile,
    ConfigService,
    GetAuthSession,
    {
      provide: PORT.File,
      useClass: FileRepository,
    },
    {
      provide: PORT.FileChunk,
      useClass: FileChunkRepository,
    },
    {
      provide: PORT.Folder,
      useClass: FolderRepository,
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
export class FileModule {}
