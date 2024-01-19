import { ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { AppController } from "./infrastructure/controllers";
import { BcryptModule, MongoDBModule, SentryModule } from "./infrastructure/config";
import { AuthModule } from "./infrastructure/modules";
import { SentryMiddleware } from "./infrastructure/middlewares";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get("RATE_LIMIT_TTL"),
          limit: config.get("RATE_LIMIT_COUT"),
        },
      ],
    }),
    MongoDBModule,
    BcryptModule,
    AuthModule,
    SentryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SentryMiddleware).forRoutes("*");
  }
}
