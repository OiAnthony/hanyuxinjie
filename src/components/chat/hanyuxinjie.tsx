'use client';

import { Button, Divider, Input } from '@nextui-org/react';
import { readStreamableValue } from 'ai/rsc';
import { useTheme } from "next-themes";
import { useState } from 'react';
import { MagicCard } from '~/components/magicui/magic-card';
import { streamChineseExplanation } from '~/lib/chat/actions';
import { type HanyuxinjieStreamObject } from '~/lib/chat/types';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function HanyuxinjieChat() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [streamObject, setStreamObject] = useState<HanyuxinjieStreamObject>();

  const submit = async () => {
    setLoading(true);
    const { object: streamObject } = await streamChineseExplanation(input);

    for await (const content of readStreamableValue(streamObject)) {
      if (content !== undefined) {
        setStreamObject(content);
      }
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto stretch space-y-4 items-center">

      <div className="flex flex-row items-center justify-center gap-2">
        <Input isDisabled={loading} autoComplete="off" value={input} placeholder="请输入你想了解的词..." className="w-fit" onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
        <Button data-umami-event="explain-button" data-umami-event-word={input} isLoading={loading} radius="full" className="bg-gradient-to-tr from-purple-500 to-blue-500 text-white shadow-lg" onClick={submit}>
          解释
        </Button>
      </div>

      {
        streamObject && (
          <div
            className={
              "flex h-fit w-80 flex-col gap-4"
            }
          >
            <MagicCard
              className="w-full cursor-pointer flex-col items-center shadow-2xl p-4"
              gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            >
              <div className='flex flex-col space-y-2'>
                <h2 className='text-3xl text-center'>汉语新解</h2>
                <Divider className='w-full !mb-4' />
                <p className='text-3xl text-center'>{streamObject?.word}</p>
                <p className='text-center !mt-0 text-gray-500 italic'>{streamObject?.wordPinyin}</p>
                <p className=''>{streamObject?.explanation}</p>
              </div>
            </MagicCard>
          </div>
        )
      }

    </div>
  );
}
