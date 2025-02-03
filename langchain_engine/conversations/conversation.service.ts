import { RunnableSequence } from '@langchain/core/runnables'
import { PromptTemplate } from '@langchain/core/prompts'
import mistral from '../../llm/mistral';
import { ChatMistralAI } from '@langchain/mistralai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import loggerService from '../../utils/logger/logger.service';
import { CustomRunnableChain } from '../runnables/custom-runnables-chain';
import InternalServer from '../../utils/error/internal_server.error';
class Conversation {
  private static instance: Conversation;
  private llmClient: ChatMistralAI;

  constructor() {
    this.llmClient = mistral.getClient();
  }

  public static getInstance(): Conversation {
    if (!Conversation.instance) {
      Conversation.instance = new Conversation();
    }

    return Conversation.instance;
  }

  public async answer(message: string) {
    const loggerData = {
      serviceName: 'Conversation',
      function: 'answer',
    }
    try {
      loggerService.info({ ...loggerData, message: 'executing' });

      const retrivalPrompt = PromptTemplate.fromTemplate(`
      You are an expert in optimizing queries for retrieval systems.  
      Enhance the given question to improve search results from a Vector Store.  
      Make it precise, detailed, and semantically rich. return only the enhanced question and do not change the context of question
      and not add any additional info.
      
      Question: "{question}"
      `);
        
      const enhanceQuestionChain = RunnableSequence.from([
        retrivalPrompt,
        this.llmClient,
        new StringOutputParser()
      ]);

      const enhancedQuestion = await enhanceQuestionChain.invoke({ question: message })

      loggerService.debug({ ...loggerData, message: `enhancedQuestion: ${enhancedQuestion}` });

      const documentRetrivalChain = CustomRunnableChain.vectorRetrivalChain({
        prefilter: {
          tenantId: 'tenant-2',
        }
      });

      const answerPromtTemplate = PromptTemplate.fromTemplate(`
        You are an expert AI assistant with deep knowledge. Your task is to answer the following question using the provided context. Ensure your response is accurate, concise, and directly relevant to the query. If the context lacks sufficient details, provide a well-reasoned response based on best practices or general knowledge while clearly stating any assumptions. Avoid speculation or fabricated information."
        question: {question}
        context: {context}

        return only the anser, do not add any additional information.
      `)

      const answerGeneartionChain = RunnableSequence.from([
        documentRetrivalChain,
        ({ context }) => { return { question: message, context } },
        answerPromtTemplate,
        this.llmClient,
        new StringOutputParser()
      ])

      const answer = await answerGeneartionChain.invoke(enhancedQuestion);

      return answer;
    } catch (error) {
      loggerService.error({ ...loggerData, message: 'error executing' }, { error: error as Error });

      throw InternalServer.fromError(error);
    }
  }
}

export default Conversation.getInstance();