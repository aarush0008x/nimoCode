import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swords, Trophy, Clock, ChevronLeft, ArrowRight, Eye, MessageSquare, Copy, Check } from 'lucide-react';
import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';

import { CodeEditor } from '../components/problem/CodeEditor';
import { SubmissionResult } from '../components/problem/SubmissionResult';
import type { ProgrammingLanguage, Submission } from '../types';
import { runCodeExecution } from '../utils/codeRunner';
import { getApiUrl } from '../utils/apiConfig';
import confetti from 'canvas-confetti';

export const DuelRoomPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { problems } = useDb();
  const { user, markProblemSolved } = useAuth();

  const [roomData, setRoomData] = useState<any>(null);
  const [selectedLang, setSelectedLang] = useState<ProgrammingLanguage>('cpp');
  const [code, setCode] = useState<string>('');
  const [codeInitialized, setCodeInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);

  // Match State & Spectator Mode
  const [isSpectator, setIsSpectator] = useState(() => window.location.search.includes('spectate=true'));
  const [spectatorReactions, setSpectatorReactions] = useState<{ id: string; emoji: string }[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(600);
  const [matchWinner, setMatchWinner] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Resolve problem dynamically from roomData
  const problem = (roomData?.problemId && problems.find(p => p.id === roomData.problemId))
    || (roomData?.problemTitle && problems.find(p => roomData.problemTitle.includes(p.title)))
    || problems[0];

  // 2. Initialize starter code once problem is known
  useEffect(() => {
    if (problem && (!codeInitialized || !code)) {
      setCode(problem.starterCode[selectedLang] || '');
      setCodeInitialized(true);
    }
  }, [problem?.id, selectedLang, codeInitialized]);

  // 3. Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 4. Poll room state every 2s for live opponent progress & winner
  useEffect(() => {
    if (!matchId) return;
    const poll = async () => {
      try {
        const res = await fetch(getApiUrl(`/duels/${matchId}`));
        if (res.ok) {
          const data = await res.json();
          setRoomData(data);
          if (data.winner && !matchWinner) {
            setMatchWinner(data.winner);
          }
        }
      } catch {}
    };
    poll();
    pollRef.current = setInterval(poll, 2000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [matchId, matchWinner]);

  // 5. Determine Player Perspective
  const isPlayer1 = roomData?.player1?.username && user?.username
    ? roomData.player1.username.toLowerCase() === user.username.toLowerCase()
    : true;

  const myPlayer = isPlayer1 ? roomData?.player1 : roomData?.player2;
  const opponent = isPlayer1 ? roomData?.player2 : roomData?.player1;

  const handleLanguageChange = (newLang: ProgrammingLanguage) => {
    setSelectedLang(newLang);
    setCode(problem.starterCode[newLang] || '// Write solution code here');
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    const result = await runCodeExecution({
      problem,
      language: selectedLang,
      code,
      isSubmission: false
    });
    setSubmission(result);
    setIsRunning(false);
  };

  const handleSubmitCode = async () => {
    setIsRunning(true);
    const result = await runCodeExecution({
      problem,
      language: selectedLang,
      code,
      isSubmission: true
    });
    setSubmission(result);
    setIsRunning(false);

    if (result.status === 'Accepted') {
      try {
        await markProblemSolved(problem.id, problem.difficulty);
      } catch {}

      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}

      setMatchWinner(user?.username || 'You');

      if (matchId) {
        try {
          await fetch(getApiUrl(`/duels/${matchId}/submit`), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: user?.username || 'You',
              passedCases: result.passedCases,
              totalCases: result.totalCases,
              status: 'Accepted'
            })
          });
        } catch {}
      }
    }
  };

  const handleCopyRoomCode = async () => {
    if (!roomData?.code) return;
    await navigator.clipboard.writeText(roomData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendReaction = (emoji: string) => {
    const reaction = { id: `${Date.now()}-${Math.random()}`, emoji };
    setSpectatorReactions(prev => [...prev, reaction]);
    setTimeout(() => {
      setSpectatorReactions(prev => prev.filter(r => r.id !== reaction.id));
    }, 2500);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isMyVictory = matchWinner && user?.username && (
    matchWinner.toLowerCase() === user.username.toLowerCase() ||
    matchWinner.toLowerCase() === (myPlayer?.username || '').toLowerCase()
  );

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] space-y-4 relative">
      {/* Floating Spectator Reactions */}
      <div className="fixed bottom-20 right-10 z-50 pointer-events-none flex flex-col gap-2">
        {spectatorReactions.map(r => (
          <div key={r.id} className="text-4xl animate-bounce">
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Match Header */}
      <div className="p-4 rounded-2xl bg-neutral-950 text-white border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Link to="/duels" className="p-1.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase">
              <Swords className="w-4 h-4" />
              1v1 REALTIME DUEL • #{problem.number || problem.id} {problem.title}
              {isSpectator && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  SPECTATOR BROADCAST
                </span>
              )}
            </div>
            <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
              <span>Difficulty: <strong className={problem.difficulty === 'Hard' ? 'text-rose-400' : problem.difficulty === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}>{problem.difficulty}</strong></span>
              {roomData?.code && (
                <span className="font-mono text-neutral-500 flex items-center gap-1">
                  | Room Code: <strong className="text-amber-400 font-bold">{roomData.code}</strong>
                  <button onClick={handleCopyRoomCode} className="p-1 hover:text-white" title="Copy code">
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </span>
              )}

            </div>
          </div>
        </div>

        {/* Live Timer, Spectator Toggle & Stakes */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => setIsSpectator(!isSpectator)}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 ${
              isSpectator
                ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isSpectator ? 'Spectating' : 'Spectator View'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-neutral-300">
            <Clock className="w-4 h-4 text-neutral-400" />
            <span className="font-bold text-amber-400 text-sm">{formatTimer(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-1 font-bold text-emerald-400">
            <Trophy className="w-4 h-4" />
            <span>+{roomData?.ratingStakes || (problem.difficulty === 'Hard' ? 50 : problem.difficulty === 'Medium' ? 35 : 25)} ELO Stakes</span>
          </div>
        </div>
      </div>

      {/* Spectator Reaction Bar */}
      {isSpectator && (
        <div className="p-3 rounded-2xl bg-neutral-900 border border-purple-500/20 flex items-center justify-between gap-4 text-xs font-mono">
          <span className="text-neutral-400 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            Spectator Cheering Reactions:
          </span>
          <div className="flex items-center gap-2">
            {['🔥', '👏', '⚡', '🤯', '🚀', '💯'].map(emoji => (
              <button
                key={emoji}
                onClick={() => handleSendReaction(emoji)}
                className="p-1.5 px-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:scale-125 transition-transform text-base"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Arena Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[660px]">
        {/* Left Panel: Problem Statement & Opponent Live Card */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Realtime Opponent Status</span>
              <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                opponent
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-amber-500/10 text-amber-500 animate-pulse'
              }`}>
                {opponent ? '● Connected' : '⏳ Waiting for Opponent'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-sm">
                  {opponent?.username ? opponent.username.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    {opponent?.username || 'Searching peer...'}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500">
                    Rating: {opponent?.rating || '1,450'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono uppercase text-neutral-400">Cases Passed</div>
                <div className="text-sm font-extrabold font-mono text-amber-500">
                  {opponent?.passedCases !== undefined ? `${opponent.passedCases} / ${opponent.totalCases || 1}` : '0 / 1'}
                </div>
              </div>
            </div>

            <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div
                style={{ width: opponent?.passedCases ? `${(opponent.passedCases / (opponent.totalCases || 1)) * 100}%` : '0%' }}
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Problem Statement Card */}
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex-1 overflow-y-auto max-h-[500px] space-y-4 shadow-xs text-left">
            <div>
              <div className="text-xs font-mono text-neutral-400 font-bold uppercase tracking-wider">PROBLEM STATEMENT</div>
              <h2 className="text-lg font-bold text-neutral-950 dark:text-white mt-1">
                #{problem.number || problem.id} {problem.title}
              </h2>
            </div>

            <div className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap font-medium">
              {problem.description}
            </div>

            {problem.examples && problem.examples.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono font-bold text-neutral-400 uppercase">Examples</div>
                {problem.examples.map((ex: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-xs space-y-1">

                    <div className="text-neutral-500">Input: {ex.input}</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">Output: {ex.output}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Editor & Live Console */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex-1 min-h-[460px]">
            <CodeEditor
              language={selectedLang}
              code={code}
              onChange={setCode}
              onLanguageChange={handleLanguageChange}
              onReset={() => setCode(problem.starterCode[selectedLang] || '')}
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
              isRunning={isRunning}
            />
          </div>

          <div className="min-h-[160px]">
            <SubmissionResult submission={submission} isRunning={isRunning} />
          </div>
        </div>
      </div>

      {/* Victory / Defeat Modal */}
      {matchWinner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6 animate-scale-up shadow-2xl text-white">
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-lg ${
              isMyVictory ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400' : 'bg-rose-500/20 border-2 border-rose-500 text-rose-400'
            }`}>
              {isMyVictory ? '🏆' : '💀'}
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                1v1 DUEL CONCLUDED
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                {isMyVictory ? 'Victory!' : 'Match Finished'}
              </h2>
              <p className="text-xs text-neutral-400">
                {isMyVictory
                  ? `Outstanding! You solved the problem first and earned +${roomData?.ratingStakes || 35} ELO Rating.`
                  : `${matchWinner} solved the challenge first. Better luck next duel!`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                to="/duels"
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>Find Another Duel</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
