import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Viewport, type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeSwitch } from "~/components/theme-switch";
import { Social } from "~/components/social";
import { env } from "~/env";

export const metadata: Metadata = {
  title: "汉语新解",
  description: "汉语新解",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      {
        env.UMAMI_SCRIPT_SRC && env.UMAMI_WEBSITE_ID && (
          <head>
            <script defer src={env.UMAMI_SCRIPT_SRC} data-website-id={env.UMAMI_WEBSITE_ID}></script> 
          </head>
        )
      }
      <body>
        <TRPCReactProvider>
          <NextUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="dark">
              <div className="flex flex-row absolute right-2 top-2 space-x-2">
                <Social />
                <ThemeSwitch />
              </div>
              {children}
            </NextThemesProvider>
          </NextUIProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
