
import { config } from "dotenv";
config();

export default Object.freeze({
  app: {
    port: Number(process.env.PORT) || 5008
  },
  model: {
    name: "open-mistral-nemo",
    apiKey: process.env.MISTRAL_API_KEY
  },
  redis: {
    url: process.env.REDIS_URL
  },
  mongo: {
    uri: process.env.MONGODB_ATLAS_URI || '',
    db: process.env.MONGODB_ATLAS_DB_NAME || '',
    collection: process.env.MONGODB_ATLAS_COLLECTION_NAME || ''
  },
  socket: {
    authKey: process.env.SOCKET_AUTHORIZATION_KEY
  }
})