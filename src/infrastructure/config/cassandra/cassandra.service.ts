import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "cassandra-driver";

@Injectable()
export class CassandraService {
  private client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      contactPoints: [configService.get("CASSANDRA_URI")],
      localDataCenter: configService.get("CASSANDRA_DC"),
      keyspace: configService.get("CASSANDRA_KEYSPACE"),
    });

    this.client.connect(err => {
      if (err) {
        console.error("Error connecting to Cassandra", err);
      }
    });
  }

  async execute(query: string, params: any[] = [], options: object = { prepare: true }): Promise<any> {
    try {
      return await this.client.execute(query, params, options);
    } catch (err) {
      console.error("Error executing query", err);
      throw err;
    }
  }
}
