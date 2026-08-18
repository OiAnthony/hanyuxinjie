'use client';

import { Tab, Tabs } from '@heroui/react';
import { useState } from 'react';
import HanyuxinjieChat from './hanyuxinjie';
import UltimateClapbackChat from './ultimate-clapback';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const modeOptions = [
  { key: 'hanyuxinjie', title: '汉语新解' },
  { key: 'ultimate-clapback', title: '最强嘴替' },
] as const;

type ModeKeys = (typeof modeOptions)[number]['key'];

export default function Chat() {
  const [mode, setMode] = useState<ModeKeys>(modeOptions[1].key);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto stretch space-y-4 items-center">

      <Tabs
        selectedKey={mode}
        onSelectionChange={(key) => {
          const nextMode = modeOptions.find(option => option.key === key);
          if (nextMode) {
            setMode(nextMode.key);
          }
        }}
        color={"primary"}
      >
        {
          modeOptions.map(option => (
            <Tab key={option.key} title={option.title} />
          ))
        }
      </Tabs>

      {mode === "hanyuxinjie" && <HanyuxinjieChat />}
      {mode === "ultimate-clapback" && <UltimateClapbackChat />}

    </div>
  );
}
