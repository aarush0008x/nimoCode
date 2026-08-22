import React from 'react';
import { Flame, Calendar, Trophy, Zap } from 'lucide-react';

interface ActivityHeatmapProps {
  streak: number;
  totalSubmissions: number;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ streak, totalSubmissions }) => {
  const weeks = 52;
  const daysPerWeek = 7;

  const grid = Array.from({ length: weeks }, (_, wIdx) => {
    return Array.from({ length: daysPerWeek }, (_, dIdx) => {
      const isRecent = wIdx >= 46;
      const count = isRecent ? Math.floor(Math.sin(wIdx + dIdx) * 3 + 2) : (wIdx * 7 + dIdx) % 11 === 0 ? 3 : (wIdx + dIdx) % 4 === 0 ? 1 : 0;
      return Math.max(0, Math.min(4, count));
    });
  });

  const getColorClass = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-950 dark:bg-emerald-900/60 border border-emerald-800/40';
      case 2:
        return 'bg-emerald-700 dark:bg-emerald-600';
      case 3:
        return 'bg-emerald-500 dark:bg-emerald-500';
      case 4:
        return 'bg-emerald-400 shadow-xs shadow-emerald-400';
      default:
        return 'bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/60';
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-neutral-950 dark:text-white">365-Day Algorithm Activity Grid</h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            {totalSubmissions || 75} submissions evaluated in the last 12 months
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-500">
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
            <span>{streak || 7} DAY STREAK 🔥</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-500">
            <Trophy className="w-3.5 h-3.5" />
            <span>TOP 4% CODER</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1 min-w-[720px]">
          {grid.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((level, dIdx) => (
                <div
                  key={dIdx}
                  className={`w-3 h-3 rounded-xs transition-colors cursor-pointer hover:scale-125 ${getColorClass(level)}`}
                  title={`Week ${wIdx + 1}, Day ${dIdx + 1}: ${level > 0 ? `${level * 2} submissions` : 'No submissions'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 pt-1">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Daily Challenge Streak Multiplier: <strong>2x XP Active</strong></span>
        </div>

        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-xs bg-neutral-200 dark:bg-neutral-800" />
          <div className="w-2.5 h-2.5 rounded-xs bg-emerald-900" />
          <div className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
          <div className="w-2.5 h-2.5 rounded-xs bg-emerald-400" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
