import { ThrottlerGuard } from "@nestjs/throttler";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";

import { CreateFolderDTO, DefaultApiResponse, DeleteFolderDTO, ExceptionDTO, PaginationQuery, SearchFolderDTO, UpdateFolderDTO } from "src/application/dtos";
import { FolderCreated, FolderDetails, IUserFolderSearch, PaginatedList, UserFoldersSearch } from "src/application/presentations";
import { AuthenticatedGuard } from "src/infrastructure/config";
import { CreateFolder, DeleteFolder, GetFolder, MoveFiles, SearchFolders, UpdateFolder } from "src/application/use-cases";
import { GenericSwagger } from "src/infrastructure/decorators/swagger.decorator";

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
  @GenericSwagger({ summary: "Creates folder", body: CreateFolderDTO })
  @ApiOkResponse({
    description: "Folder created",
    type: FolderCreated,
  })
  async createFolder(@Body() data: CreateFolderDTO, @Request() req): Promise<FolderCreated> {
    const userId = req.user._doc._id;

    const folder = await this.createFolderUseCase.exec(data, userId);

    return { message: "New folder created", data: { id: folder._id, name: folder.name }, status: HttpStatus.CREATED };
  }

  @Get("/search")
  @HttpCode(HttpStatus.OK)
  @GenericSwagger({ summary: "Gets all folder from user", body: SearchFolderDTO })
  @ApiOkResponse({
    description: "Ok request",
    type: PaginatedList<IUserFolderSearch>,
  })
  async searchFolders(@Body() body: SearchFolderDTO, @Query("page") page: number, @Query("count") size: number, @Request() req): Promise<PaginatedList<IUserFolderSearch>> {
    const ourUserId = req.user._doc._id;

    const list = await this.searchFoldersUseCase.exec(body, { page, size }, ourUserId);

    return { message: "Folder list retrieved successfully", info: list, status: HttpStatus.OK };
  }

  @Get("details/:folderId")
  @HttpCode(HttpStatus.OK)
  @GenericSwagger({ summary: "Gets all folder from user", apiParam: "folderId" })
  @ApiOkResponse({
    description: "Ok request",
    type: FolderDetails,
  })
  async getFolder(@Param("folderId") folderId: string, @Request() req): Promise<FolderDetails> {
    const ourUserId = req.user._doc._id;

    const folder = await this.getFolderUseCase.exec(folderId, ourUserId);

    return { message: "Folder details retrieved successfully", folder, status: HttpStatus.OK };
  }

  @Patch("/:folderId")
  @HttpCode(HttpStatus.OK)
  @GenericSwagger({ summary: "Updates a folder data", apiParam: "folderId", body: UpdateFolderDTO })
  async updateFolder(@Param("folderId") folderId: string, @Request() req, @Body() data: UpdateFolderDTO): Promise<DefaultApiResponse> {
    const ourUserId = req.user._doc._id;

    await this.updateFolderUseCase.exec(data, folderId, ourUserId);

    return { message: "Folder updated successfully", status: HttpStatus.OK };
  }

  @Delete("/:folderId")
  @HttpCode(HttpStatus.OK)
  @GenericSwagger({ summary: "Removes a folder", apiParam: "folderId", body: DeleteFolderDTO })
  async deleteFolder(@Param("folderId") folderId: string, @Request() req, @Body() data: DeleteFolderDTO): Promise<DefaultApiResponse> {
    const ourUserId = req.user._doc._id;

    if (Boolean(data.folder)) await this.moveFilesToFolderUseCase.exec({ folder_id: data.folder }, folderId, ourUserId);

    await this.deleteFolderUseCase.exec(folderId, ourUserId);

    return { message: "Folder deleted successfully", status: HttpStatus.OK };
  }
}
