import { MistralAIEmbeddings } from "@langchain/mistralai";
import constant from "../../constants/constant";

const embeddings = new MistralAIEmbeddings({
  apiKey: constant.model.apiKey
});

export default embeddings;