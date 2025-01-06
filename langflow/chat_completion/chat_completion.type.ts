export interface LangflowSession {
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
  list: IList[]
}

export interface IChatCompletionResponse {
  sessionInfo: LangflowSession;
  message: ChatCompletionMessage[]
}