import { MongoClient } from "mongodb";
import constant from "../constants/constant";

const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
const collection = client
  .db(constant.mongodb.db)
  .collection(constant.mongodb.embeddingCollection);

export { client, collection }