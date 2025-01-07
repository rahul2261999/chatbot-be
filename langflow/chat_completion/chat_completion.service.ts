import constant from "../../constants/constant";
import LangflowClient from "../langflow_client.service";
import { IChatCompletionResponse } from "./chat_completion.type";

class ChatCompletion {
  private static instance: ChatCompletion;

  private constructor() { };

  public static getInstance(): ChatCompletion {
    if (!ChatCompletion.instance) {
      ChatCompletion.instance = new ChatCompletion();
    }
    return ChatCompletion.instance;
  }

  public async main(inputValue: any, inputType = 'chat', outputType = 'chat', stream = false) {
    const flowIdOrName = constant.langflow.chat_completion.flowIdName;
    const langflowId = constant.langflow.chat_completion.langflowId;
    const applicationToken = constant.langflow.chat_completion.apiToken;

    const langflowClient = new LangflowClient(
      'https://api.langflow.astra.datastax.com',
      applicationToken);

    try {
      const tweaks = {
        "AstraDB-gz9DB": {},
        "AnthropicModel-QKwOB": {},
        "Prompt-rVgIU": {},
        "Prompt-igod1": {},
        "ChatOutput-1JD2t": {},
        "AnthropicModel-p4nMn": {},
        "ParseData-8Rdlr": {},
        "ChatInput-haVhG": {}
      };

      const response = await langflowClient.runFlow(
        flowIdOrName,
        langflowId,
        inputValue,
        inputType,
        outputType,
        tweaks,
        stream,
        (data) => console.log("Received:", data.chunk), // onUpdate
        (message) => console.log("Stream Closed:", message), // onClose
        (error) => console.log("Stream Error:", error) // onError
      );

      const flowOutputs = response.outputs[0];
      const firstComponentOutputs = flowOutputs.outputs[0];
      const output = firstComponentOutputs.outputs.message;

      let finalRes: IChatCompletionResponse;

      let parseMessage;

      try {
        parseMessage = JSON.parse(output.message.text);

        finalRes = {
          sessionInfo: {
            sessionId: response.session_id
          },
          message: parseMessage
        }
      } catch (error) {
        finalRes = {
          sessionInfo: {
            sessionId: response.session_id
          },
          message: [
            {
              heading: "Oops!",
              subheading: "",
              paragraph: "somethings went wrong",
              list: null
            }
          ]
        }
      }

      return finalRes;
    } catch (error) {
      console.error('Main Error', error);
    }
  }
}

export default ChatCompletion.getInstance();