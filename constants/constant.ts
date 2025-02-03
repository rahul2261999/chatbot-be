
import { config } from "dotenv";
config();

export default Object.freeze({
  app: {
    port: Number(process.env.PORT) || 5008
  },
  llmModel: {
    name: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
  },
  redis: {
    url: process.env.REDIS_URL
  },
  mongodb: {
    uri: process.env.MONGODB_ATLAS_URI || '',
    db: process.env.MONGODB_ATLAS_DB_NAME || '',
    embeddingCollection: process.env.MONGODB_ATLAS_COLLECTION_NAME || ''
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
  },
  statusCodes: {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
    UNAUTHORIZED: 501,
    FORBIDDEN: 403
  }
})