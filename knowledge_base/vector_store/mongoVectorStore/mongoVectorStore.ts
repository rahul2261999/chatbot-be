import { Document } from "@langchain/core/documents";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import mongoClient from "../../../helper/mongo-client";
import constant from "../../constant/constant";
import mistralEmbeddings from "../../embeddings/mistral_embeddings";
import { BaseVectorStore, BaseGetRetriver } from "../base.interface";

class MongoVectorStore implements BaseVectorStore {

  public static instance: MongoVectorStore;

  private vectorStore: MongoDBAtlasVectorSearch;

  private constructor() {
    this.vectorStore = new MongoDBAtlasVectorSearch(
      mistralEmbeddings,
      {
        collection: mongoClient.getCollection(constant.mongo.collection),
        indexName: 'mistral_embeddings',
        embeddingKey: 'mistral_embeddings',
        textKey: 'text'
      }
    );
  }
   
  public static getInstance(): MongoVectorStore {
    if (!MongoVectorStore.instance) {
      MongoVectorStore.instance = new MongoVectorStore();
    }
    return MongoVectorStore.instance;
  }

  public async addDocuments(params: Document[], docIds?: string[]) {
    try {
      console.info("executing -> addDocuments");

      await this.vectorStore.addDocuments(params, { ids: docIds });

      console.info("exection complete -> addDocuments")
    } catch (error) {
      console.error(error);

      throw new Error("Something went wrong when adding documents");
    }
  }
  public getRetriver(params?: BaseGetRetriver) {
    const kfileds: number | undefined = params?.k || undefined;
    const filter = params?.filter || {};
    
    return this.vectorStore.asRetriever(kfileds, filter)
  }
}

export default MongoVectorStore.getInstance();