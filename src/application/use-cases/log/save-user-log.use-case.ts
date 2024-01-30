import { Inject, Injectable, Logger } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { IUserLog } from "src/domain/entities";
import { IUserLogRepository } from "src/domain/interfaces";

@Injectable()
export class SaveUserLog {
  private readonly logger = new Logger(SaveUserLog.name);

  constructor(@Inject(PORT.UserLog) private readonly userLogRepository: IUserLogRepository) {}

  async exec(data: IUserLog): Promise<IUserLog> {
    return await this.userLogRepository.create(data);
  }
}
