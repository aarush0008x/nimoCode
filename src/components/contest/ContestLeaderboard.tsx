import React from 'react';
import { MOCK_CONTEST_LEADERBOARD } from '../../data/contests';
import { Check, X } from 'lucide-react';

export const ContestLeaderboard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
      <div className="px-4 py-3 bg-neutral-100/70 dark:bg-neutral-950/70 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">
          Live Contest Scoreboard
        </h3>
        <span className="text-[11px] font-mono text-emerald-500 font-semibold animate-pulse">
          ● Updating live
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-400 font-sans border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">User</th>
              <th className="py-2.5 px-3 text-center">Score</th>
              <th className="py-2.5 px-3 text-center">Penalty</th>
              <th className="py-2.5 px-3 text-center">A</th>
              <th className="py-2.5 px-3 text-center">B</th>
              <th className="py-2.5 px-3 text-center">C</th>
              <th className="py-2.5 px-3 text-center">D</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {MOCK_CONTEST_LEADERBOARD.map(entry => (
              <tr key={entry.username} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/50 transition-colors">
                <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                  {entry.rank}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2 font-sans font-medium">
                    <img src={entry.avatar} alt={entry.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-neutral-900 dark:text-white font-semibold">{entry.username}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center font-bold text-violet-600 dark:text-violet-400">
                  {entry.score}
                </td>
                <td className="py-3 px-3 text-center text-neutral-400">
                  {entry.penaltyMinutes}m
                </td>
                {['A', 'B', 'C', 'D'].map(code => {
                  const prob = entry.problemScores[code];
                  return (
                    <td key={code} className="py-3 px-3 text-center">
                      {prob?.solved ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          <Check className="w-3 h-3" /> {prob.timeMs}m
                        </span>
                      ) : prob?.attempts ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                          <X className="w-3 h-3" /> -{prob.attempts}
                        </span>
                      ) : (
                        <span className="text-neutral-300 dark:text-neutral-700">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
