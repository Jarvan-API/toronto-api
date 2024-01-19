import { Module } from "@nestjs/common";
import { CassandraService } from "./cassandra.service";

@Module({
  imports: [],
  providers: [CassandraService],
  exports: [CassandraService],
})
export class CassandraModule {}
