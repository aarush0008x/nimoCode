import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface ContestTimerProps {
  initialSeconds?: number;
}

export const ContestTimer: React.FC<ContestTimerProps> = ({ initialSeconds = 5400 }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-neutral-900 dark:bg-neutral-950 border border-neutral-800 text-white shadow-inner font-mono">
      <Clock className="w-4 h-4 text-violet-400 animate-pulse" />
      <span className="text-xs font-medium text-neutral-400">Ends in:</span>
      <span className="font-bold text-sm text-violet-300 tracking-wider">
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    </div>
  );
};
