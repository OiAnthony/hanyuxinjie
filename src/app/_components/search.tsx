"use client"

import { Button, Input } from "@nextui-org/react";

export default function Search() {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <Input placeholder="请输入你想了解的词..." className="w-fit" />
      <Button radius="full" className="bg-gradient-to-tr from-purple-500 to-blue-500 text-white shadow-lg" >
        开始
      </Button>
    </div>
  );
}
