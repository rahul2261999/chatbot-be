import * as path from 'path';
import DocumentLoader from './helper/document-loader';
import redisVectorDb from './llm/vector_db/redis-vector-db';
import mongoVectorDb from './llm/vector_db/mongo-vector-db';


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