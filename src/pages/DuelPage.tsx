import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swords, Trophy, Zap, Users, Play, ArrowRight, Plus, Hash, Globe, Copy, Check, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../utils/apiConfig';

interface DuelRoom {
  id: string;
  code: string;
  player1: { username: string; rating: number; avatar?: string };
  player2?: { username: string; rating: number; avatar?: string } | null;
  problemTitle: string;
  ratingStakes: number;
  status: 'waiting' | 'active' | 'finished';
  isPrivate: boolean;
  createdAt: string;
}

type Tab = 'create' | 'join' | 'world';

export const DuelPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('create');
  const [worldRooms, setWorldRooms] = useState<DuelRoom[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<DuelRoom | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  const fetchWorldRooms = useCallback(async () => {
    setIsFetching(true);
    try {
      const res = await fetch(getApiUrl('/duels'));
      if (res.ok) {
        const data = await res.json();
        setWorldRooms((data || []).filter((r: DuelRoom) => !r.isPrivate && r.status === 'waiting'));
      }
    } catch { setWorldRooms([]); }
    setIsFetching(false);
  }, []);

  useEffect(() => {
    fetchWorldRooms();
    const interval = setInterval(fetchWorldRooms, 4000);
    return () => clearInterval(interval);
  }, [fetchWorldRooms]);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setCreatedRoom(null);
    try {
      const res = await fetch(getApiUrl('/duels'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1: user ? { username: user.username, name: user.name, avatar: user.avatar, rating: user.rating } : { username: 'Guest', rating: 1200 },
          problemId: '1', problemTitle: '#1 Two Sum', ratingStakes: 30, isPrivate
        })
      });
      if (res.ok) setCreatedRoom(await res.json());
    } catch {}
    setIsCreating(false);
  };

  const handleCopyCode = async () => {
    if (!createdRoom) return;
    await navigator.clipboard.writeText(createdRoom.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinByCode = async () => {
    if (!joinCode.trim()) return;
    setIsJoining(true);
    setJoinError('');
    try {
      const res = await fetch(getApiUrl(`/duels/code/${joinCode.trim().toUpperCase()}`));
      if (res.ok) {
        const room = await res.json();
        if (room.status === 'finished') { setJoinError('This room is already finished.'); setIsJoining(false); return; }
        await fetch(getApiUrl(`/duels/${room.id}/join`), {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ player2: user ? { username: user.username, name: user.name, avatar: user.avatar, rating: user.rating } : { username: 'Guest', rating: 1200 } })
        });
        navigate(`/duels/${room.id}`);
      } else { setJoinError('Room not found. Check the code and try again.'); }
    } catch { setJoinError('Could not connect. Please try again.'); }
    setIsJoining(false);
  };

  const handleJoinWorldRoom = async (room: DuelRoom) => {
    try {
      await fetch(getApiUrl(`/duels/${room.id}/join`), {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player2: user ? { username: user.username, name: user.name, avatar: user.avatar, rating: user.rating } : { username: 'Guest', rating: 1200 } })
      });
    } catch {}
    navigate(`/duels/${room.id}`);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'create', label: 'Create Room', icon: <Plus className="w-3.5 h-3.5" /> },
    { id: 'join', label: 'Join by Code', icon: <Hash className="w-3.5 h-3.5" /> },
    { id: 'world', label: 'World Rooms', icon: <Globe className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
      <div className="p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-3 shadow-2xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
          <Swords className="w-4 h-4" /> 1v1 REALTIME MULTIPLAYER ARENA
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Head-to-Head Code Duels</h1>
        <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
          Race against a live opponent on identical LeetCode problems. Pass all test cases first to win ELO rating stakes.
        </p>
        {user && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono mt-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Your Rating: <strong className="text-white">{user.rating} ELO</strong></span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="flex border-b border-neutral-200 dark:border-neutral-800">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'create' && (
            <div className="space-y-6 max-w-md mx-auto">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-extrabold text-neutral-950 dark:text-white">Create a Duel Room</h2>
                <p className="text-xs text-neutral-500">Create a private room and share the code with a friend, or make it public for anyone to join.</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">Private Room</div>
                  <div className="text-[10px] text-neutral-500">Only joinable via room code</div>
                </div>
                <button onClick={() => setIsPrivate(p => !p)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPrivate ? 'bg-amber-500' : 'bg-neutral-300 dark:bg-neutral-700'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {!createdRoom ? (
                <button onClick={handleCreateRoom} disabled={isCreating}
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-neutral-950 font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2">
                  {isCreating ? <><Zap className="w-4 h-4 animate-spin" /> Creating Room...</> : <><Play className="w-4 h-4 fill-neutral-950" /> Create Duel Room</>}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Room Created! Share this code:</div>
                    <div className="font-mono text-4xl font-black text-neutral-950 dark:text-white tracking-[0.3em]">{createdRoom.code}</div>
                    <button onClick={handleCopyCode}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-bold transition-all">
                      {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Code</>}
                    </button>
                  </div>
                  <button onClick={() => navigate(`/duels/${createdRoom.id}`)}
                    className="w-full py-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-sm flex items-center justify-center gap-2">
                    <span>Enter Room &amp; Wait for Opponent</span><ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setCreatedRoom(null)} className="w-full text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white py-2">
                    Create a different room
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'join' && (
            <div className="space-y-6 max-w-md mx-auto">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-extrabold text-neutral-950 dark:text-white">Join by Room Code</h2>
                <p className="text-xs text-neutral-500">Enter the 6-character code your friend shared with you.</p>
              </div>
              {joinError && <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold text-center">{joinError}</div>}
              <div className="space-y-3">
                <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                  placeholder="e.g. XK4J9A" maxLength={6}
                  className="w-full px-5 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-center text-2xl font-black tracking-[0.3em] uppercase" />
                <button onClick={handleJoinByCode} disabled={isJoining || joinCode.length < 4}
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-neutral-950 font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2">
                  {isJoining ? <><Zap className="w-4 h-4 animate-spin" /> Joining...</> : <><Users className="w-4 h-4" /> Join Room</>}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'world' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-neutral-950 dark:text-white">Public World Rooms</h2>
                  <p className="text-xs text-neutral-500">{worldRooms.length} open room{worldRooms.length !== 1 ? 's' : ''} waiting for opponents</p>
                </div>
                <button onClick={fetchWorldRooms} disabled={isFetching}
                  className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                  <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {worldRooms.length === 0 ? (
                <div className="p-12 text-center bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-3">
                  <Globe className="w-10 h-10 text-neutral-400 mx-auto opacity-50" />
                  <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white">No Open World Rooms</h3>
                  <p className="text-xs text-neutral-500">Create a public room above and wait for a challenger to join!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {worldRooms.map(room => (
                    <div key={room.id} className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">⏳ WAITING</span>
                        <span className="text-amber-500 font-bold">+{room.ratingStakes} ELO</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm font-bold text-neutral-700 dark:text-neutral-300 overflow-hidden">
                          {room.player1?.avatar ? <img src={room.player1.avatar} className="w-full h-full object-cover" alt="" /> : room.player1?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-neutral-950 dark:text-white">@{room.player1?.username}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">{room.player1?.rating} ELO</div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                        <span className="font-mono text-neutral-500 truncate">{room.problemTitle}</span>
                        <button onClick={() => handleJoinWorldRoom(room)}
                          className="ml-2 shrink-0 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs flex items-center gap-1 transition-all">
                          <span>Join</span><ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
