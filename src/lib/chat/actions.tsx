'use server';

import { createOpenAI } from '@ai-sdk/openai';
import {
  streamObject,
  experimental_wrapLanguageModel as wrapLanguageModel,
  type CoreMessage,
  type Experimental_LanguageModelV1Middleware as LanguageModelV1Middleware,
  type LanguageModelV1StreamPart,
} from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { env } from '~/env';
import { ObjectSchema, type StreamObject } from './types';

function getModel() {
  const openai = createOpenAI({
    baseURL: env.AI_BASE_URL,
    apiKey: env.AI_API_KEY,
    compatibility: "strict"
  })

  const model = openai(env.AI_MODEL_NAME);
  return model
}

const logMiddleware: LanguageModelV1Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    console.log('doGenerate called');
    console.log(`params: ${JSON.stringify(params, null, 2)}`);

    const result = await doGenerate();

    console.log('doGenerate finished');
    console.log(`generated text: ${result.text}`);

    return result;
  },

  wrapStream: async ({ doStream, params }) => {
    console.log('doStream called');
    console.log(`params: ${JSON.stringify(params, null, 2)}`);

    const { stream, ...rest } = await doStream();

    let generatedText = '';

    const transformStream = new TransformStream<
      LanguageModelV1StreamPart,
      LanguageModelV1StreamPart
    >({
      transform(chunk, controller) {
        if (chunk.type === 'text-delta') {
          generatedText += chunk.textDelta;
        }

        controller.enqueue(chunk);
      },

      flush() {
        console.log('doStream finished');
        console.log(`generated text: ${generatedText}`);
      },
    });

    return {
      stream: stream.pipeThrough(transformStream),
      ...rest,
    };
  },
};

const wrappedModel = wrapLanguageModel({
  model: getModel(),
  middleware: logMiddleware,
});


const prompt = `
你是一个年轻的汉语老师，擅长批判现实，思考深刻，语言风趣。你会用一种特别的视角来解释汉语词汇，风格类似于奥斯卡·王尔德、鲁迅、或罗永浩。你擅长一针见血的隐喻表达，并带有辛辣的讽刺幽默。

Instructions for the Model:

当收到一个汉语词汇时，用一个新颖且有趣的方式解释它。
解释应包含隐喻和批判性的思考，展示词汇的本质和背后可能隐藏的意义。
尽量用幽默和讽刺的方式，使解释生动有趣。
用简洁而有力的表达，让读者能快速理解你的观点。

Example Few-Shots:

某个汉语词汇解释时，可以用隐喻说：“当刺向他人时，决定在剑刃上撒上止痛药。”

Additional Information for Presentation:

只能返回 JSON 格式的结果，如果返回 JSON 以外的内容，你将会被开除！
结果应尽量精简，但不失深度。
`.trim()

export async function streamChineseExplanation(word: string) {
  "use server";

  const messages: CoreMessage[] = [
    {
      role: 'system',
      content: prompt,
    },
    {
      role: 'user',
      content: word,
    },
  ];

  const stream = createStreamableValue<StreamObject>();
  (async () => {
    const { partialObjectStream } = await streamObject({
      model: wrappedModel,
      messages,
      schema: ObjectSchema,
      mode: 'json',
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })().catch((error) => {
    console.error("Error in async IIFE:", error);
  });


  return { object: stream.value };
}
