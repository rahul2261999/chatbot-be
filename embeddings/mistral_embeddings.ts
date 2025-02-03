import { MistralAIEmbeddings } from "@langchain/mistralai";
import constant from "../constants/constant";

const mistralEmbeddings = new MistralAIEmbeddings({
  apiKey: constant.llmModel.apiKey
});

export default mistralEmbeddings;