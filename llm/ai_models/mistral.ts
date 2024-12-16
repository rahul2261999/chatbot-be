import { ChatMistralAI } from "@langchain/mistralai";
import { config } from "dotenv";

config();

const chatMistralAIModel = new ChatMistralAI({
  model: "open-mistral-nemo",
});

export default chatMistralAIModel;
