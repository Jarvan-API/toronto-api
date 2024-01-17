import helmet from "helmet";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";

import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./infrastructure/utils";
import { morganConfig, swaggerConfig } from "./infrastructure/tools";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const httpAdapter = app.get(HttpAdapterHost);

  const NODE_PORT = configService.get("NODE_PORT");
  const NODE_ENV = configService.get("NODE_ENV");

  app.use(helmet());

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      validationError: {
        target: false,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI });

  if (NODE_ENV !== "test") {
    app.use(morganConfig.successHandler);
    app.use(morganConfig.errorHandler);
  }

  swaggerConfig(app);

  await app.listen(NODE_PORT, () => Logger.log(`HTTP Service is listening on port ${NODE_PORT}`, "App"));
}
bootstrap();
