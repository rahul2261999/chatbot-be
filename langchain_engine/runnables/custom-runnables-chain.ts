import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import mongoVectorStore from "../../vector_stores/mongoVectorStore/mongoVectorStore";
import { Document } from "@langchain/core/documents";
import loggerService from "../../utils/logger/logger.service";
import { ILoggerData } from "../../utils/logger/logger.type";
import InternalServer from "../../utils/error/internal_server.error";
import { BaseGetRetriver } from "../../vector_stores/base.interface";

class CustomRunnableChain {
  public static vectorRetrivalChain(filter?: BaseGetRetriver) {
    const retriveDocument = new RunnableLambda({
      func: async (question: string) => {
        const loggerData: ILoggerData = {
          serviceName: 'CustomRunnableChain',
          function: 'vectorRetrivalChain',
        }
        try {
          loggerService.info({ ...loggerData, message: 'executing' });

          const retriver = mongoVectorStore.getRetriver(filter)

          const documents = await retriver.invoke(question)

          loggerService.info({ ...loggerData, message: 'execution complete' });
          return { documents };
        } catch (error) {
          loggerService.error({ ...loggerData, message: 'error executing' }, { error: error as Error });

          throw new InternalServer('Something went wrong');
        }
      }
    });

    const vectorRetrivalRunnableChain = RunnableSequence.from([
      retriveDocument,
      (input: { documents: Document[] }) => input.documents.map(document => document.pageContent).join('\n'),
      (input: string) => { return { context: input } }
    ])

    return vectorRetrivalRunnableChain
  }
}

export { CustomRunnableChain };