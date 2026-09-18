"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  window.addEventListener("noticiaspro:theme-change", callback);
  return () => {
    media.removeEventListener("change", callback);
    window.removeEventListener("noticiaspro:theme-change", callback);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

/**
 * Reads/toggles theme via the DOM class an inline script (see RootLayout head)
 * already set before hydration, so there's no flash and no setState-in-effect.
 */
export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage unavailable (e.g. private browsing) — theme just won't persist.
    }
    window.dispatchEvent(new Event("noticiaspro:theme-change"));
  }

  return (
    <Button variant="outline" size="icon" onClick={toggle} aria-label="Cambiar tema claro/oscuro">
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
