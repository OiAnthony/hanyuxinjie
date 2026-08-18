"use client";

import { HeroUIProvider } from "@heroui/react";
import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { TRPCReactProvider } from "~/trpc/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TRPCReactProvider>
      <HeroUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="light">
          {children}
        </NextThemesProvider>
      </HeroUIProvider>
    </TRPCReactProvider>
  );
}
