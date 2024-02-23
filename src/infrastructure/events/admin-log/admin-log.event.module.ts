import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SaveAdminLog } from "src/application/use-cases";
import { AdminLogEventListener } from "./admin-log.event";
import { Entity, PORT } from "src/application/enums";
import { AdminLogRepository } from "src/infrastructure/repositories";
import { AdminLogSchema } from "src/domain/entities";

@Module({
  imports: [MongooseModule.forFeature([{ name: Entity.AdminLog, schema: AdminLogSchema }])],
  providers: [SaveAdminLog, AdminLogEventListener, { provide: PORT.AdminLog, useClass: AdminLogRepository }],
})
export class AdminLogEventModule {}
