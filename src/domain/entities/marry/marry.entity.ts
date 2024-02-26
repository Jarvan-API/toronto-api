import { Types } from "mongoose";

export interface IMarryJam {
  host: string;
  spectators: string[];
  createdAt: Date;
  rolls: number;
  exclude: string[];
  pool: string[];
  reason: string;
}
