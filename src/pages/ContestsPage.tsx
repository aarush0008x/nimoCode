import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Plus } from 'lucide-react';
import { useDb } from '../context/DbContext';
import { ContestCard } from '../components/contest/ContestCard';

export const ContestsPage: React.FC = () => {
  const { contests } = useDb();
  const [activeTab, setActiveTab] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'PAST'>('ALL');

  const filteredContests = contests.filter(c => {
    if (activeTab === 'ALL') return true;
    return c.status === activeTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          <Trophy className="w-4 h-4" />
          NIMOCODE ARENA CHAMPIONSHIPS
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
          Compete with the best.
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
          Test your speed, algorithm precision, and problem-solving rank in official NimoCode competitive contests.
        </p>

        <div className="pt-2">
          <Link
            to="/contests/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Host Your Own Contest</span>
          </Link>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex items-center justify-center gap-2">
        {(['ALL', 'LIVE', 'UPCOMING', 'PAST'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 ${
              activeTab === tab
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            {tab === 'LIVE' ? '🔴 LIVE' : tab}
          </button>
        ))}
      </div>

      {/* Contest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredContests.map(contest => (
          <ContestCard key={contest.id} contest={contest} />
        ))}
      </div>
    </div>
  );
};
