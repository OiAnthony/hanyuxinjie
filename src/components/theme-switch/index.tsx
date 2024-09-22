"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {theme === 'dark' && <div className="h-fit w-fit cursor-pointer p-1 border border-gray-400 rounded"><SunIcon data-umami-event="theme-switch" size={16} onClick={() => setTheme('light')} className="text-gray-200 fill-gray-200" /></div>}
      {theme === 'light' && <div className="h-fit w-fit cursor-pointer p-1 border border-gray-400 rounded"><MoonIcon data-umami-event="theme-switch" size={16} onClick={() => setTheme('dark')} className="text-gray-600 fill-gray-600 cursor-pointer" /></div>}
    </>
  );
}

export default ThemeSwitch;
