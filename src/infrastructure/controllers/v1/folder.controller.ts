import { ThrottlerGuard } from "@nestjs/throttler";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";

import { CreateFolderDTO, DefaultApiResponse, ExceptionDTO, UpdateFolderDTO } from "src/application/dtos";
import { FolderCreated, UserFoldersSearch } from "src/application/presentations";
import { CreateFolder, SearchFolders, UpdateFolder } from "src/application/use-cases/folder";
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
  @ApiParam({
    name: "userId",
    description: "Folder owner ID",
    type: String,
  })
  @ApiOkResponse({
    description: "Ok request",
    type: UserFoldersSearch,
  })
  @ApiBadRequestResponse({
    description: "Bad request",
    type: ExceptionDTO,
  })
  async searchFolders(@Param("userId") userId: string, @Request() req): Promise<UserFoldersSearch> {
    const ourUserId = req.user._doc._id;

    const folders = await this.searchFoldersUseCase.exec(userId, ourUserId);

    return { message: "Folder list retrieved successfully", folders, status: HttpStatus.OK };
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
