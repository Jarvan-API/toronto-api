import { FilterQuery, Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

import { Repository } from "./repository";
import { Entity } from "src/application/enums";
import { Harem, IHarem } from "src/domain/entities";
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
}
