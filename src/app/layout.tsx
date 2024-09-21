import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { NextUIProvider } from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { ThemeSwitch } from "~/components/theme-switch";

export const metadata: Metadata = {
  title: "汉语新解",
  description: "汉语新解",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <NextUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="dark">
              <div className="absolute right-2 top-2"><ThemeSwitch /></div>
              {children}
            </NextThemesProvider>
          </NextUIProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
