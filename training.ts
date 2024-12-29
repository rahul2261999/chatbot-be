import * as path from 'path';
import DocumentLoader from './knowledge_base/constant/document-loader';


export const trainnDocument = async () => {
 try {
  console.info("Starting training process");

  const filePath = path.resolve('training_data', 'Psoriasis.pdf');

  const document =  await DocumentLoader.loadPdfDocument(filePath);

  await mongoVectorDb.addDocuments([document]);

  console.info("Training process completed");
 } catch (error) {
  console.error(error);
 }
}