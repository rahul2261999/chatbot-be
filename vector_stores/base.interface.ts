import { VectorStoreRetriever } from "@langchain/core/vectorstores"

export interface BaseGetRetriver {
  k?: number,
  filter?: Record<string, string> | object;
}

export interface BaseVectorStore {
  getRetriver(params?: BaseGetRetriver): VectorStoreRetriever;
}