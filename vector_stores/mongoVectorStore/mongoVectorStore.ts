import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import mistralEmbeddings from "../../embeddings/mistral_embeddings";
import { BaseVectorStore, BaseGetRetriver } from "../base.interface";
import { collection } from "../../database/mongo-client";

class MongoVectorStore implements BaseVectorStore {

  public static instance: MongoVectorStore;

  private vectorStore: MongoDBAtlasVectorSearch;

  private constructor() {
    this.vectorStore = new MongoDBAtlasVectorSearch(
      mistralEmbeddings,
      {
        collection,
        indexName: 'mistral',
        embeddingKey: 'embedding',
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

  public getRetriver(params?: BaseGetRetriver) {
    const kfileds: number | undefined = params?.k || undefined;
    const filter = params?.filter || {};
    
    return this.vectorStore.asRetriever(kfileds, filter)
  }
}

export default MongoVectorStore.getInstance();