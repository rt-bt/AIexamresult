"use client";

import { LangProvider } from "@/lib/hooks/use-lang";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LangProvider>{children}</LangProvider>;
}
