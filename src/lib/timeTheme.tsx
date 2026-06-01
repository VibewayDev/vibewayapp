// Time-based theme detection
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type TimeTheme = 'day' | 'night';

function getThemeFromHour(h: number): TimeTheme {
  return h >= 6 && h < 20 ? 'day' : 'night';
}

interface ThemeCtx {
  theme: TimeTheme;
  hour: number;
  setSimHour: (h: number | null) => void;
  simHour: number | null;
}

const Ctx = createContext<ThemeCtx>({ theme: 'night', hour: 0, setSimHour: () => {}, simHour: null });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [realHour, setRealHour]   = useState(new Date().getHours());
  const [simHour, setSimHour]     = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setRealHour(new Date().getHours()), 60_000);
    return () => clearInterval(id);
  }, []);

  const hour  = simHour ?? realHour;
  const theme = getThemeFromHour(hour);

  return <Ctx.Provider value={{ theme, hour, setSimHour, simHour }}>{children}</Ctx.Provider>;
}

export function useTheme() { return useContext(Ctx); }
