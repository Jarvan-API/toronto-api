import { ThrottlerGuard } from "@nestjs/throttler";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post, Request, Response, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { DefaultApiResponse, ExceptionDTO, SearchFileDTO, UploadFileDTO } from "src/application/dtos";
import { FileUploaded, FilesList } from "src/application/presentations";
import { AuthenticatedGuard } from "src/infrastructure/config";
import { DownloadFile, SearchFiles, UploadFile } from "src/application/use-cases";
import { IFile } from "src/domain/entities";

@Controller({
  path: "file",
  version: "1",
})
@ApiTags("File")
@UseGuards(ThrottlerGuard, AuthenticatedGuard)
export class FileControllerV1 {
  private readonly logger = new Logger(FileControllerV1.name);

  constructor(
    private readonly uploadFileUseCase: UploadFile,
    private readonly searchFilesUseCase: SearchFiles,
    private readonly downloadFileUseCase: DownloadFile,
  ) {}

  @Post(":folderId/upload")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Uploads a file to a folder" })
  @ApiBody({
    type: UploadFileDTO,
  })
  @ApiParam({
    name: "folderId",
    type: String,
  })
  @ApiOkResponse({
    description: "File added",
    type: FileUploaded,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() data: Express.Multer.File, @Body() params: UploadFileDTO, @Param("folderId") folderId: string, @Request() req): Promise<FileUploaded> {
    const userId = req.user._doc._id;

    const file = await this.uploadFileUseCase.exec(data, params, folderId, userId);

    return { message: "New file added", info: { id: file.id }, status: HttpStatus.CREATED };
  }

  @Get(":folderId")
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({ summary: "Searchs file from folder" })
  @ApiBody({
    type: SearchFileDTO,
  })
  @ApiParam({
    name: "folderId",
    type: String,
  })
  @ApiOkResponse({
    description: "File added",
    type: FilesList,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async searchFiles(@Body() data: SearchFileDTO, @Param("folderId") folderId: string, @Request() req): Promise<FilesList> {
    const userId = req.user._doc._id;

    const results: IFile[] = await this.searchFilesUseCase.exec(data, folderId, userId);

    return { message: "File search successfully", results, count: results.length, status: HttpStatus.FOUND };
  }

  @Get(":folderId/:fileId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Downloads file from folder" })
  @ApiParam({
    name: "folderId",
    type: String,
  })
  @ApiParam({
    name: "fileId",
    type: String,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async downloadFile(@Param("fileId") fileId: string, @Param("folderId") folderId: string, @Request() req, @Response() res): Promise<void> {
    const userId = req.user._doc._id;

    const file = await this.downloadFileUseCase.exec(fileId, folderId, userId);
    console.log(file);
    res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
    res.setHeader("Content-Type", file.type);

    res.send(file.data);
  }
}
