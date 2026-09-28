"use client";

import { createContext, useContext } from "react";

type Theme = "light";

const ThemeContext = createContext<{ theme: Theme }>({ theme: "light" });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{ theme: "light" }}>{children}</ThemeContext.Provider>;
}
