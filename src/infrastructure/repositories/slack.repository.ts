import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Global, Injectable, Logger } from "@nestjs/common";
import { catchError, lastValueFrom, map } from "rxjs";

import { ISlackRepository } from "src/domain/interfaces";

@Global()
@Injectable()
export class SlackRepository implements ISlackRepository {
  private readonly logger: Logger = new Logger(SlackRepository.name);
  private slackUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpClient: HttpService,
  ) {
    this.slackUrl = this.configService.get<string>("SLACK_URL");
  }

  async notify(text: string): Promise<any> {
    const url: string = `${this.slackUrl}`;

    const body = {
      text,
    };

    return await lastValueFrom(
      this.httpClient.post<any>(url, body).pipe(
        map(res => res.data),
        catchError(error => {
          throw error;
        }),
      ),
    );
  }
}
