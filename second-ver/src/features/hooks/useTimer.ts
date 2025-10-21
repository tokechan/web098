import { useEffect, useState } from 'hono/jsx';

type TimerState = {
  now: Date;
  formatted: string;
};

const formatTime = (date: Date) => date.toLocaleString();

export const useTimer = (intervalMs = 1000): TimerState => {
  const [now, setNow] = useState(() => new Date());
  const [formatted, setFormatted] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => {
      const next = new Date();
      setNow(next);
      setFormatted(formatTime(next));
    }, Math.max(16, intervalMs));
    return () => clearInterval(id);
  }, [intervalMs]);

  return { now, formatted };
};
