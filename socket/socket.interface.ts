import { Socket } from "socket.io";

export enum SocketEmitEvent {
  'AI_AGENT_MESSAGE' = 'AI_AGENT_MESSAGE',
  'USER_JOINED' = 'USER_JOINED',
  'USER_LEFT' = 'USER_LEFT',
}

export enum SocketRecieverEvent {
  'JOIN_ROOM' = 'JOIN_ROOM',
  'LEAVE_ROOM' = 'LEAVE_ROOM',
  'USER_MESSAGE' = 'USER_MESSAGE',
}

export interface SocketConfiguration {
  userId: string,
}

export interface ISocket extends Socket {
  configuration: SocketConfiguration
}

export interface UserMessageSent {
  message: string
}