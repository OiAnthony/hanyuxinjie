'use client';

import { Button, Divider, Input, Textarea } from '@nextui-org/react';
import { readStreamableValue } from 'ai/rsc';
import { useTheme } from "next-themes";
import { useState } from 'react';
import { MagicCard } from '~/components/magicui/magic-card';
import { streamUltimateClapback } from '~/lib/chat/actions';
import { type UltraClapbackInput, type UltraClapbackStreamObject } from '~/lib/chat/types';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function UltimateClapbackChat() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState<UltraClapbackInput>({
    background: undefined,
    badGuyRole: undefined,
    badGuySpeechContent: '',
  });
  const [streamObject, setStreamObject] = useState<UltraClapbackStreamObject>();

  const submit = async () => {
    setLoading(true);
    const { object: streamObject } = await streamUltimateClapback(input);

    for await (const content of readStreamableValue(streamObject)) {
      if (content !== undefined) {
        setStreamObject(content);
      }
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto stretch space-y-4 items-center">


      <div className='flex flex-col items-center justify-center gap-2'>
        <div className="flex flex-row items-center justify-center gap-2">
          <Input isDisabled={loading} autoComplete="off" value={input.background} label="背景" placeholder="" className="w-fit" onChange={e => setInput({ ...input, background: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
          <Input isDisabled={loading} autoComplete="off" value={input.badGuyRole} label="对方身份" placeholder="" className="w-fit" onChange={e => setInput({ ...input, badGuyRole: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>
        <Textarea isDisabled={loading} autoComplete="off" value={input.badGuySpeechContent} label="对方说了什么？" placeholder="" className="w-full" onChange={e => setInput({ ...input, badGuySpeechContent: e.target.value })} onKeyDown={e => e.key === 'Enter' && submit()} />
        <Button data-umami-event="explain-button" data-umami-event-word={input} isLoading={loading} radius="full" className="bg-gradient-to-tr from-purple-500 to-blue-500 text-white shadow-lg" onClick={submit}>
          还嘴
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
                <h2 className='text-3xl text-center'>最强嘴替</h2>
                <Divider className='w-full !mb-4' />
                <p className='!my-2'>{streamObject?.badGuy}</p>
                <p className='!my-2'>{streamObject?.clapback}</p>
              </div>
            </MagicCard>
          </div>
        )
      }

    </div>
  );
}
