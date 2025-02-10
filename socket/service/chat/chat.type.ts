import { ChatResponse } from "../../../langchain_engine/base.type";

export interface UserMessage {
  message: string,
  userId: string,
}

export interface IAgentMessagePayload {
  conversationId: string;
  chatResponse: ChatResponse
};