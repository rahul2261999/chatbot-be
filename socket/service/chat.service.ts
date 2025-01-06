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

  public async userMessage(data: UserMessage, socket: ISocket) {
    try {
      console.log("executing userMessage");
      const answer = await chat_completionService.main(data.message);
      console.log(JSON.stringify(answer))
      socket.emit(SocketEmitEvent.AI_MESSAGE_SENT, answer);

      console.log("executed userMessage");
    } catch (error) {
      console.log("Failes to execute userMessage");
      console.log(error);

      throw new Error("something went wrong");
    }
  }

  public async sendMessage(userId: string, roomId: string, message: string): Promise<void> {
    // Send message to socket.io room
  }
}

export default Chat.getInstance();