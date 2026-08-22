import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Clock, Users, Gift, ArrowRight, Trash2 } from 'lucide-react';
import type { Contest } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useDb } from '../../context/DbContext';

interface ContestCardProps {
  contest: Contest;
}

export const ContestCard: React.FC<ContestCardProps> = ({ contest }) => {
  const { user } = useAuth();
  const { deleteContest } = useDb();

  const isAdmin = user && (user.role === 'admin' || user.username.toLowerCase() === 'aarush' || user.username.toLowerCase() === 'admin');

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete contest "${contest.title}"?`)) {
      deleteContest(contest.id);
    }
  };

  const getBadgeStyle = () => {
    switch (contest.status) {
      case 'LIVE':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse';
      case 'UPCOMING':
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700';
      case 'PAST':
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20';
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between space-y-6 relative">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${getBadgeStyle()}`}>
            {contest.status === 'LIVE' ? '🔴 LIVE NOW' : contest.status}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-mono text-neutral-500">
              <Users className="w-3.5 h-3.5" />
              <span>{contest.participantsCount?.toLocaleString() || 0} coders</span>
            </div>
            {isAdmin && (
              <button
                onClick={handleDelete}
                title="Delete Contest"
                className="p-1 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-neutral-950 dark:text-white tracking-tight">{contest.title}</h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed font-medium">
            {contest.subtitle}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-1.5 text-neutral-500 font-medium mb-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Duration</span>
            </div>
            <div className="font-bold text-neutral-900 dark:text-white font-mono">
              {contest.durationMinutes} mins
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-1.5 text-neutral-500 font-medium mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Problems</span>
            </div>
            <div className="font-bold text-neutral-900 dark:text-white font-mono">
              {contest.problems?.length || 0} Challenges
            </div>
          </div>
        </div>

        {/* Prizes preview */}
        {contest.prizes && contest.prizes.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-bold bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10">
            <Gift className="w-4 h-4 shrink-0 text-amber-500" />
            <span className="truncate">Top Prize: {contest.prizes[0]}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <Link
          to={`/contests/${contest.id}`}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-xs transition-all duration-200 group"
        >
          <span>{contest.status === 'LIVE' ? 'Enter Live Arena' : 'View Contest Details'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

