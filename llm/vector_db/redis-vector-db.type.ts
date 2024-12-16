import { Document, DocumentInterface } from "@langchain/core/documents";
import { RedisAddOptions } from "@langchain/redis";

export interface IVectorDatabase {
  addDocuments(params: Document[], options: RedisAddOptions): void,
  searchDocuments(query: string): Promise<DocumentInterface<Record<string, any>>[]>,
}