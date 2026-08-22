import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swords, Trophy, Clock, ChevronLeft, ArrowRight, Zap, Users } from 'lucide-react';
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

  const problem = problems[0]; // Problem #1 Two Sum
  const [selectedLang, setSelectedLang] = useState<ProgrammingLanguage>('cpp');
  const [code, setCode] = useState<string>(problem.starterCode.cpp);
  const [isRunning, setIsRunning] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);

  // Room / Match State
  const [timerSeconds, setTimerSeconds] = useState(600);
  const [roomData, setRoomData] = useState<any>(null);
  const [matchWinner, setMatchWinner] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll room state every 2s to get real opponent join + winner
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
  }, [matchId]);

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
  };

  const handleSubmitCode = async () => {
    setIsRunning(true);
    const result = await runCodeExecution({ problem, language: selectedLang, code, isSubmission: true });
    setSubmission(result);
    setIsRunning(false);

    if (result.status === 'Accepted') {
      const winnerName = user?.username || 'Player';
      setMatchWinner(winnerName);
      markProblemSolved(problem.id, problem.difficulty);

      // Notify backend of winner
      if (matchId) {
        try {
          await fetch(getApiUrl(`/duels/${matchId}/submit`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ winner: winnerName })
          });
        } catch {}
      }

      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] space-y-4">
      {/* Match Header */}
      <div className="p-4 rounded-2xl bg-neutral-950 text-white border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Link to="/duels" className="p-1.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase">
            <Swords className="w-4 h-4" />
            1v1 RANKED MATCH • {problem.title}
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
            <span>+30 ELO Stakes</span>
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
              <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Opponent Status</span>
              <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                roomData?.player2
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-amber-500/10 text-amber-500'
              }`}>
                {roomData?.player2 ? '🟢 IN MATCH' : '⏳ WAITING FOR OPPONENT'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-center text-xs overflow-hidden">
                  {roomData?.player2?.avatar
                    ? <img src={roomData.player2.avatar} className="w-full h-full object-cover" />
                    : roomData?.player2 ? <span>{roomData.player2.username?.[0]?.toUpperCase()}</span> : <Users className="w-4 h-4 opacity-40" />
                  }
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-950 dark:text-white">
                    {roomData?.player2 ? `@${roomData.player2.username}` : 'Waiting for opponent...'}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    {roomData?.player2 ? `${roomData.player2.rating} ELO` : 'Share your room code!'}
                  </div>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="font-bold text-neutral-800 dark:text-neutral-200">
                  {roomData?.winner ? `🏆 ${roomData.winner} won` : roomData?.player2 ? 'Coding...' : '—'}
                </div>
                {roomData?.code && (
                  <div className="text-[10px] text-neutral-400">Code: <span className="font-black text-amber-500">{roomData.code}</span></div>
                )}
              </div>
            </div>
          </div>


          {/* Problem Details */}
          <div className="flex-1 p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-y-auto max-h-[580px] space-y-4">
            <h2 className="text-sm font-bold text-neutral-950 dark:text-white">#{problem.number} {problem.title}</h2>
            <div className="whitespace-pre-wrap text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {problem.description}
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Examples</h4>
              {problem.examples.map((ex, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
                  <div>Input: {ex.input}</div>
                  <div className="text-emerald-500 font-bold">Output: {ex.output}</div>
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

      {/* VICTORY MODAL */}
      {matchWinner && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 w-full max-w-lg space-y-6 shadow-2xl animate-fade-in text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-mono text-xs font-bold border border-emerald-500/20">
                VICTORY CLAIMED
              </span>
              <h2 className="text-2xl font-extrabold text-neutral-950 dark:text-white pt-2">
                You Won the 1v1 Code Duel!
              </h2>
              <p className="text-xs text-neutral-500">
                You submitted a passing solution before your opponent and claimed the match victory.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-bold text-amber-500 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 fill-amber-500" />
              <span>+30 ELO Rating Gained • New Rating: {(user?.rating || 1200) + 30}</span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                to="/duels"
                className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-md flex items-center gap-2"
              >
                <span>Back to Duels Lobby</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
