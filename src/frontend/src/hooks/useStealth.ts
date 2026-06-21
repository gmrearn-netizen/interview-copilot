import type { StealthSettings } from "@/types";
import { useCallback, useState } from "react";

const STORAGE_KEY = "interview-ai-stealth";

function loadSettings(): StealthSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StealthSettings;
  } catch {
    // ignore
  }
  return {
    opacity: 1,
    collapsed: false,
    position: { x: 16, y: 16 },
  };
}

function saveSettings(settings: StealthSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function useStealth() {
  const [settings, setSettings] = useState<StealthSettings>(loadSettings);

  const setOpacity = useCallback((opacity: number) => {
    setSettings((s) => {
      const next = { ...s, opacity };
      saveSettings(next);
      return next;
    });
  }, []);

  const toggleCollapsed = useCallback(() => {
    setSettings((s) => {
      const next = { ...s, collapsed: !s.collapsed };
      saveSettings(next);
      return next;
    });
  }, []);

  const setPosition = useCallback((position: { x: number; y: number }) => {
    setSettings((s) => {
      const next = { ...s, position };
      saveSettings(next);
      return next;
    });
  }, []);

  return {
    ...settings,
    setOpacity,
    toggleCollapsed,
    setPosition,
  };
}
