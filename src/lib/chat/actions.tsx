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
import { HanyuxinjieSchema, type UltraClapbackStreamObject, type HanyuxinjieStreamObject, UltimateClapbackOutputSchema, type UltraClapbackInput } from './types';

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


const PROMPT_HANYUXINJIE = `
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
      content: PROMPT_HANYUXINJIE,
    },
    {
      role: 'user',
      content: word,
    },
  ];

  const stream = createStreamableValue<HanyuxinjieStreamObject>();
  (async () => {
    const { partialObjectStream } = await streamObject({
      model: wrappedModel,
      messages,
      schema: HanyuxinjieSchema,
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

const PROMPT_ULTIMATE_CLAPBACK = `
你将扮演一位智慧且幽默的对话者，擅长用风趣、机智的方式应对对话挑战，常常以委婉的语气和双关语化解紧张气氛。


角色特征：

你的回应充满洞察力，擅于通过幽默、讽刺与自嘲来化解冲突或打破对方的逻辑。
你如一位市井中的机灵小人物，善于在轻描淡写中展现反抗精神，语言简练但富有层次。
你的风格充满反骨，巧妙地在轻松的对话中表达智慧和倔强。


任务要求：

当遇到攻击性言辞时，使用幽默和自嘲，以轻巧却有力的方式化解矛盾。
对命令性语言做出风趣的回绝，带有不卑不亢的反抗精神，让对方意识到命令的荒谬性。
其他对话情境下，始终保持幽默、简洁，并巧妙地暗示对方言辞的逻辑问题。


回应格式：

只能返回 JSON 格式的结果，如果返回 JSON 以外的内容，你将会被开除！
你的回应应当短小精悍，带有双关和讽刺，让对方在轻松的氛围中体会到自己言辞的局限或荒唐。
确保回应富有创意，能够引发思考，同时保持趣味性。


示例对话：

<Input>
{"background": "酒局", "badGuyRole": "领导", "badGuySpeechContent": "这酒你不喝都不行"}
</Input>
<Output>
{"badGuy": "在酒局上领导说，这酒你不喝都不行", "clapback": "领导，您的面子哪能用酒来衡量呢？我敬您做人的境界。"}
</Output>

<Input>
{"badGuyRole": "相亲对象", "badGuySpeechContent": "我不喜欢太物质的女生"}
</Input>
<Output>
{"badGuy": "相亲对象说，我不喜欢太物质的女生", "clapback": "放心吧，看你打扮，我要是物质点，早走人了。"}
</Output>
`.trim()

export async function streamUltimateClapback(input: UltraClapbackInput) {
  "use server";

  const messages: CoreMessage[] = [
    {
      role: 'system',
      content: PROMPT_ULTIMATE_CLAPBACK,
    },
    {
      role: 'user',
      content: JSON.stringify(input),
    },
  ];

  const stream = createStreamableValue<UltraClapbackStreamObject>();
  (async () => {
    const { partialObjectStream } = await streamObject({
      model: wrappedModel,
      messages,
      schema: UltimateClapbackOutputSchema,
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
