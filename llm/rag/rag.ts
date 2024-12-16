import { VectorStoreRetriever } from "@langchain/core/vectorstores"
import mongoVectorDb from "../vector_db/mongo-vector-db"
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb"
import { RunnableSequence, RunnableWithMessageHistory } from "@langchain/core/runnables";
import DocumentLoader from "../../helper/document-loader";
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import chatMistralAIModel from "../ai_models/mistral";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";

class Rag {
  private static instance: Rag;

  private retriver: VectorStoreRetriever<MongoDBAtlasVectorSearch>;
  private sessionHistory: InMemoryChatMessageHistory;

  private constructor() {
    this.retriver = mongoVectorDb.getRetriver();
    this.sessionHistory = new InMemoryChatMessageHistory()
  }

  public static getInstance(): Rag {
    if (!Rag.instance) {
      Rag.instance = new Rag();
    }

    return Rag.instance;
  }

  public async askQuestion(question: string): Promise<string> {
    try {
      console.info("executing askQuestion")

      const documentRetrivalChain = RunnableSequence.from([
        (input) => input.question,
        this.retriver,
        DocumentLoader.convertDocsToString
      ]);

      const CHAT_COMPLETION_TEMPLATE = `
      You are an intelligent assistant. Answer the question as accurately as possible using the provided context and chat history in 30 words. 
      If the context does not provide enough information, say "The context does not provide enough information to answer this question."
      Context:
      {context}

      Question:
      {question}

      Answer:
    `

      const answerGenerationPrompt = ChatPromptTemplate.fromMessages([
        ["system", CHAT_COMPLETION_TEMPLATE],
        new MessagesPlaceholder("history"),
      ]);

      // answerGenerationPrompt.formatMessages({

      // })

      const answerCompletionChain = RunnableSequence.from([
        {
          question: (input: any) => {
            return input.question
          },
          context: documentRetrivalChain,
          history: (input: any) => input.history || [],
        },
        answerGenerationPrompt,
        chatMistralAIModel,
        new StringOutputParser()
      ]);


      const runnableWithChatHistory = new RunnableWithMessageHistory({
        runnable: answerCompletionChain,
        getMessageHistory: (_sessionId) => this.sessionHistory,
        historyMessagesKey: 'history',
        inputMessagesKey: 'question',
      })

      const answer = await runnableWithChatHistory.invoke(
        { question },
        {
          configurable: { sessionId: "123" }
        }
      );

      console.info("exection complete askQuestion")
      return answer;
    } catch (error) {
      console.log(error);
      console.log("error while executing askQuestion");

      throw error
    }
  }
}

export default Rag.getInstance();