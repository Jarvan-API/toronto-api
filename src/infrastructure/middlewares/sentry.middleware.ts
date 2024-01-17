import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

import { SentryService } from "src/infrastructure/config";

@Injectable()
export class SentryMiddleware implements NestMiddleware {
  constructor(private readonly sentryService: SentryService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
      if (res.statusCode >= 500) {
        const error = new Error(`HTTP ${res.statusCode}: ${req.method} ${req.url}`);
        this.sentryService.captureException(error);
      }
    });

    next();
  }
}
