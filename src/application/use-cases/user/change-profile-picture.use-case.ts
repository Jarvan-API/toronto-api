import path from "path";

import { Types } from "mongoose";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PORT } from "src/application/enums";
import { UserNotFound } from "src/application/exceptions";
import { IStorageRepository, IUserRepository } from "src/domain/interfaces";
import { IUserPictureMetadata } from "src/domain/entities";
import { IStorageUploadOptions } from "src/application/types";

@Injectable()
export class ChangeProfilePicture {
  private readonly logger = new Logger(ChangeProfilePicture.name);
  private readonly storageBasePath: string;
  private readonly storageDefaultPicturePath: string;
  private readonly storageUserPath: string;

  constructor(
    @Inject(PORT.User) private readonly userRepository: IUserRepository,
    @Inject(PORT.Storage) private readonly storageRepository: IStorageRepository,
    private readonly configService: ConfigService,
  ) {
    this.storageBasePath = this.configService.get<string>("STORAGE_BASE_PATH");
    this.storageDefaultPicturePath = this.configService.get<string>("STORAGE_DEFAULT_USER_PICTURE_PATH");
    this.storageUserPath = this.configService.get<string>("STORAGE_USER_BASE_PATH");
  }

  async exec(file: Express.Multer.File, userId: string): Promise<IUserPictureMetadata> {
    const user = await this.userRepository.findOne({ query: { _id: new Types.ObjectId(userId) } });

    if (!Boolean(user)) throw new UserNotFound();

    const desiredPath = path.join(this.storageBasePath, this.storageUserPath, user._id.toString(), "profile-picture");
    const options: IStorageUploadOptions = {
      forceName: "image",
    };
    const finalPath = await this.storageRepository.upload(file, desiredPath, options);

    const picture: IUserPictureMetadata = {
      originalName: file.filename,
      totalSize: file.size,
      path: finalPath,
    };

    await this.userRepository.update(userId, { pictureMetadata: picture });
    return picture;
  }
}
