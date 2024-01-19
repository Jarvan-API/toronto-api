import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";

import { Entity, PORT } from "src/application/enums";
import { GetAuthSession, UserSignIn, UserSignUp, VerifySignUp } from "src/application/use-cases";
import { SessionSchema, UserSchema } from "src/domain/entities";

import { AuthControllerV1 } from "../controllers";
import { BcryptService, LocalStrategy, SessionSerializer } from "../config";
import { SessionRepository, UserRepository } from "../repositories";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entity.User, schema: UserSchema }, { name: Entity.Session, schema: SessionSchema }]),
    PassportModule.register({session: true}),
  ],
  controllers: [AuthControllerV1],
  providers: [
    UserSignUp,
    UserSignIn,
    VerifySignUp,
    BcryptService,
    GetAuthSession,
    SessionSerializer,
    LocalStrategy,
    ConfigService,
    {
      provide: PORT.User,
      useClass: UserRepository,
    },
    {
      provide: PORT.Session,
      useClass: SessionRepository,
    }
  ],
  exports: [
  ],
})
export class AuthModule {}
