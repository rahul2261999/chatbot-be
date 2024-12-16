import { Document, DocumentInterface } from "@langchain/core/documents";
import { RedisAddOptions } from "@langchain/redis";
import { IVectorDatabase } from "./redis-vector-db.type";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import embeddings from "../ai_models/mistral_embeddings";
import constant from "../../constants/constant";
import MongoDbClient from "../../helper/mongo-client";
import mongoClient from "../../helper/mongo-client";

class MongoVectorDb {

  public static instance: MongoVectorDb;

  private vectorStore: MongoDBAtlasVectorSearch;

  private constructor() {
    this.vectorStore = new MongoDBAtlasVectorSearch(
      embeddings,
      {
        collection: mongoClient.getCollection(constant.mongo.collection),
      }
    );
  }

  public static getInstance(): MongoVectorDb {
    if (!MongoVectorDb.instance) {
      MongoVectorDb.instance = new MongoVectorDb();
    }
    return MongoVectorDb.instance;
  }

  public async addDocuments(params: Document[]) {
    try {
      console.info("executing -> addDocuments");

      await this.vectorStore.addDocuments(params);

      console.info("exection complete -> addDocuments")
    } catch (error) {
      console.error(error);

      throw new Error("Something went wrong when adding documents");
    }
  }

  public getRetriver() {
    return this.vectorStore.asRetriever()
  }
}

export default MongoVectorDb.getInstance();