import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { IBaseFileProcessor } from "../index.type";
import { Document } from "@langchain/core/documents";
import { IBaseTextSplitter } from "../../text_splitters/index.type";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import AbstractFileProcessor from "../index.processor";

class DocxProcessor extends AbstractFileProcessor {
  private docxLoader: DocxLoader;

  constructor(filePathOrBlob: string | Blob ) {
    super();
    this.docxLoader = new DocxLoader(filePathOrBlob);
  }

  public async load(): Promise<Document[]> {
    try {
      const data = await this.docxLoader.load();
      this.setLoadedDocuments(data);

      return data;
    } catch (error) {

      throw error;
    }
  }
}