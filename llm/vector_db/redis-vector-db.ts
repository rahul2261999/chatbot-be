import { RedisAddOptions, RedisVectorStore } from "@langchain/redis";
import redisClient from "../../helper/redis-client";
import embeddings from "../ai_models/mistral_embeddings";
import { IVectorDatabase } from "./redis-vector-db.type";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { Document, DocumentInterface } from "@langchain/core/documents";

class RedisVectorDb implements IVectorDatabase {
  public static instance: RedisVectorDb;
  
  private vectorStore: RedisVectorStore;
  private retriver: VectorStoreRetriever

  private constructor() {
    this.vectorStore = new RedisVectorStore(
      embeddings,
      {
        redisClient: redisClient.getClient(),
        indexName: 'langchain-vector-store'
      }
    )

    this.retriver = this.vectorStore.asRetriever()
  }

  public static getInstance(): RedisVectorDb {
    if (!RedisVectorDb.instance) {
      RedisVectorDb.instance = new RedisVectorDb();
    }

    
    return RedisVectorDb.instance;
  }

  public async addDocuments(params: Document[], options: RedisAddOptions  = {}) {
    try {
      console.info("executing -> addDocuments");

      await this.vectorStore.addDocuments(params, options);

      console.info("exection complete -> addDocuments")
    } catch (error) {
      console.error(error);
      
      throw new Error("Something went wrong when adding documents");
    }
  }

  public async searchDocuments(query: string): Promise<DocumentInterface<Record<string, any>>[]> {
    try {
      console.info("executing -> searchDocuments");

      const data = await this.retriver.invoke(query);

      console.info("exection complete -> searchDocuments");
      
      return data;
    } catch (error) {

      throw new Error("Something went wrong when searching");
    }
  }
}

export default RedisVectorDb.getInstance();

