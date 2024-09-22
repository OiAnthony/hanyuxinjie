import { ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import AnimatedGradientText from "./magicui/animated-gradient-text";
import Link from "next/link";


export async function Aff() {
  return (
    <Link href={"https://cloud.siliconflow.cn/i/wmHXWg4H"} target="_blank" data-umami-event="aff-link">
      <AnimatedGradientText>
        🎉 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{" "}
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent whitespace-nowrap`,
          )}
        >
          2000万Tokens送不停！
        </span>
        <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </AnimatedGradientText>
    </Link>
  );
}
