import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { IUser } from "src/domain/entities";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: IUser, done: (err: Error, user: any) => void): any {
    const store = {
      ...user, 
      password: undefined
    };
    done(null, store);
  }

  deserializeUser(payload: any, done: (err: Error, payload: string) => void): any {
    done(null, payload);
  }
}
