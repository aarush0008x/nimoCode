import React, { useState } from 'react';
import { Target, X, Zap } from 'lucide-react';
import type { UserProfile } from '../../types';

interface DailyQuestsModalProps {
  user: UserProfile;
  onClose: () => void;
}

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({ user: _user, onClose }) => {
  const [claimedIds, setClaimedIds] = useState<string[]>([]);

  const quests = [
    { id: 'q1', title: 'Solve 2 Medium DP Problems', xp: 250, icon: '⚡', completed: true },
    { id: 'q2', title: 'Win 1 Multiplayer Code Duel', xp: 500, icon: '⚔️', completed: true },
    { id: 'q3', title: 'Complete 1 AI Mock Interview', xp: 400, icon: '🤖', completed: false }
  ];

  const handleClaim = (id: string) => {
    if (!claimedIds.includes(id)) {
      setClaimedIds([...claimedIds, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-6 relative text-left">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2 font-bold text-sm text-neutral-950 dark:text-white">
            <Target className="w-5 h-5 text-amber-500" />
            <span>Daily Coding Quests & XP Rewards</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {quests.map(q => {
            const isClaimed = claimedIds.includes(q.id);
            return (
              <div key={q.id} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{q.icon}</span>
                  <div>
                    <div className="text-xs font-extrabold text-neutral-900 dark:text-white">{q.title}</div>
                    <div className="text-[11px] text-amber-500 font-mono font-bold flex items-center gap-1 mt-0.5">
                      <Zap className="w-3 h-3 fill-current" /> +{q.xp} XP Reward
                    </div>
                  </div>
                </div>

                <button
                  disabled={!q.completed || isClaimed}
                  onClick={() => handleClaim(q.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    isClaimed
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 opacity-60'
                      : q.completed
                      ? 'bg-amber-500 hover:bg-amber-600 text-neutral-950 shadow-md'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 opacity-50'
                  }`}
                >
                  {isClaimed ? 'Claimed ✅' : q.completed ? 'Claim XP' : 'In Progress'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
