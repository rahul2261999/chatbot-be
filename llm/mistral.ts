import { ChatMistralAI } from "@langchain/mistralai";
import constant from "../constants/constant";

class MistralLlm {
  private static instance: MistralLlm;
  private llmClient: ChatMistralAI

  private constructor() {
    this.llmClient = new ChatMistralAI({
      apiKey: constant.llmModel.mistral.apiKey,
      model: constant.llmModel.mistral.modelName,
      maxRetries: 3,
    })
  }

  public static getInstance(): MistralLlm {
    if (!MistralLlm.instance) {
      MistralLlm.instance = new MistralLlm();
    }
    return MistralLlm.instance;
  }

  public getClient(): ChatMistralAI {
    return this.llmClient;
  }
}

export default MistralLlm.getInstance();