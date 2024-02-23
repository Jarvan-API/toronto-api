import { Inject, Injectable, Logger } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { IAdminLog } from "src/domain/entities";
import { IAdminLogRepository } from "src/domain/interfaces";

@Injectable()
export class SaveAdminLog {
  private readonly logger = new Logger(SaveAdminLog.name);

  constructor(@Inject(PORT.AdminLog) private readonly adminLogRepository: IAdminLogRepository) {}

  async exec(data: IAdminLog): Promise<IAdminLog> {
    return await this.adminLogRepository.create(data);
  }
}
