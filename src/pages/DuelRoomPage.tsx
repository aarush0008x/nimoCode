import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swords, Trophy, Clock, ChevronLeft, ArrowRight, Zap, Users, Copy, Check } from 'lucide-react';
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

  // Match State
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

  // 5. Determine Player Perspective (Am I Player 1 or Player 2?)
  const isPlayer1 = roomData?.player1?.username && user?.username
    ? roomData.player1.username.toLowerCase() === user.username.toLowerCase()
    : true;

  const myPlayer = isPlayer1 ? roomData?.player1 : roomData?.player2;
  const opponent = isPlayer1 ? roomData?.player2 : roomData?.player1;

  const handleLanguageChange = (newLang: ProgrammingLanguage) => {
    setSelectedLang(newLang);
    setCode(problem.starterCode[newLang] || '');
  };

  const handleResetCode = () => {
    setCode(problem.starterCode[selectedLang] || '');
    setSubmission(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    const result = await runCodeExecution({ problem, language: selectedLang, code, isSubmission: false });
    setSubmission(result);
    setIsRunning(false);

    // Sync live progress with server
    if (matchId) {
      try {
        await fetch(getApiUrl(`/duels/${matchId}/progress`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user?.username || myPlayer?.username || 'Guest',
            status: result.status === 'Accepted' ? 'Passed Sample Tests ⚡' : `Tests: ${result.passedCases}/${result.totalCases}`,
            testCasesPassed: result.passedCases || 0,
            totalCases: result.totalCases || 2
          })
        });
      } catch {}
    }
  };

  const handleSubmitCode = async () => {
    setIsRunning(true);
    const result = await runCodeExecution({ problem, language: selectedLang, code, isSubmission: true });
    setSubmission(result);
    setIsRunning(false);

    if (result.status === 'Accepted') {
      const winnerName = user?.username || myPlayer?.username || 'Player';
      setMatchWinner(winnerName);
      markProblemSolved(problem.id, problem.difficulty);

      if (matchId) {
        try {
          await fetch(getApiUrl(`/duels/${matchId}/submit`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ winner: winnerName })
          });
        } catch {}
      }

      confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 } });
    } else {
      // Sync attempt progress
      if (matchId) {
        try {
          await fetch(getApiUrl(`/duels/${matchId}/progress`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: user?.username || myPlayer?.username || 'Guest',
              status: `Attempt: ${result.passedCases}/${result.totalCases} cases`,
              testCasesPassed: result.passedCases || 0,
              totalCases: result.totalCases || 42
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
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] space-y-4">
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
            </div>
            <div className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
              <span>Difficulty: <strong className={problem.difficulty === 'Hard' ? 'text-rose-400' : problem.difficulty === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}>{problem.difficulty}</strong></span>
              {roomData?.code && (
                <span className="font-mono text-neutral-500">| Room Code: <strong className="text-amber-400 font-bold">{roomData.code}</strong></span>
              )}
            </div>
          </div>
        </div>

        {/* Live Timer & Stakes */}
        <div className="flex items-center gap-6 text-xs font-mono">
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

      {/* Arena Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[660px]">
        {/* Left Panel: Problem Statement & Opponent Live Card */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Live Opponent Progress Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Realtime Opponent Status</span>
              <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                opponent
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-amber-500/10 text-amber-500 animate-pulse'
              }`}>
                {opponent ? '🟢 LIVE OPPONENT CONNECTED' : '⏳ WAITING FOR OPPONENT TO JOIN'}
              </span>
            </div>

            {opponent ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-center text-xs overflow-hidden border border-neutral-200 dark:border-neutral-700">
                    {opponent.avatar ? (
                      <img src={opponent.avatar} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span>{opponent.username?.[0]?.toUpperCase() || 'O'}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-neutral-950 dark:text-white flex items-center gap-1.5">
                      <span>@{opponent.username}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 font-mono">Opponent</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">{opponent.rating || 1200} ELO Rating</div>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="font-bold text-neutral-800 dark:text-neutral-200">
                    {roomData?.winner ? `🏆 @${roomData.winner} submitted` : (opponent.status || 'Coding...')}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Passed: <strong className="text-amber-500">{opponent.testCasesPassed || 0}</strong>/{opponent.totalCases || 2} Test Cases
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-dashed border-neutral-300 dark:border-neutral-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-950 dark:text-white">Waiting for real player...</div>
                    <div className="text-[10px] text-neutral-500">Share code with a friend to duel</div>
                  </div>
                </div>
                {roomData?.code && (
                  <button
                    onClick={handleCopyRoomCode}
                    className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> {roomData.code}</>}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Problem Details */}
          <div className="flex-1 p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-y-auto max-h-[580px] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-950 dark:text-white">#{problem.number || problem.id} {problem.title}</h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                problem.difficulty === 'Hard' ? 'text-rose-500 bg-rose-500/10' : problem.difficulty === 'Medium' ? 'text-amber-500 bg-amber-500/10' : 'text-emerald-500 bg-emerald-500/10'
              }`}>{problem.difficulty}</span>
            </div>
            <div className="whitespace-pre-wrap text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {problem.description}
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Sample Test Cases &amp; Examples</h4>
              {problem.examples?.map((ex: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
                  <div>Input: {ex.input}</div>
                  <div className="text-emerald-500 font-bold">Output: {ex.output}</div>
                  {ex.explanation && <div className="text-neutral-400 text-[11px] mt-1">{ex.explanation}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex-1 min-h-[460px]">
            <CodeEditor
              language={selectedLang}
              code={code}
              onChange={setCode}
              onLanguageChange={handleLanguageChange}
              onReset={handleResetCode}
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

      {/* VICTORY / DEFEAT MODAL */}
      {matchWinner && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 w-full max-w-lg space-y-6 shadow-2xl animate-fade-in text-center">
            {isMyVictory ? (
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto shadow-inner">
                <Swords className="w-8 h-8" />
              </div>
            )}

            <div className="space-y-1">
              <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold border ${
                isMyVictory ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
              }`}>
                {isMyVictory ? 'VICTORY CLAIMED 🏆' : 'MATCH CONCLUDED ⚔️'}
              </span>
              <h2 className="text-2xl font-extrabold text-neutral-950 dark:text-white pt-2">
                {isMyVictory ? 'You Won the 1v1 Code Duel!' : `@${matchWinner} Won the Match!`}
              </h2>
              <p className="text-xs text-neutral-500">
                {isMyVictory
                  ? 'You submitted the accepted solution before your opponent and claimed the match victory.'
                  : `@${matchWinner} submitted a passing solution first. Practice more and challenge again!`
                }
              </p>
            </div>

            <div className={`p-4 rounded-2xl border text-xs font-mono font-bold flex items-center justify-center gap-2 ${
              isMyVictory
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'bg-neutral-100 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-400'
            }`}>
              <Zap className="w-4 h-4 fill-current" />
              <span>
                {isMyVictory
                  ? `+${roomData?.ratingStakes || 30} ELO Rating Gained • New Rating: ${(user?.rating || 1200) + (roomData?.ratingStakes || 30)}`
                  : `Rating Stake Concluded • Practice to reclaim your rank`
                }
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                to="/duels"
                className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-md flex items-center gap-2"
              >
                <span>Back to Duels Arena</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

