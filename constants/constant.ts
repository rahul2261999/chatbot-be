
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
  },
  langflow: {
    chat_completion: {
      flowIdName: '09950fc4-bc0e-466d-87d4-ac982d87d63d',
      langflowId: '1ba113b1-39fb-4abf-9791-3e8d22e89265',
      apiToken: process.env.LANGFLOW_API_TOKEN || '',
    }
  }
})