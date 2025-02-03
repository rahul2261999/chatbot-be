import { MistralAIEmbeddings } from "@langchain/mistralai";
import constant from "../constants/constant";

const mistralEmbeddings = new MistralAIEmbeddings({
  apiKey: constant.llmModel.mistral.apiKey
});

export default mistralEmbeddings;