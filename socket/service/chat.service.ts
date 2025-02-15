import chat_completionService from "../../langflow/chat_completion/chat_completion.service";
import { UserMessage } from "./chat.type";
import { ISocket, SocketEmitEvent } from "../socket.interface";

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

  public async userMessage({userId, message}: UserMessage, socket: ISocket) {
    try {
      console.log("executing userMessage", userId);

      const answer = await chat_completionService.main(message);
      console.log(JSON.stringify(answer))

      socket.join(userId)
      socket.emit(SocketEmitEvent.AI_MESSAGE_SENT, answer);

      console.log("executed userMessage", userId);
    } catch (error) {
      console.log("Failes to execute userMessage");
      console.log(error);
      socket.join(userId)
      socket.emit(SocketEmitEvent.AI_MESSAGE_SENT, {errorMessage: (error as any).message});
    }
  }

  public async sendMessage(userId: string, roomId: string, message: string): Promise<void> {
    // Send message to socket.io room
  }
}

export default Chat.getInstance();