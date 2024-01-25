import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, HttpStatus, Logger, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import { FileInterceptor } from "@nestjs/platform-express";

import { AuthenticatedGuard } from "src/infrastructure/config";
import { DefaultApiResponse, InitializeFileDTO, UploadChunkDTO } from "src/application/dtos";
import { InitializeFile, UploadChunk } from "src/application/use-cases";
import { FileInitialized } from "src/application/presentations";

@Controller({
  path: "file",
  version: "1",
})
@ApiTags("File")
@UseGuards(ThrottlerGuard, AuthenticatedGuard)
export class FileControllerV1 {
  private readonly logger = new Logger(FileControllerV1.name);

  constructor(
    private readonly initializeFileUseCase: InitializeFile,
    private readonly uploadChunkUseCase: UploadChunk,
  ) {}

  @Post(":folderId/initialize")
  async initializeUpload(@Param("folderId") folderId: string, @Body() body: InitializeFileDTO, @Request() req): Promise<FileInitialized> {
    const userId = req.user._doc._id;

    const file = await this.initializeFileUseCase.exec(body, folderId, userId);
    return { message: "File initialized successfully", data: { name: file.metadata?.originalName, id: file._id.toString() }, status: HttpStatus.OK };
  }

  @Post(":folderId/:fileId/upload-chunk")
  @UseInterceptors(FileInterceptor("file"))
  async uploadChunk(@Param("fileId") fileId: string, @Param("folderId") folderId: string, @UploadedFile() file: Express.Multer.File, @Request() req): Promise<DefaultApiResponse> {
    const userId = req.user._doc._id;
    await this.uploadChunkUseCase.exec({ totalChunks: 1, chunkNumber: 1 }, file, fileId, folderId, userId);

    return { message: "Chunk uploaded successfully", status: HttpStatus.OK };
  }
}
