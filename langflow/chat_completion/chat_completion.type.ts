export interface SessionInfo {
  sessionId: string;
}

export enum ListType {
  ordered = "ordered",
  unordered = "unordered"
}

export interface IList {
  type: ListType;
  heading: string;
  children: string[];
}
export interface ChatCompletionMessage {
  heading: string;
  subheading: string;
  paragraph: string;
  list: IList | null;
}

export interface IChatCompletionResponse {
  sessionInfo: SessionInfo;
  message: ChatCompletionMessage[]
}