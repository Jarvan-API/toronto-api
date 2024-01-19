import { Injectable, Logger } from "@nestjs/common";


@Injectable()
export class UserSignIn {
  private readonly logger = new Logger(UserSignIn.name);

  constructor(
  ) {
  }

  async exec(sessionID: string): Promise<any> {
    return { sessionID };
  }
}
