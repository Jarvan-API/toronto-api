import { Injectable, Logger } from "@nestjs/common";

import { IFile } from "src/domain/entities";
import { IFileRepository } from "src/domain/interfaces";

import { CassandraService } from "../config";

@Injectable()
export class FileRepository implements IFileRepository {
  private readonly logger = new Logger(FileRepository.name);

  constructor(private readonly cassandraService: CassandraService) {}

  async create(file: IFile): Promise<IFile> {
    const query = "INSERT INTO file (id, owner, folder, name, data, size, type, is_public, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const params = [file.id, file.owner, file.folder, file.name, file.data, file.size, file.type, file.is_public, file.created_at, file.updated_at];
    await this.cassandraService.execute(query, params, { prepare: true });
    return file;
  }

  async findAll(): Promise<IFile[]> {
    const query = "SELECT * FROM file";
    const result = await this.cassandraService.execute(query);
    return result.rows;
  }

  async findOne(id: string): Promise<IFile> {
    const query = "SELECT * FROM file WHERE id = ?";
    const result = await this.cassandraService.execute(query, [id], { prepare: true });
    return result.rows[0];
  }

  async delete(id: string): Promise<any> {
    const query = "DELETE FROM file WHERE id = ?";
    await this.cassandraService.execute(query, [id], { prepare: true });
  }

  async search(criteria: { name?: string; type?: string; owner?: string; folder?: string }): Promise<IFile[]> {
    let query = "SELECT id, owner, folder, name, size, type, is_public, created_at, updated_at FROM file";
    const params = [];
    const conditions = [];

    // Construct query based on criteria
    if (criteria.name) {
      conditions.push("name = ?");
      params.push(criteria.name);
    }

    if (criteria.type) {
      conditions.push("type = ?");
      params.push(criteria.type);
    }

    if (criteria.owner) {
      conditions.push("owner = ?");
      params.push(criteria.owner);
    }

    if (criteria.folder) {
      conditions.push("folder = ?");
      params.push(criteria.folder);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ALLOW FILTERING";

    const result = await this.cassandraService.execute(query, params, { prepare: true });
    return result.rows;
  }
}
