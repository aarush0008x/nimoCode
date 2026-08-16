import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DailyChallengeBanner: React.FC = () => {
  const { user } = useAuth();
  const streak = user?.streakDays || 1;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-4 relative overflow-hidden shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            TODAY'S LEETCODE DAILY CHALLENGE • +100 BONUS XP
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Problem #1: Two Sum (Easy)
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl font-medium">
            Solve today's featured challenge to extend your daily streak and earn double XP towards your global leaderboard rank.
          </p>
        </div>

        {/* Action CTA & Streak Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-2 text-xs font-mono font-bold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span className="text-amber-400">{streak} Day Streak</span>
          </div>

          <Link
            to="/problems/1"
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>Solve Daily Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
