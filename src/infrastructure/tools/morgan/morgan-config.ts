import * as morgan from "morgan";
import { Logger } from "@nestjs/common";
import { Request, Response } from "express";

morgan.token("message", (_req: Request, res: Response) => res.locals["errorMessage"] || "");

const successResponseFormat = `:status | :method | :url | :response-time ms`;
const errorResponseFormat = `:status | :method | :url | :response-time ms | :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400 || req.url.includes("swagger") || req.url.includes("api-docs") || req.url.includes("health"),
  stream: { write: (message: string) => Logger.log(message.trim(), "API") },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (_req: Request, res: Response) => res.statusCode < 400,
  stream: { write: (message: string) => Logger.error(message.trim(), "API") },
});

export const morganConfig = {
  successHandler,
  errorHandler,
};
