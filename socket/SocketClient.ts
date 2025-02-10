import { ISocket, SocketRecieverEvent, UserMessageSent } from "./socket.interface";
import chatService from "./service/chat/chat.service";
import loggerService from "../utils/logger/logger.service";

class SocketClient {
  public static instance: SocketClient;
  private socket: ISocket;
  private chatService: typeof chatService;

  constructor(socketInstance: ISocket) {
    this.socket = socketInstance;
    this.bindEvents();
    this.chatService = chatService
  }

  public static bindSocket(socket: ISocket) {
    SocketClient.instance = new SocketClient(socket);
  }

  private bindEvents() {
    this.socket.on(SocketRecieverEvent.JOIN_ROOM, () => {
      loggerService.debug(`User ${this.socket.configuration.userId} joined room`)
    })

    this.socket.on(SocketRecieverEvent.LEAVE_ROOM, () => {
      loggerService.debug(`User ${this.socket.configuration.userId} leave`)
    });

    this.socket.on(SocketRecieverEvent.USER_MESSAGE, async (data: UserMessageSent) => {
      try {
        await chatService.userMessage(
          {
            userId: '',
            message: data.message,
          },
          this.socket
        )
      } catch (error) {
        loggerService.error("Failed to send user message")
        loggerService.error(null, { error })
      }
    });
  }
}

export default SocketClient;