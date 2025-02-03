
import { config } from "dotenv";
config();

export default Object.freeze({
  app: {
    port: Number(process.env.PORT) || 5009
  },
  llmModel: {
    mistral: {
      modelName: "mistral-small-latest",
      apiKey: process.env.MISTRAL_API_KEY
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      modelName: "Anthropic-7B"
    }
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
  statusCodes: {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
    UNAUTHORIZED: 501,
    FORBIDDEN: 403
  }
})