import constant from "../constants/constant";
import { ChatAnthropic } from "@langchain/anthropic";

class AnthropicLlm {
  private static instance: AnthropicLlm;
  private llmClient: ChatAnthropic

  private constructor() {
    this.llmClient = new ChatAnthropic({
      apiKey: constant.llmModel.apiKey,
      model: constant.llmModel.name,
      maxRetries: 3,
    })
  }

  public static getInstance(): AnthropicLlm {
    if (!AnthropicLlm.instance) {
      AnthropicLlm.instance = new AnthropicLlm();
    }
    return AnthropicLlm.instance;
  }

  public getClient(): ChatAnthropic {
    return this.llmClient;
  }
}

export default AnthropicLlm.getInstance();