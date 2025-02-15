import { ISocket, SocketEmitEvent, SocketRecieverEvent, UserMessageSent } from "./socket.interface";
import chatService from "./service/chat.service";

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
      const userId = this.socket.configuration.userId
      this.socket.join(userId)
      console.log(`User ${userId} joined room`)

      this.socket.emit(SocketEmitEvent.USER_JOINED, `User with id ${userId} joined`)
    })

    this.socket.on(SocketRecieverEvent.LEAVE_ROOM, () => {
      console.log(`User ${this.socket.configuration.userId} leave`)
    });

    this.socket.on(SocketRecieverEvent.USER_MESSAGE_SENT, async (data: UserMessageSent) => {
      console.log("User message sent")
      chatService.userMessage(
        {
          userId: this.socket.configuration.userId,
          message: data.message,
        },
        this.socket
      )
    });
  }
}

export default SocketClient;