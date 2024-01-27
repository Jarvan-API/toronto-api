import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, HttpStatus, Logger, Param, Post, Request, Response, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import { FileInterceptor } from "@nestjs/platform-express";

import { AuthenticatedGuard } from "src/infrastructure/config";
import { DefaultApiResponse, InitializeFileDTO, UploadChunkDTO } from "src/application/dtos";
import { DownloadFile, GetFile, InitializeFile, UploadChunk } from "src/application/use-cases";
import { FileInitialized, FilePresentation } from "src/application/presentations";
import { IFile } from "src/domain/entities";

@Controller({
  path: "file",
  version: "1",
})
@ApiTags("File")
@UseGuards(ThrottlerGuard)
export class FileControllerV1 {
  private readonly logger = new Logger(FileControllerV1.name);

  constructor(
    private readonly initializeFileUseCase: InitializeFile,
    private readonly uploadChunkUseCase: UploadChunk,
    private readonly downloadFileUseCase: DownloadFile,
    private readonly getFileUseCase: GetFile,
  ) {}

  @Post(":folderId/initialize")
  async initializeUpload(@Param("folderId") folderId: string, @Body() body: InitializeFileDTO, @Request() req): Promise<FileInitialized> {
    const userId = "65ab1358b682f2ddda892c13";

    const file = await this.initializeFileUseCase.exec(body, folderId, userId);
    return { message: "File initialized successfully", data: { name: file.metadata?.originalName, id: file._id.toString() }, status: HttpStatus.OK };
  }

  @Post(":folderId/:fileId/upload-chunk")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async uploadChunk(
    @Param("fileId") fileId: string,
    @Param("folderId") folderId: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<DefaultApiResponse> {
    const userId = "65ab1358b682f2ddda892c13";
    console.log(body);
    await this.uploadChunkUseCase.exec(body, file, fileId, folderId, userId);

    return { message: "Chunk uploaded successfully", status: HttpStatus.OK };
  }

  @Get(":fileId/download")
  async downloadFile(@Param("fileId") fileId: string, @Request() req, @Response() res): Promise<any> {
    const userId = "65ab1358b682f2ddda892c13";
    await this.downloadFileUseCase.exec(fileId, userId, res);
  }

  @Get(":fileId")
  async getFile(@Param("fileId") fileId: string, @Request() req): Promise<FilePresentation> {
    const userId: string = req.user._doc._id;

    const file = await this.getFileUseCase.exec(fileId, userId);

    return {
      message: "File found successfully",
      file: {
        metadata: file.metadata,
        status: file.status,
      },
      status: HttpStatus.FOUND,
    };
  }
}
