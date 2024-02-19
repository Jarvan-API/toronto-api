import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Entity } from "src/application/enums";
import { CharacterSchema } from "src/domain/entities";

import { MarryControllerV1 } from "../controllers/v1/marry.controller";

@Module({
  imports: [MongooseModule.forFeature([{ name: Entity.Character, schema: CharacterSchema }])],
  controllers: [MarryControllerV1],
  providers: [],
  exports: [],
})
export class CharacterModule {}
