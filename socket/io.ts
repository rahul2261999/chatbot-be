import { Server, Socket } from "socket.io";
import SocketClient from "./SocketClient";
import { NextFunction } from "express";
import { ISocket } from "./socket.interface";
import constant from "../constants/constant";

class Io {
  private static instance: Io;
  private io: Server;

  private constructor(httpServer: any) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });
    this.bindEvent();
    this.initializeMiddlewares();
  }

  public static init(server: any) {
    if (!Io.instance) {
      Io.instance = new Io(server);
    }

    return Io.instance;
  }

  public static getInstance(): Io {
    if (!Io.instance) {
      throw new Error("no instance")
    }
    return Io.instance;
  }


  private bindEvent() {
    this.io.on("connection", (socket) => {
      console.log("socket connected");

      SocketClient.bindSocket(socket as ISocket);
    });
  }

  private initializeMiddlewares() {
    try {
      // this.io.use(socketLogger);
      // @ts-ignore
      this.io.use(this.authorizationMiddleware);
    } catch (error) {

      throw error;
    }
  }

  private async authorizationMiddleware(socket: ISocket, next: NextFunction) {
    try {

      const token = socket.handshake.auth['token']
        || socket.handshake.headers['token'];


      if (!token) {
        console.error('access token not found');
        throw new Error('access token not found');
      }


      if (token && token !== constant.socket.authKey) {
        console.error("unauthorized access token");

        throw new Error("unauthorized access token")
      }

      socket.configuration = {
        userId: token
      };

      next();
    } catch (error) {

      next(error);
    }

  }

  public emitInRoom(roomId: string, message: string) {
    this.io.to(roomId).emit(message)
  }
}

export default Io;