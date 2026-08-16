import React from 'react';
import { Crown, Flame } from 'lucide-react';
import type { LeaderboardEntry } from '../../types';

interface PodiumCardProps {
  entry: LeaderboardEntry;
}

export const PodiumCard: React.FC<PodiumCardProps> = ({ entry }) => {
  const isFirst = entry.rank === 1;
  const isSecond = entry.rank === 2;

  const getBorderColor = () => {
    if (isFirst) return 'border-amber-400/80 dark:border-amber-400/50 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent';
    if (isSecond) return 'border-slate-300 dark:border-slate-700 bg-gradient-to-b from-slate-400/10 via-slate-400/5 to-transparent';
    return 'border-amber-700/50 dark:border-amber-700/30 bg-gradient-to-b from-amber-700/10 via-amber-700/5 to-transparent';
  };

  const getCrownColor = () => {
    if (isFirst) return 'text-amber-400 fill-amber-400/20';
    if (isSecond) return 'text-slate-400 fill-slate-400/20';
    return 'text-amber-700 fill-amber-700/20';
  };

  return (
    <div
      className={`p-6 rounded-3xl border ${getBorderColor()} bg-white dark:bg-neutral-900 flex flex-col items-center text-center space-y-4 shadow-md transition-transform hover:-translate-y-1 relative ${
        isFirst ? 'md:-mt-4' : ''
      }`}
    >
      <div className="absolute top-3 left-4 flex items-center gap-1 font-mono font-extrabold text-xs text-neutral-400">
        #{entry.rank}
      </div>

      {/* Crown */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full p-1 border-2 border-dashed border-neutral-300 dark:border-neutral-700">
          <img src={entry.avatar} alt={entry.name} className="w-full h-full rounded-full object-cover shadow-xs" />
        </div>
        <Crown className={`w-6 h-6 absolute -top-3 left-1/2 -translate-x-1/2 ${getCrownColor()}`} />
      </div>

      <div>
        <h3 className="font-bold text-sm text-neutral-950 dark:text-white">{entry.name}</h3>
        <p className="text-xs font-mono text-neutral-400">@{entry.username}</p>
      </div>

      <div className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-extrabold font-mono border border-neutral-300 dark:border-neutral-700">
        {entry.rating} Rating
      </div>

      <div className="grid grid-cols-2 gap-2 w-full pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs font-mono">
        <div>
          <div className="text-[10px] text-neutral-400 uppercase font-sans">Solved</div>
          <div className="font-bold text-neutral-900 dark:text-white">{entry.solvedCount}</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400 uppercase font-sans">Streak</div>
          <div className="font-bold text-amber-500 flex items-center justify-center gap-0.5">
            <Flame className="w-3 h-3 fill-amber-500" /> {entry.streak}d
          </div>
        </div>
      </div>
    </div>
  );
};
