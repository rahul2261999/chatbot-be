import { RunnableSequence } from '@langchain/core/runnables'
import { PromptTemplate } from '@langchain/core/prompts'
import mistral from '../../llm/mistral';
import { ChatMistralAI } from '@langchain/mistralai';
import { JsonOutputParser, StringOutputParser } from '@langchain/core/output_parsers';
import loggerService from '../../utils/logger/logger.service';
import { CustomRunnableChain } from '../runnables/custom-runnables-chain';
import InternalServer from '../../utils/error/internal_server.error';
import { ChatResponse } from '../base.type';
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

      const documentRetrivalChain = CustomRunnableChain.vectorRetrivalChain();
  
      const answerPromtTemplate = PromptTemplate.fromTemplate(`
        Given the context below, answer the question strictly based on the provided information. Ensure the response is well-structured and does not include any external knowledge. If the context does not contain sufficient information, respond with a brief message such as: 'I'm unable to find the answer based on the given information. Could you please clarify your question?'

        Question: "{question}"
        Context: {context}
        ### **Response Format:**
        [
        {{ "type": "h1", "text": "Main Title" }},
        {{ "type": "paragraph", "text": "This is a paragraph with details." }},
        {{ "type": "ordered", "listItem": ["First item", "Second item"] }},
        {{ "type": "unordered", "listItem": ["Bullet point 1", "Bullet point 2"] }},
        {{ "type": "hyperlink", "url": "https://example.com", "aliasText": "Click here" }}
        ]

        ### **Instructions:**
        - **Return only JSON**, no extra text or explanations.
        - Headings must be one of **h1, h2, h3, h4, h5, h6**.
        - Use **"type": "paragraph"** for text content.
        - Use **"type": "ordered"** or **"type": "unordered"** for lists.
        - Use **"type": "hyperlink"** for links, formatted as:  
        **"type": "hyperlink", "url": "...", "aliasText": "..."**.
      
      `)

      const jsonParser = new JsonOutputParser<ChatResponse>()

      const answerGeneartionChain = RunnableSequence.from([
        documentRetrivalChain,
        ({ context }) => { return { question: message, context } },
        answerPromtTemplate,
        this.llmClient,
        jsonParser,
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