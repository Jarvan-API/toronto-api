import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule, MongooseModuleFactoryOptions } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<MongooseModuleFactoryOptions> => {
        const dbName: string = configService.get<string>("MONGODB_NAME");
        const uri: string = configService.get<string>("MONGODB_URI");

        return {
          uri: `${uri}`,
          dbName,
        };
      },
    }),
  ],
})
export class MongoDBModule {}
