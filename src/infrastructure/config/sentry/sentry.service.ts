import * as Sentry from "@sentry/node";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { SeverityLevel } from "src/application/enums";

@Injectable()
export class SentryService {
  constructor(private readonly configService: ConfigService) {
    this.initializeSentry();
  }

  private initializeSentry(): void {
    const dsn = this.configService.get<string>("SENTRY_DSN");

    if (dsn) {
      Sentry.init({
        dsn,
      });
    }
  }

  captureException(error: Error): void {
    Sentry.captureException(error);
  }

  captureMessage(message: string, extra: {}, level: SeverityLevel): void {
    Sentry.captureMessage(message, {
      level,
      extra,
    });
  }
}
