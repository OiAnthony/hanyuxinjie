import { z } from "zod";

export const ObjectSchema = z.object({
  word: z.string().describe('汉语词汇'),
  wordPinyin: z.string().describe('汉语词汇的拼音'),
  explanation: z.string().describe('解释'),
})
export type StreamObject = Partial<z.infer<typeof ObjectSchema>>;
