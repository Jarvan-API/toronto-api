import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity, PORT } from "src/application/enums";
import { DownloadFile, GetAuthSession, SearchFiles, UploadFile } from "src/application/use-cases";
import { FolderSchema, SessionSchema } from "src/domain/entities";

import { FileRepository, FolderRepository, SessionRepository } from "../repositories";
import { FileControllerV1 } from "../controllers";
import { CassandraService } from "../config";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.Session, schema: SessionSchema },
      { name: Entity.Folder, schema: FolderSchema },
    ]),
  ],
  controllers: [FileControllerV1],
  providers: [
    SearchFiles,
    UploadFile,
    DownloadFile,
    CassandraService,
    GetAuthSession,
    {
      provide: PORT.File,
      useClass: FileRepository,
    },
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
export class FileModule {}
