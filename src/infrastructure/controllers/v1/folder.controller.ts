import { ThrottlerGuard } from "@nestjs/throttler";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";

import { CreateFolderDTO, DefaultApiResponse, DeleteFolderDTO, ExceptionDTO, PaginationQuery, SearchFolderDTO, UpdateFolderDTO } from "src/application/dtos";
import { FolderCreated, FolderDetails, IUserFolderSearch, PaginatedList, UserFoldersSearch } from "src/application/presentations";
import { AuthenticatedGuard } from "src/infrastructure/config";
import { CreateFolder, DeleteFolder, GetFolder, MoveFiles, SearchFolders, UpdateFolder } from "src/application/use-cases";

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
    private readonly deleteFolderUseCase: DeleteFolder,
    private readonly moveFilesToFolderUseCase: MoveFiles,
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

    return { message: "New folder created", data: { id: folder._id, name: folder.name }, status: HttpStatus.CREATED };
  }

  @Get("/search")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Gets all folder from user" })
  @ApiBody({
    description: "Search filter",
    type: SearchFolderDTO,
  })
  @ApiOkResponse({
    description: "Ok request",
    type: PaginatedList<IUserFolderSearch>,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async searchFolders(@Body() body: SearchFolderDTO, @Query("page") page: number, @Query("count") size: number, @Request() req): Promise<PaginatedList<IUserFolderSearch>> {
    const ourUserId = req.user._doc._id;

    const list = await this.searchFoldersUseCase.exec(body, { page, size }, ourUserId);

    return { message: "Folder list retrieved successfully", info: list, status: HttpStatus.OK };
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

  @Delete("/:folderId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Removes a folder" })
  @ApiParam({
    name: "folderId",
    description: "Folder ID",
    type: String,
  })
  @ApiBody({
    description: "Folder's new data",
    type: DeleteFolderDTO,
  })
  @ApiOkResponse({
    description: "Ok request",
    type: DefaultApiResponse,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async deleteFolder(@Param("folderId") folderId: string, @Request() req, @Body() data: DeleteFolderDTO): Promise<DefaultApiResponse> {
    const ourUserId = req.user._doc._id;

    if (Boolean(data.folder)) await this.moveFilesToFolderUseCase.exec({ folder_id: data.folder }, folderId, ourUserId);

    await this.deleteFolderUseCase.exec(folderId, ourUserId);

    return { message: "Folder deleted successfully", status: HttpStatus.OK };
  }
}
