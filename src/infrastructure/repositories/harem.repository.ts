import { ClientSession, FilterQuery, Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

import { Repository } from "./repository";
import { Entity } from "src/application/enums";
import { Harem, IHarem, IHaremHistory } from "src/domain/entities";
import { IHaremRepository } from "src/domain/interfaces";

@Injectable()
export class HaremRepository extends Repository<IHarem> implements IHaremRepository {
  constructor(@InjectModel(Entity.Harem) private readonly haremModel: Model<Harem>) {
    super(haremModel);
  }
  override async findOne(filter: FilterQuery<IHarem>, populate?: string): Promise<IHarem> {
    const query = this.haremModel.findOne(filter);
    if (Boolean(populate)) query.populate(populate);

    return await query.exec();
  }

  async updateKakera(_id: Types.ObjectId, amount: number, history: IHaremHistory): Promise<number> {
    let session: ClientSession;
    let balance: number;
    try {
      session = await this.haremModel.startSession();

      session.startTransaction();

      const harem = await this.findOne({ _id });
      harem.kakera += amount;
      balance = harem.kakera;

      harem.history.push(history);
      await this.haremModel.updateOne({ _id }, harem);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
      return balance;
    }
  }
}
