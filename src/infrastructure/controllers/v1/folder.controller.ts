import { ThrottlerGuard } from "@nestjs/throttler";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";

import { CreateFolderDTO, DefaultApiResponse, ExceptionDTO, SearchFolderDTO, UpdateFolderDTO } from "src/application/dtos";
import { FolderCreated, FolderDetails, UserFoldersSearch } from "src/application/presentations";
import { CreateFolder, GetFolder, SearchFolders, UpdateFolder } from "src/application/use-cases/folder";
import { AuthenticatedGuard } from "src/infrastructure/config";

@Controller({
  path: "folder",
  version: "1",
})
@ApiTags("Folder")
@UseGuards(ThrottlerGuard, AuthenticatedGuard)
export class FolderControllerV1 {
  private readonly logger = new Logger(FolderControllerV1.name);

  constructor(
    private readonly searchFoldersUseCase: SearchFolders,
    private readonly getFolderUseCase: GetFolder,
    private readonly createFolderUseCase: CreateFolder,
    private readonly updateFolderUseCase: UpdateFolder,
  ) {}

  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Creates folder" })
  @ApiBody({
    type: CreateFolderDTO,
  })
  @ApiOkResponse({
    description: "Folder created",
    type: FolderCreated,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async createFolder(@Body() data: CreateFolderDTO, @Request() req): Promise<FolderCreated> {
    const userId = req.user._doc._id;

    const folder = await this.createFolderUseCase.exec(data, userId);

    return { message: "New folder created", info: { id: folder._id, name: folder.name }, status: HttpStatus.CREATED };
  }

  @Get("/:userId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Gets all folder from user" })
  @ApiBody({
    description: "Search filter",
    type: SearchFolderDTO,
  })
  @ApiOkResponse({
    description: "Ok request",
    type: UserFoldersSearch,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async searchFolders(@Body() body: SearchFolderDTO, @Request() req): Promise<UserFoldersSearch> {
    const ourUserId = req.user._doc._id;

    const folders = await this.searchFoldersUseCase.exec(body, ourUserId);

    return { message: "Folder list retrieved successfully", folders, status: HttpStatus.OK };
  }

  @Get("details/:folderId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Gets all folder from user" })
  @ApiParam({
    name: "folderId",
    description: "Folder ID",
    type: String,
  })
  @ApiOkResponse({
    description: "Ok request",
    type: FolderDetails,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async getFolder(@Param("folderId") folderId: string, @Request() req): Promise<FolderDetails> {
    const ourUserId = req.user._doc._id;

    const folder = await this.getFolderUseCase.exec(folderId, ourUserId);

    return { message: "Folder details retrieved successfully", folder, status: HttpStatus.OK };
  }

  @Patch("/:folderId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Updates a folder data" })
  @ApiParam({
    name: "folderId",
    description: "Folder ID",
    type: String,
  })
  @ApiBody({
    description: "Folder's new data",
    type: UpdateFolderDTO,
  })
  @ApiOkResponse({
    description: "Ok request",
    type: DefaultApiResponse,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async updateFolder(@Param("folderId") folderId: string, @Request() req, @Body() data: UpdateFolderDTO): Promise<DefaultApiResponse> {
    const ourUserId = req.user._doc._id;

    await this.updateFolderUseCase.exec(data, folderId, ourUserId);

    return { message: "Folder updated successfully", status: HttpStatus.OK };
  }
}
