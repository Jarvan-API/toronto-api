import { Body, Controller, HttpStatus, Logger, Post, Request, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ThrottlerGuard } from "@nestjs/throttler";

import { DefaultApiResponse, NotificationDTO } from "src/application/dtos";
import { Events } from "src/application/enums";
import { AuthenticatedAdminGuard } from "src/infrastructure/config";

@Controller({
  path: "notifications",
  version: "1",
})
@UseGuards(ThrottlerGuard)
export class NotificationControllerV1 {
  private readonly logger = new Logger(NotificationControllerV1.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Post("/publish")
  @UseGuards(AuthenticatedAdminGuard)
  async publishNotification(@Body() body: NotificationDTO, @Request() req): Promise<DefaultApiResponse> {
    const userId = req.user._doc._id;

    this.eventEmitter.emit(Events.PUBLISH_NOTIFICATIONS, { ...body, emitter: userId });

    return { message: "Notification published successfully", status: HttpStatus.CREATED };
  }
}
