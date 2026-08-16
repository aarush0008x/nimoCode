import React, { useState } from 'react';
import { Trophy, Search } from 'lucide-react';
import { useDb } from '../context/DbContext';
import { PodiumCard } from '../components/leaderboard/PodiumCard';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';

export const LeaderboardPage: React.FC = () => {
  const { users } = useDb();
  const [activeTab, setActiveTab] = useState<'Global' | 'Weekly' | 'Monthly' | 'College' | 'Friends'>('Global');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = users.filter(
    e =>
      e.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <Trophy className="w-4 h-4 text-amber-500" />
          NIMOCODE HALL OF FAME
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
          Global Rankings
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto font-medium">
          Dynamically calculated in real-time from all registered developers and problem solvers on NimoCode.
        </p>
      </div>

      {/* Podium Cards Top 3 */}
      {users.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-4xl mx-auto">
          {users.slice(0, 3).map(entry => (
            <PodiumCard key={entry.username} entry={entry} />
          ))}
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-x-auto w-full sm:w-auto">
          {(['Global', 'Weekly', 'Monthly', 'College', 'Friends'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter rank by username..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <LeaderboardTable entries={filteredEntries} />
    </div>
  );
};
