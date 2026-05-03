"use client";

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-base transition hover:scale-105 dark:border-white/20"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
