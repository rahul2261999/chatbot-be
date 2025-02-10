import { IAgentMessagePayload, UserMessage } from "./chat.type";
import { ISocket, SocketEmitEvent } from "../../socket.interface";
import conversationService from "../../../langchain_engine/conversations/conversation.service";
import loggerService from "../../../utils/logger/logger.service";

class Chat {
  private static instance: Chat;

  private constructor() {
  }

  public static getInstance(): Chat {
    if (!Chat.instance) {
      Chat.instance = new Chat();
    }

    return Chat.instance;
  }

  public async userMessage(data: UserMessage, socket: ISocket) {
    try {
      loggerService.info("executing userMessage");

      const answer = await conversationService.answer(data.message);

      loggerService.debug(JSON.stringify(answer));

      const res: IAgentMessagePayload = {
        conversationId: '',
        chatResponse: answer,
      }
      socket.emit(SocketEmitEvent.AI_AGENT_MESSAGE, res);

      loggerService.info("executed userMessage");
    } catch (error) {
      loggerService.error("Failes to execute userMessage");
      loggerService.error(null, { error });

      throw new Error("something went wrong");
    }
  }

  public async sendMessage(userId: string, roomId: string, message: string): Promise<void> {
    // Send message to socket.io room
  }
}

export default Chat.getInstance();