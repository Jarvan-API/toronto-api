import { HttpAdapterHost, ModuleRef } from "@nestjs/core";
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException, Injectable } from "@nestjs/common";

import { GenericHttpException } from "src/application/exceptions";
import { FlagService } from "src/application/services/flag/flag.service";

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  private flagService: FlagService;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private moduleRef: ModuleRef,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const isGenericHttpException = exception instanceof GenericHttpException;
    const genericHttpException = isGenericHttpException ? exception.getBody() : {};

    const statusCode = isGenericHttpException ? exception?.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const httpExceptionBody = {
      statusCode,
      message: exception["response"]?.message || exception?.["response"] || exception.message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    this.flagService = this.moduleRef.get(FlagService, { strict: false });
    if (this.flagService) this.flagService.trigger(exception).catch(error => "Error sending message to Slack");

    httpAdapter.reply(ctx.getResponse(), { ...genericHttpException, ...httpExceptionBody }, statusCode);
  }
}
