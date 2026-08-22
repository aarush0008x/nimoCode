import React, { useState } from 'react';
import { UserPlus, UserMinus, Swords, Trophy, Flame, Search, Check, AlertCircle, Users, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useDb } from '../../context/DbContext';

interface FriendsSectionProps {
  user: UserProfile;
  onOpenEditProfile?: () => void;
}

export const FriendsSection: React.FC<FriendsSectionProps> = ({ user }) => {

  const { addFriend, removeFriend } = useAuth();
  const { users } = useDb();

  const [searchUsername, setSearchUsername] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const friendUsernames = (user.friends || []).map(f => f.toLowerCase());
  
  // Find full objects for all friends from DbContext users
  const friendProfiles = users.filter(u => 
    friendUsernames.includes(u.username.toLowerCase()) && 
    u.username.toLowerCase() !== user.username.toLowerCase()
  );

  // Suggestions for adding new friends
  const nonFriends = users.filter(u => 
    !friendUsernames.includes(u.username.toLowerCase()) && 
    u.username.toLowerCase() !== user.username.toLowerCase()
  );

  const filteredSuggestions = searchUsername.trim()
    ? nonFriends.filter(u => 
        u.username.toLowerCase().includes(searchUsername.toLowerCase()) || 
        u.name.toLowerCase().includes(searchUsername.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleAddFriend = async (usernameToAdd: string) => {
    const target = usernameToAdd.trim().toLowerCase();
    if (!target) return;
    if (target === user.username.toLowerCase()) {
      setFeedback({ type: 'error', message: "You cannot add yourself as a friend." });
      return;
    }
    if (friendUsernames.includes(target)) {
      setFeedback({ type: 'error', message: `@${target} is already in your friends list.` });
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await addFriend(target);
      if (ok) {
        setFeedback({ type: 'success', message: `Added @${target} to your friends list!` });
        setSearchUsername('');
      } else {
        setFeedback({ type: 'error', message: `Could not find or add user @${target}.` });
      }
    } catch {
      setFeedback({ type: 'error', message: "Network error adding friend." });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const handleRemoveFriend = async (usernameToRemove: string) => {
    try {
      await removeFriend(usernameToRemove);
      setFeedback({ type: 'success', message: `Removed @${usernameToRemove} from friends list.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback({ type: 'error', message: "Error removing friend." });
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Add Friend Card & Search */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-amber-500" />
              <span>Add Friends by @username or Full Name</span>
            </h3>
            <p className="text-xs text-neutral-500 font-medium">
              Track your peers on the Friends Leaderboard tab and challenge them to real-time coding duels.
            </p>
          </div>

          <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {friendProfiles.length} Active Friend{friendProfiles.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Input bar */}
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchUsername}
                onChange={e => setSearchUsername(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchUsername.trim()) {
                    handleAddFriend(searchUsername);
                  }
                }}
                placeholder="Search coder by @username (e.g. test_user, sushil_89, aarush)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              disabled={isSubmitting || !searchUsername.trim()}
              onClick={() => handleAddFriend(searchUsername)}
              className="px-5 py-2.5 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Friend</span>
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl z-20 overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredSuggestions.map(s => (
                <div
                  key={s.username}
                  className="p-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-extrabold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <span>{s.name}</span>
                        <span className="font-mono text-neutral-400 text-[10px]">@{s.username}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-2 mt-0.5">
                        <span>Rating: <strong className="text-amber-500">{s.rating || 1200}</strong></span>
                        {s.college && <span>? ?? {s.college}</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddFriend(s.username)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs transition-all flex items-center gap-1 shadow-xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            feedback.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}>
            {feedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Friends List Grid */}
      {friendProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {friendProfiles.map(friend => (
            <div
              key={friend.username}
              className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-neutral-200 dark:border-neutral-700 shadow-sm"
                  />
                  <div>
                    <div className="text-sm font-extrabold text-neutral-950 dark:text-white flex items-center gap-2">
                      <span>{friend.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-extrabold border border-amber-500/20">
                        {friend.rating || 1200} ELO
                      </span>
                    </div>
                    <div className="text-xs font-mono text-neutral-400">@{friend.username}</div>
                    {friend.college && (
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>{friend.college} {friend.gradYear ? `('${String(friend.gradYear).slice(-2)})` : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveFriend(friend.username)}
                  title="Remove from Friends"
                  className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </div>

              {friend.bio && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 italic line-clamp-2 bg-neutral-50 dark:bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  "{friend.bio}"
                </p>
              )}

              {/* Friend Stats Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-center font-mono">
                <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-950">
                  <div className="text-[10px] text-neutral-400 uppercase font-sans">Solved</div>
                  <div className="text-xs font-extrabold text-neutral-900 dark:text-white mt-0.5">
                    {friend.solvedCount || 0}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-950">
                  <div className="text-[10px] text-neutral-400 uppercase font-sans">Streak</div>
                  <div className="text-xs font-extrabold text-amber-500 mt-0.5 flex items-center justify-center gap-0.5">
                    <Flame className="w-3 h-3 fill-current" /> {friend.streak || 1}d
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-950">
                  <div className="text-[10px] text-neutral-400 uppercase font-sans">Wins</div>
                  <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                    ?? {friend.contestWins || 0}
                  </div>
                </div>
              </div>

              {/* Challenge in 1v1 duel button */}
              <div className="flex gap-2">
                <Link
                  to="/duels"
                  className="w-full py-2 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Challenge to 1v1 Duel</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-3xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-sm font-extrabold text-neutral-950 dark:text-white">No Friends Added Yet</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-medium">
              Search coders above or visit the Global Leaderboard and click <strong>? Add Friend</strong> next to any competitive programmer.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/leaderboard"
              className="px-5 py-2.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold shadow-sm flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4" />
              <span>Explore Global Leaderboard</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
