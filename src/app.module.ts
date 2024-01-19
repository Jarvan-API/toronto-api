import { ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { AppController } from "./infrastructure/controllers";
import { BcryptModule, CassandraModule, MongoDBModule, SentryModule } from "./infrastructure/config";
import { AuthModule, ChatModule, UserModule } from "./infrastructure/modules";
import { SentryMiddleware } from "./infrastructure/middlewares";
import { FolderModule } from "./infrastructure/modules/folder.module";

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
    CassandraModule,
    BcryptModule,
    FolderModule,
    AuthModule,
    ChatModule,
    UserModule,
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
