import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf'
import { Document } from '@langchain/core/documents';
class DocumentLoader {
  public static async loadPdfDocument(filePath: string) {
    try {
      console.info("executing -> loadPdfDocument")

      const loader = new PDFLoader(filePath);
      const docs = await loader.load();

      console.info("exection complete -> loadPdfDocument");

      return docs[0];
    } catch (error) {
      console.error(error);

      throw new Error("Failed to load PDF document");
    }
  }

  public static convertDocsToString (documents: Document[]): string {
    return documents.map((document) => {
      return `<doc>\n${document.pageContent}\n</doc>`
    }).join("\n");
  };
}

export default DocumentLoader;