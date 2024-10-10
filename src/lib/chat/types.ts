import { z } from "zod";

export const HanyuxinjieSchema = z.object({
  word: z.string().describe('汉语词汇'),
  wordPinyin: z.string().describe('汉语词汇的拼音'),
  explanation: z.string().describe('解释'),
})
export type HanyuxinjieStreamObject = Partial<z.infer<typeof HanyuxinjieSchema>>;


export const UltimateClapbackInputSchema = z.object({
  background: z.string().max(1024).describe("背景").optional(),
  badGuyRole: z.string().max(1024).describe('对方身份').optional(),
  badGuySpeechContent: z.string().min(1).max(1024).describe('对方说话内容'),
})
export type UltraClapbackInput = z.infer<typeof UltimateClapbackInputSchema>;
export const UltimateClapbackOutputSchema = z.object({
  badGuy: z.string().describe('合理拼接background badGuyRole badGuySpeechContent，不要修改原话，例如：酒局上领导说，这杯酒不喝就是不给我面子'),
  clapback: z.string().describe('还嘴！例如：领导，您的面子哪能用酒来衡量呢？我敬您做人的境界。'),
})
export type UltraClapbackStreamObject = Partial<z.infer<typeof UltimateClapbackOutputSchema>>;
