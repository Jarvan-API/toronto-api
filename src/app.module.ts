import { ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";

import { AppController } from "./infrastructure/controllers";
import { BcryptModule, MongoDBModule, RedisModule, SentryModule } from "./infrastructure/config";
import { AuthModule, HaremModule, FileModule, FolderModule, UserModule } from "./infrastructure/modules";
import { SentryMiddleware } from "./infrastructure/middlewares";
import { NotificationModule } from "./infrastructure/modules/notifications.module";

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
    EventEmitterModule.forRoot(),
    MongoDBModule,
    RedisModule,
    BcryptModule,
    AuthModule,
    FolderModule,
    FileModule,
    UserModule,
    HaremModule,
    SentryModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SentryMiddleware).forRoutes("*");
  }
}
