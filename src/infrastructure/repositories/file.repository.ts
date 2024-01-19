import { Injectable, Logger } from "@nestjs/common";
import { IFile } from "src/domain/entities";
import { IFileRepository } from "src/domain/interfaces";
import { CassandraService } from "../config";

@Injectable()
export class FileRepository implements IFileRepository {
  private readonly logger = new Logger(FileRepository.name);

  constructor(private readonly cassandraService: CassandraService) {}

  async create(file: IFile): Promise<IFile> {
    const query = "INSERT INTO file (id, owner, folder, name, size, type, is_public, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const params = [];
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
}
