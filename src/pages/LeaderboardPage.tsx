import React, { useState, useMemo } from 'react';
import { Trophy, Search, RefreshCw, GraduationCap, Users, UserPlus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';
import { PodiumCard } from '../components/leaderboard/PodiumCard';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import type { LeaderboardEntry } from '../types';

export const LeaderboardPage: React.FC = () => {
  const { users, refreshDb } = useDb();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'Global' | 'Weekly' | 'Monthly' | 'College' | 'Friends'>('Global');
  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshDb();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Get list of unique colleges across all registered users
  const uniqueColleges = useMemo(() => {
    const set = new Set<string>();
    users.forEach(u => {
      if (u.college && u.college.trim()) {
        set.add(u.college.trim());
      }
    });
    if (user?.college && user.college.trim()) {
      set.add(user.college.trim());
    }
    return Array.from(set);
  }, [users, user?.college]);

  // Compute filtered & ranked entries based on active tab
  const tabEntries = useMemo(() => {
    let list: LeaderboardEntry[] = [...users];

    if (activeTab === 'Weekly') {
      // Sort by weekly momentum: streak * 50 + solvedCount * 20 + rating
      list = [...users].sort((a, b) => {
        const scoreA = (a.streak || 1) * 50 + (a.solvedCount || 0) * 20 + (a.rating || 1200);
        const scoreB = (b.streak || 1) * 50 + (b.solvedCount || 0) * 20 + (b.rating || 1200);
        return scoreB - scoreA;
      });
    } else if (activeTab === 'Monthly') {
      // Sort by monthly activity: contestWins * 100 + solvedCount * 15 + rating
      list = [...users].sort((a, b) => {
        const scoreA = (a.contestWins || 0) * 100 + (a.solvedCount || 0) * 15 + (a.rating || 1200);
        const scoreB = (b.contestWins || 0) * 100 + (b.solvedCount || 0) * 15 + (b.rating || 1200);
        return scoreB - scoreA;
      });
    } else if (activeTab === 'College') {
      if (selectedCollege === 'All') {
        if (user?.college) {
          list = users.filter(u => u.college?.toLowerCase() === user.college?.toLowerCase());
        } else {
          list = users.filter(u => Boolean(u.college && u.college.trim()));
        }
      } else {
        list = users.filter(u => u.college?.toLowerCase() === selectedCollege.toLowerCase());
      }
    } else if (activeTab === 'Friends') {
      if (user) {
        const friendSet = new Set((user.friends || []).map(f => f.toLowerCase()));
        friendSet.add(user.username.toLowerCase());
        list = users.filter(u => friendSet.has(u.username.toLowerCase()));
      } else {
        list = [];
      }
    }

    // Re-rank based on the filtered list order
    return list.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  }, [users, activeTab, selectedCollege, user]);

  // Apply search query filter
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return tabEntries;
    const q = searchQuery.toLowerCase();
    return tabEntries.filter(
      e =>
        e.username.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        (e.college && e.college.toLowerCase().includes(q))
    );
  }, [tabEntries, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <Trophy className="w-4 h-4 text-amber-500" />
          NIMOCODE HALL OF FAME
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
          {activeTab === 'Global' && 'Global Leaderboard'}
          {activeTab === 'Weekly' && 'Weekly Sprint Leaderboard'}
          {activeTab === 'Monthly' && 'Monthly Champions Leaderboard'}
          {activeTab === 'College' && 'Campus & University Leaderboard'}
          {activeTab === 'Friends' && 'Friends & Peers Leaderboard'}
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto font-medium">
          {activeTab === 'Global' && 'Dynamically calculated in real-time from all registered developers and competitive problem solvers across MongoDB Atlas.'}
          {activeTab === 'Weekly' && 'Top developers ranked by weekly solving streak, contest performance, and rating acceleration.'}
          {activeTab === 'Monthly' && 'Leading competitors ranked by monthly contest victories, problem milestones, and ELO growth.'}
          {activeTab === 'College' && 'Represent your university, compete against campus peers, and climb the inter-college leaderboard.'}
          {activeTab === 'Friends' && 'Live realtime standings between you and your added coding friends.'}
        </p>

        {/* Realtime Live Sync Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Sync • {filteredEntries.length} Ranked Developer{filteredEntries.length !== 1 ? 's' : ''}</span>
          <button
            onClick={handleManualRefresh}
            title="Refresh Leaderboard"
            className="p-1 hover:bg-emerald-500/20 rounded-lg transition-colors ml-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* College Info Alert / Banner */}
      {activeTab === 'College' && !user?.college && (
        <div className="p-4 sm:p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-neutral-950 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-neutral-950 dark:text-white">
                Represent Your College or University!
              </div>
              <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Set your college in your profile to rank on your campus leaderboard and represent your school.
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowEditProfileModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 text-xs font-extrabold transition-all shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <span>Set My College</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Podium Cards Top 3 */}
      {filteredEntries.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-4xl mx-auto">
          {filteredEntries.slice(0, 3).map(entry => (
            <PodiumCard key={entry.username} entry={entry} />
          ))}
        </div>
      )}

      {/* Filters & Search */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-x-auto w-full md:w-auto">
            {(['Global', 'Weekly', 'Monthly', 'College', 'Friends'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {tab === 'College' && <GraduationCap className="w-3.5 h-3.5" />}
                {tab === 'Friends' && <Users className="w-3.5 h-3.5" />}
                <span>{tab}</span>
                {tab === 'Friends' && user?.friends && user.friends.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-extrabold bg-amber-500 text-neutral-950">
                    {user.friends.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Bar & College Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {activeTab === 'College' && uniqueColleges.length > 0 && (
              <div className="relative">
                <select
                  value={selectedCollege}
                  onChange={e => setSelectedCollege(e.target.value)}
                  className="px-3.5 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
                >
                  <option value="All">
                    {user?.college ? `My Campus (${user.college})` : 'All Campuses'}
                  </option>
                  {uniqueColleges.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter rank by username or campus..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 shadow-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table / Empty States */}
      {filteredEntries.length > 0 ? (
        <LeaderboardTable entries={filteredEntries} />
      ) : activeTab === 'Friends' ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-extrabold text-neutral-950 dark:text-white">
              {user ? 'No Friends Added Yet' : 'Sign In to View Friends Leaderboard'}
            </h3>
            <p className="text-xs text-neutral-500 font-medium leading-relaxed">
              {user
                ? 'Add your peers on the Global tab or search by username in your Profile to compare live rankings, contest wins, and problem solve stats.'
                : 'Sign in to add friends, track your campus peers, and view your private Friends leaderboard.'}
            </p>
          </div>
          <div className="pt-2">
            {user ? (
              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Go to Profile & Add Friends</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold shadow-sm"
              >
                <span>Sign In to NimoCode</span>
              </Link>
            )}
          </div>
        </div>
      ) : activeTab === 'College' ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-extrabold text-neutral-950 dark:text-white">
              No Campus Coders Found for "{selectedCollege}"
            </h3>
            <p className="text-xs text-neutral-500 font-medium leading-relaxed">
              Be the first coder to represent this university! Set your college in Profile to claim rank #1.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setShowEditProfileModal(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 text-xs font-extrabold shadow-sm"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Set Your College Now</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-2 shadow-xs">
          <h3 className="text-base font-extrabold text-neutral-950 dark:text-white">No Matching Coders</h3>
          <p className="text-xs text-neutral-500">Try clearing your search query to see the full leaderboard.</p>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && user && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfileModal(false)}
        />
      )}
    </div>
  );
};


