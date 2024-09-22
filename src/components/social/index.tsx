"use client";

import Link from "next/link";
import { GithubIcon } from "lucide-react";

export function Social() {
  return (
    <div className="flex flex-row space-x-1">
      <Link href={"https://github.com/OiAnthony/hanyuxinjie"} target="_blank" className="p-1 border border-gray-400 rounded" data-umami-event="social-github" >
        <GithubIcon size={16} />
      </Link>
    </div>
  );
}

export default Social;
