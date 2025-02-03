import { VectorStoreRetriever } from "@langchain/core/vectorstores"

export interface BaseGetRetriver {
  k?: number;
  prefilter?: {
    tenantId?: string;
    documentId?: string;
  };
}

export interface BaseVectorStore {
  getRetriver(params?: BaseGetRetriver): VectorStoreRetriever;
}