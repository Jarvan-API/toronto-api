import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";
import { CreateFolderDTO, DefaultApiResponse, ExceptionDTO } from "src/application/dtos";
import { FolderCreated, UserFoldersSearch } from "src/application/presentations";
import { CreateFolder, GetFolders } from "src/application/use-cases/folder";
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
    private readonly getFoldersUseCase: GetFolders,
    private readonly createFolderUseCase: CreateFolder,
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

    return { message: "New user created", info: { id: folder._id, name: folder.name }, status: HttpStatus.CREATED };
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
  async getFoldersFromUser(@Param("userId") userId: string): Promise<UserFoldersSearch> {
    const folders = await this.getFoldersUseCase.exec(userId);

    return { message: "Folder list retrieved successfully", folders, status: HttpStatus.OK };
  }
}
