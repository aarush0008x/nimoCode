import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swords, Trophy, Zap, Users, Play, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LiveMatch {
  id: string;
  player1: { username: string; rating: number };
  player2: { username: string; rating: number };
  problemTitle: string;
  ratingStakes: number;
  status: string;
}

export const DuelPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isSearching, setIsSearching] = useState(false);
  const [searchTimer, setSearchTimer] = useState(0);
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);

  // Fetch real live matches from backend API
  const fetchLiveMatches = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/duels');
      if (res.ok) {
        const data = await res.json();
        setLiveMatches(data || []);
      }
    } catch {
      setLiveMatches([]);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
  }, []);

  const startMatchmaking = async () => {
    setIsSearching(true);
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      setSearchTimer(seconds);
    }, 1000);

    try {
      const res = await fetch('http://localhost:5000/api/duels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1: user ? { username: user.username, name: user.name, avatar: user.avatar, rating: user.rating, status: 'coding', testCasesPassed: 0 } : null,
          problemId: '1',
          problemTitle: '#1 Two Sum',
          ratingStakes: 30
        })
      });

      if (res.ok) {
        const newDuel = await res.json();
        clearInterval(interval);
        setIsSearching(false);
        navigate(`/duels/${newDuel.id}`);
        return;
      }
    } catch {
      // Fallback navigation
    }

    setTimeout(() => {
      clearInterval(interval);
      setIsSearching(false);
      navigate('/duels/match-101');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
      {/* Header Hero */}
      <div className="p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-4 relative overflow-hidden shadow-2xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
          <Swords className="w-4 h-4" />
          1v1 REALTIME MULTIPLAYER ARENA
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Head-to-Head Code Duels
        </h1>
        <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
          Race against live opponents in real time on identical LeetCode problems. Pass all test cases first to win ELO rating stakes and claim victory.
        </p>

        {/* Matchmaking Action CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={startMatchmaking}
            disabled={isSearching}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-sm shadow-xl hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {isSearching ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-neutral-950" />
                <span>Finding Real Opponent ({searchTimer}s)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-neutral-950" />
                <span>Find Ranked 1v1 Match (+30 Rating)</span>
              </>
            )}
          </button>

          {user && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Your Duel Rating: <strong className="text-white">{user.rating} ELO</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Active Arena Matches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-neutral-500" />
            <span>Live 1v1 Duel Arena Matches</span>
          </h2>
          <span className="text-xs font-mono text-neutral-500">{liveMatches.length} Live Matches</span>
        </div>

        {liveMatches.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-3 shadow-xs">
            <Swords className="w-10 h-10 text-neutral-400 mx-auto opacity-50" />
            <h3 className="text-base font-extrabold text-neutral-950 dark:text-white">No Active 1v1 Duels Right Now</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              There are no demo matches running. Click <strong className="text-amber-500 font-mono">"Find Ranked 1v1 Match"</strong> above to create a real 1v1 match room!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liveMatches.map(m => (
              <div key={m.id} className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                    🔴 LIVE MATCH
                  </span>
                  <span className="text-amber-500 font-bold">+{m.ratingStakes} Rating</span>
                </div>

                <div className="flex items-center justify-between py-2 text-xs">
                  <div className="text-center font-bold">
                    <div className="text-neutral-950 dark:text-white">@{m.player1?.username || 'aarush'}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{m.player1?.rating || 1200} ELO</div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-extrabold text-neutral-400 text-xs">
                    VS
                  </div>

                  <div className="text-center font-bold">
                    <div className="text-neutral-950 dark:text-white">@{m.player2?.username || 'Waiting...'}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{m.player2?.rating || 1200} ELO</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-neutral-500">{m.problemTitle}</span>
                  <Link
                    to={`/duels/${m.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <span>Enter Match</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
