import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, UserPlus } from 'lucide-react';

import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';
import { ContestTimer } from '../components/contest/ContestTimer';
import { ContestLeaderboard } from '../components/contest/ContestLeaderboard';
import { CodeEditor } from '../components/problem/CodeEditor';
import { SubmissionResult } from '../components/problem/SubmissionResult';
import type { ProgrammingLanguage, Submission } from '../types';
import { runCodeExecution } from '../utils/codeRunner';
import { getApiUrl } from '../utils/apiConfig';
import confetti from 'canvas-confetti';

export const ContestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { contests, problems } = useDb();
  const { user, markProblemSolved } = useAuth();

  const contest = contests.find(c => c.id === id) || contests[0];
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const selectedContestProb = contest.problems[activeProblemIdx] || contest.problems[0];

  // User problem scores in this contest
  const [userScores, setUserScores] = useState<Record<string, { solved: boolean; timeMs?: number; attempts: number }>>({});
  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    if (!user) return false;
    return Boolean(contest.registered || contest.registeredUsers?.some(u => u.username.toLowerCase() === user.username.toLowerCase()));
  });
  const [isRegistering, setIsRegistering] = useState(false);

  // Resolve full problem details from problem catalog
  const fullProblem = problems.find(p => p.id === selectedContestProb.id) || {
    id: selectedContestProb.id,
    number: 1,
    title: selectedContestProb.title,
    difficulty: selectedContestProb.difficulty,
    category: 'Algorithms',
    description: `Given the constraints of problem ${selectedContestProb.code}, construct an optimal algorithmic solution that executes within time limits.`,
    examples: [
      { input: 'nums = [2, 7, 11, 15]', output: '[0, 1]', explanation: 'Standard algorithmic evaluation.' }
    ],
    constraints: ['1 <= N <= 10^5', 'Time Limit: 2.0s', 'Memory: 256MB'],
    starterCode: {
      cpp: `// Solution for ${selectedContestProb.title}\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Write competitive code here\n    }\n};`,
      python: `# Solution for ${selectedContestProb.title}\nclass Solution:\n    def solve(self):\n        pass\n`,
      javascript: `// Solution for ${selectedContestProb.title}\nclass Solution {\n    solve() {\n        // Your code here\n    }\n}\n`,
      java: `// Solution for ${selectedContestProb.title}\nclass Solution {\n    public void solve() {\n        // Your code here\n    }\n}\n`
    },
    testCases: [{ id: 1, input: 'sample', expectedOutput: 'sample', isHidden: false }],
    totalSubmissions: 0,
    acceptanceRate: 100,
    solvedStatus: 'todo' as const,
    tags: ['Contest']
  };

  const [lang, setLang] = useState<ProgrammingLanguage>('cpp');
  const [code, setCode] = useState<string>((fullProblem.starterCode as any)?.[lang] || '');
  const [isRunning, setIsRunning] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    setCode((fullProblem.starterCode as any)?.[lang] || '');
    setSubmission(null);
  }, [selectedContestProb?.id, lang]);

  const handleLanguageChange = (newLang: ProgrammingLanguage) => {
    setLang(newLang);
    setCode((fullProblem.starterCode as any)?.[newLang] || '');
  };

  const handleRegisterContest = async () => {
    if (!user) {
      alert('Please sign in to register for this contest.');
      return;
    }
    setIsRegistering(true);
    try {
      await fetch(getApiUrl(`/contests/${contest.id}/register`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          name: user.name,
          avatar: user.avatar
        })
      });
      setIsRegistered(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
    } catch {}
    setIsRegistering(false);
  };

  const handleRun = async () => {
    setIsRunning(true);
    const res = await runCodeExecution({
      problem: fullProblem as any,
      language: lang,
      code,
      isSubmission: false
    });
    setSubmission(res);
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    const res = await runCodeExecution({
      problem: fullProblem as any,
      language: lang,
      code,
      isSubmission: true
    });
    setSubmission(res);
    setIsRunning(false);

    if (res.status === 'Accepted') {
      markProblemSolved(fullProblem.id, fullProblem.difficulty);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      // Update live contest score for current user
      const timeTaken = 10 + activeProblemIdx * 5;
      setUserScores(prev => ({
        ...prev,
        [selectedContestProb.code]: { solved: true, timeMs: timeTaken, attempts: 1 }
      }));

      if (user) {
        setIsRegistered(true);
        fetch(getApiUrl(`/contests/${contest.id}/score`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user.username,
            problemCode: selectedContestProb.code,
            points: selectedContestProb.points,
            penaltyMinutes: timeTaken,
            solved: true
          })
        }).catch(() => {});
      }
    }
  };

  return (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-6">
      {/* Contest Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-xl">
        <div className="flex items-center gap-4">
          <Link
            to="/contests"
            className="p-2 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors border border-neutral-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                contest.status === 'LIVE'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {contest.status === 'LIVE' ? '🔴 ARENA LIVE' : '⏳ UPCOMING CONTEST'}
              </span>
              <span className="text-xs text-neutral-400 font-mono">{contest.participantsCount || 1} Coders Registered</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight mt-1">{contest.title}</h1>
            <p className="text-xs text-neutral-400">{contest.subtitle} • {contest.startTime}</p>
          </div>
        </div>

        {/* Action / Registration & Timer */}
        <div className="flex items-center gap-3">
          {isRegistered ? (
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Registered Competitor</span>
            </div>
          ) : (
            <button
              onClick={handleRegisterContest}
              disabled={isRegistering}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-md transition-all disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isRegistering ? 'Registering...' : 'Register for Contest'}</span>
            </button>
          )}

          <ContestTimer initialSeconds={contest.durationMinutes * 60} />
        </div>
      </div>

      {/* 3-Column Contest Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[640px]">
        {/* LEFT COLUMN: Problem Set Sidebar (A-E) */}
        <div className="lg:col-span-3 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Contest Problem Set
            </h3>
            <span className="text-[11px] text-amber-500 font-mono font-bold">
              {contest.problems.length} Problems
            </span>
          </div>

          <div className="space-y-2">
            {contest.problems.map((prob, idx) => {
              const isSolved = userScores[prob.code]?.solved;
              return (
                <button
                  key={prob.id}
                  onClick={() => setActiveProblemIdx(idx)}
                  className={`w-full p-3 rounded-2xl text-left border transition-all ${
                    activeProblemIdx === idx
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 font-bold shadow-xs'
                      : 'bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center ${
                        isSolved ? 'bg-emerald-500 text-white' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {isSolved ? '✓' : prob.code}
                      </span>
                      <div className="truncate max-w-[140px]">
                        <div className="text-xs font-bold truncate">{prob.title}</div>
                        <div className="text-[10px] opacity-75 font-mono">{prob.points} pts</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold opacity-75">{prob.difficulty}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: Problem Statement & Code Editor */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="p-5 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs max-h-[320px] overflow-y-auto">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-amber-500">
                Problem {selectedContestProb.code} • {selectedContestProb.points} Points
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                fullProblem.difficulty === 'Hard' ? 'text-rose-500 bg-rose-500/10' : fullProblem.difficulty === 'Medium' ? 'text-amber-500 bg-amber-500/10' : 'text-emerald-500 bg-emerald-500/10'
              }`}>{fullProblem.difficulty}</span>
            </div>
            <h2 className="text-base font-bold text-neutral-950 dark:text-white">
              {fullProblem.title}
            </h2>
            <div className="whitespace-pre-wrap text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
              {fullProblem.description}
            </div>

            {fullProblem.examples && fullProblem.examples.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Example:</div>
                <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
                  <div>Input: {fullProblem.examples[0].input}</div>
                  <div className="text-emerald-500 font-bold">Output: {fullProblem.examples[0].output}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[360px]">
            <CodeEditor
              language={lang}
              code={code}
              onChange={setCode}
              onLanguageChange={handleLanguageChange}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onReset={() => setCode((fullProblem.starterCode as any)?.[lang] || '')}
              isRunning={isRunning}
            />
          </div>

          {submission && (
            <div className="min-h-[140px]">
              <SubmissionResult submission={submission} isRunning={isRunning} />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Contest Leaderboard */}
        <div className="lg:col-span-4">
          <ContestLeaderboard contest={contest} currentProblemScores={userScores} />
        </div>
      </div>
    </div>
  );
};


