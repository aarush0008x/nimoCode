import React from 'react';
import type { LeaderboardEntry } from '../../types';
import { Flame, TrendingUp, TrendingDown, Minus, UserPlus, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries }) => {
  const { user, addFriend, removeFriend } = useAuth();

  const friendList = (user?.friends || []).map(f => f.toLowerCase());

  const handleToggleFriend = async (e: React.MouseEvent, targetUsername: string) => {
    e.stopPropagation();
    const clean = targetUsername.toLowerCase();
    if (friendList.includes(clean)) {
      await removeFriend(clean);
    } else {
      await addFriend(clean);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-100/80 dark:bg-neutral-950/80 text-neutral-400 font-sans border-b border-neutral-200 dark:border-neutral-800 uppercase tracking-wider font-bold">
            <tr>
              <th className="py-4 px-4 text-center">Rank</th>
              <th className="py-4 px-4">Coder & Campus</th>
              <th className="py-4 px-4 text-center font-mono">Rating</th>
              <th className="py-4 px-4 text-center">Solved</th>
              <th className="py-4 px-4 text-center">Contest Wins</th>
              <th className="py-4 px-4 text-center">Streak</th>
              <th className="py-4 px-4 text-center">Badge</th>
              {user && <th className="py-4 px-4 text-center">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-semibold">
            {entries.map(entry => {
              const isCurrentUser = user && user.username.toLowerCase() === entry.username.toLowerCase();
              const isFriend = friendList.includes(entry.username.toLowerCase());

              return (
                <tr
                  key={entry.username}
                  className={`transition-colors ${
                    isCurrentUser
                      ? 'bg-amber-500/5 hover:bg-amber-500/10 dark:bg-amber-500/10 dark:hover:bg-amber-500/15'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-950/50'
                  }`}
                >
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-neutral-950 dark:text-white">
                    <div className="flex items-center justify-center gap-1.5">
                      {entry.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
                      {entry.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
                      {entry.trend === 'same' && <Minus className="w-3 h-3 text-neutral-400" />}
                      <span>#{entry.rank}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={entry.avatar} alt={entry.name} className="w-8 h-8 rounded-full object-cover shadow-xs border border-neutral-200 dark:border-neutral-700" />
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-neutral-950 dark:text-white text-xs">
                          <span>{entry.name}</span>
                          {isCurrentUser && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500 text-neutral-950">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                          <span>@{entry.username}</span>
                          {entry.college && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-sans font-bold flex items-center gap-0.5">
                              • 🎓 {entry.college}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-neutral-900 dark:text-white">
                    {entry.rating}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-neutral-700 dark:text-neutral-300">
                    {entry.solvedCount}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-amber-600 dark:text-amber-400 font-bold">
                    🏆 {entry.contestWins}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-amber-500">
                    <span className="inline-flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" /> {entry.streak}d
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-bold border border-neutral-300 dark:border-neutral-700">
                      {entry.badge || 'Coder'}
                    </span>
                  </td>
                  {user && (
                    <td className="py-3.5 px-4 text-center">
                      {!isCurrentUser && (
                        <button
                          onClick={e => handleToggleFriend(e, entry.username)}
                          title={isFriend ? 'Remove from Friends' : 'Add to Friends'}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all flex items-center justify-center gap-1 mx-auto ${
                            isFriend
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-amber-500 hover:text-neutral-950 border border-neutral-200 dark:border-neutral-700'
                          }`}
                        >
                          {isFriend ? (
                            <>
                              <Star className="w-3 h-3 fill-current" />
                              <span>Friend</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3" />
                              <span>+ Friend</span>
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

