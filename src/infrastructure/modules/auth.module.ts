import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";

import { PORT } from "src/application/enums";
import { SignUp } from "src/application/use-cases";
import { User, UserSchema } from "src/domain/entities";

import { AuthControllerV1 } from "../controllers";
import { BcryptService } from "../config";
import { UserRepository } from "../repositories";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const expirationTime: string = config.get<string>("JWT_EXPIRATION_TIME");
        const expirationFormat: string = config.get<string>("JWT_EXPIRATION_FORMAT");
        const expiresIn: string = `${expirationTime}${expirationFormat}`;

        return {
          secret: config.get<string>("JWT_SECRET"),
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthControllerV1],
  providers: [
    SignUp,
    ConfigService,
    BcryptService,
    {
      provide: PORT.User,
      useClass: UserRepository,
    },
  ],
  exports: [],
})
export class AuthModule {}
