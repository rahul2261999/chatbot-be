import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf'
import {DocxLoader} from '@langchain/community/document_loaders/fs/docx'

import { Document } from '@langchain/core/documents';
class DocumentLoader {
  public static async loadPdfDocument(filePath: string) {
    try {
      console.info("executing -> loadPdfDocument")

      const loader = new PDFLoader(filePath);
      const docs = await loader.load();

      console.info("exection complete -> loadPdfDocument");

      return docs;
    } catch (error) {
      console.error(error);

      throw new Error("Failed to load PDF document");
    }
  }

  public static async loadDocxDocument(filePath: string) {
    try {
      console.info("executing -> loadDocxDocument")

      const loader = new DocxLoader(filePath);
      const data = await loader.load();

      console.info("exection complete -> loadDocxDocument");

      return data;
    } catch (error) {
      console.error(error);
      console.error("Execution failed -> loadDocxDocument");

      throw new Error("Some");
    }
  }

  public static convertDocsToString (documents: Document[]): string {
    return documents.map((document) => {
      return `<doc>\n${document.pageContent}\n</doc>`
    }).join("\n");
  };
}

export default DocumentLoader;