import { z } from "zod";

const headingValidation = z.object({
  type: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).describe("Heading type (h1 to h6)"),
  text: z.string().describe("content of the heading"),
})

const paragraphValidation = z.object({
  type: z.literal('paragraph'),
  text: z.string().describe("content of the paragraph. Not more then 3 lines"),
})

const orderedListValidation = z.object({
  type: z.enum(['ordered']),
  listItem: z.array(z.string()).length(5).describe("content of the ordered list, not more than 5 points"),
})

const unorderedListValidation = z.object({
  type: z.enum(['unordered']),
  listItem: z.array(z.string()).length(5).describe("content of the unordered list, not more than 5 points"),
})

const hyperlinkValidation = z.object({
  type: z.enum(['hyperlink']).describe("valid url address"),
  url: z.string(),
  aliasText: z.string().optional().describe("Informative label which can serve as alias for long url on which user can click"),
})

const chatResponseValidation = z.array(
  z.union([headingValidation, paragraphValidation, orderedListValidation, unorderedListValidation, hyperlinkValidation])
)

export { chatResponseValidation };