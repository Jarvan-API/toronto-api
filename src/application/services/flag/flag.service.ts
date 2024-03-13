import { Global, Inject, Injectable } from "@nestjs/common";

import { PORT } from "src/application/enums";
import { ISlackRepository } from "src/domain/interfaces";

@Global()
@Injectable()
export class FlagService {
  private marks = [];
  private options: IFlagCreationParams;

  constructor(@Inject(PORT.Slack) private readonly slackRepository: ISlackRepository) {
    this.options = { name: "Flagged" };
  }

  mark(step: string = "unnamed", options?: IFlagCreationParams) {
    if (Boolean(options)) this.options = options;
    this.marks.push(step);
  }

  async trigger(error: Error) {
    let message = `:rotating_light: ${this.options.name} process has encountered an error. :rotating_light:`;

    if (this.marks.length > 0) {
      message += `\nSteps taken: ${this.marks.join(" -> ")}
      Error at step ${this.marks.length}: ${this.marks[this.marks.length - 1]}
      Error Message: ${error.message}`;
    }

    console.log(message);
    await this.slackRepository.notify(message);
  }
}

export interface IFlagCreationParams {
  name: string;
}
