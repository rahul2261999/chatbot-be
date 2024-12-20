import { VectorStoreRetriever } from "@langchain/core/vectorstores"
import mongoVectorDb from "../vector_db/mongo-vector-db"
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb"
import { RunnableSequence, RunnableWithMessageHistory } from "@langchain/core/runnables";
import DocumentLoader from "../../helper/document-loader";
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import chatMistralAIModel from "../ai_models/mistral";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { AIMessage } from "@langchain/core/messages";

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
      console.info("Executing askQuestion");

      this.sessionHistory.addMessages([
        new AIMessage("Psoriasis is a chronic autoimmune condition that causes skin cells to multiply up to 10 times faster than normal, leading to thick, scaly patches.")
      ])

      // Retrieve context from documents
      const documentRetrivalChain = RunnableSequence.from([
        (input) => input.question,
        this.retriver,
        DocumentLoader.convertDocsToString,
      ]);

      const CHAT_COMPLETION_TEMPLATE = `
      You are an intelligent assistant. Answer the question as accurately as possible using the provided context and chat history in 30 words. 
      If the context and history does not provide enough information, say "The context does not provide enough information to answer this question."
      Context:
      {context}

      `;

      // Create prompt template for generating answers
      const answerGenerationPrompt = ChatPromptTemplate.fromMessages([
        ["system", CHAT_COMPLETION_TEMPLATE],
        new MessagesPlaceholder("history"),
        ["human", "{question}"]
      ]);

      // Chain for answering questions
      const answerCompletionChain = RunnableSequence.from([
        {
          question: (input) => input.question,
          context: documentRetrivalChain,
          history: (input) => input.history || [],
        },
        answerGenerationPrompt,
        chatMistralAIModel,
        new StringOutputParser(),
      ]);

      // Chat runnable with history management
      const runnableWithChatHistory = new RunnableWithMessageHistory({
        runnable: answerCompletionChain,
        getMessageHistory: () => this.sessionHistory,
        historyMessagesKey: 'history',
        inputMessagesKey: 'question',
      });

      // Invoke the chain
      const answer = await runnableWithChatHistory.invoke(
        { question },
        {
          configurable: { sessionId: "123" },
        }
      );

      console.info("Execution complete: askQuestion");
      return answer;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

export default Rag.getInstance();