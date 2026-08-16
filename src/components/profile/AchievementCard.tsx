import React from 'react';
import type { Achievement } from '../../types';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  return (
    <div
      className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
        achievement.unlocked
          ? 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-xs'
          : 'bg-neutral-50/50 dark:bg-neutral-950/50 border-neutral-200/50 dark:border-neutral-800/40 opacity-60'
      }`}
    >
      <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl shrink-0">
        {achievement.icon}
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-neutral-900 dark:text-white">{achievement.title}</h4>
          {achievement.unlocked ? (
            <span className="text-[10px] font-mono text-emerald-500 font-semibold">Unlocked</span>
          ) : (
            <span className="text-[10px] font-mono text-neutral-400">Locked</span>
          )}
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {achievement.description}
        </p>

        {achievement.progress !== undefined && achievement.maxProgress && (
          <div className="pt-1.5 space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-neutral-400">
              <span>Progress</span>
              <span>{achievement.progress} / {achievement.maxProgress}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <div
                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                className="h-full bg-violet-600 rounded-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
