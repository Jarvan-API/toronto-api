import { Body, Controller, HttpStatus, Logger, Post, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ThrottlerGuard } from "@nestjs/throttler";

import { DefaultApiResponse, NotificationDTO } from "src/application/dtos";
import { Events } from "src/application/enums";

@Controller({
  path: "notifications",
  version: "1",
})
@UseGuards(ThrottlerGuard)
export class NotificationControllerV1 {
  private readonly logger = new Logger(NotificationControllerV1.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Post("/publish")
  async publishNotification(@Body() body: NotificationDTO): Promise<DefaultApiResponse> {
    console.log(body);
    this.eventEmitter.emit(Events.PUBLISH_NOTIFICATIONS, body);

    return { message: "Notification published successfully", status: HttpStatus.CREATED };
  }
}
