import { HttpStatus, UseGuards } from "@nestjs/common";
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Socket } from "socket.io";

import { EventGateway } from "src/application/enums";
import { CloseMarryJam, CreateMarryJam, JoinMarryJam, Marry, RollMarry } from "src/application/use-cases";

import { AuthenticatedGuard } from "../config";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
@UseGuards(AuthenticatedGuard)
export class MarryGateway {
  constructor(
    private readonly createMarryJamUseCase: CreateMarryJam,
    private readonly joinMarryJamUseCase: JoinMarryJam,
    private readonly rollMarryUseCase: RollMarry,
    private readonly marryUseCase: Marry,
    private readonly closeMarryJamUseCase: CloseMarryJam,
  ) {}

  @SubscribeMessage(EventGateway.CREATE_MARRY_JAM)
  async createMarryJam(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<any> {
    const userId = client["user"]?._id;

    await this.createMarryJamUseCase.exec(userId, data.body);

    return { message: "Marry Jam initialized", status: HttpStatus.OK };
  }

  @SubscribeMessage(EventGateway.JOIN_MARRY_JAM)
  async joinMarryJam(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<any> {
    const ourUserId = client["user"]?._id;
    const hostUserId = data?.body;

    await this.joinMarryJamUseCase.exec(ourUserId, hostUserId);

    return { message: "Joined marry jam", status: HttpStatus.ACCEPTED };
  }

  @SubscribeMessage(EventGateway.ROLL_MARRY)
  async rollMarry(@ConnectedSocket() client: Socket): Promise<any> {
    const ourUserId = client["user"]?._id;

    const character = await this.rollMarryUseCase.exec(ourUserId);

    return { message: "Roll thrown successfully", info: { character }, status: HttpStatus.OK };
  }

  @SubscribeMessage(EventGateway.MARRY)
  async marry(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<any> {
    const ourUserId = client["user"]?._id;

    const character = await this.marryUseCase.exec(ourUserId, data.body);

    return { message: "Marry successful", info: { character }, status: HttpStatus.OK };
  }

  @SubscribeMessage(EventGateway.CLOSE_MARRY_JAM)
  async closeMarryJam(@ConnectedSocket() client: Socket): Promise<any> {
    const ourUserId = client["user"]?._id;

    await this.closeMarryJamUseCase.exec(ourUserId);

    return { message: "Marry jam closed", status: HttpStatus.OK };
  }
}
