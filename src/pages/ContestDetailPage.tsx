import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { MOCK_CONTESTS } from '../data/contests';
import { ContestTimer } from '../components/contest/ContestTimer';
import { ContestLeaderboard } from '../components/contest/ContestLeaderboard';
import { CodeEditor } from '../components/problem/CodeEditor';
import type { ProgrammingLanguage } from '../types';

export const ContestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const contest = MOCK_CONTESTS.find(c => c.id === id) || MOCK_CONTESTS[1];

  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const selectedProblem = contest.problems[activeProblemIdx] || contest.problems[0];
  const [code, setCode] = useState(`// Solution for ${selectedProblem.title}\nclass Solution {\npublic:\n    void solve() {\n        // Your competitive code here\n    }\n};`);
  const [lang, setLang] = useState<ProgrammingLanguage>('cpp');

  return (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-6">
      {/* Contest Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-xl">
        <div className="flex items-center gap-4">
          <Link
            to="/contests"
            className="p-2 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
                🔴 ARENA LIVE
              </span>
              <span className="text-xs text-neutral-400 font-mono">{contest.participantsCount} Coders</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight mt-1">{contest.title}</h1>
          </div>
        </div>

        {/* Timer */}
        <ContestTimer initialSeconds={5400} />
      </div>

      {/* 3-Column Contest Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[640px]">
        {/* LEFT COLUMN: Problem Set Sidebar (A-E) */}
        <div className="lg:col-span-3 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Contest Problems
          </h3>

          <div className="space-y-2">
            {contest.problems.map((prob, idx) => (
              <button
                key={prob.id}
                onClick={() => setActiveProblemIdx(idx)}
                className={`w-full p-3 rounded-2xl text-left border transition-all ${
                  activeProblemIdx === idx
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 font-bold shadow-xs'
                    : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-neutral-200 dark:bg-neutral-800 font-mono text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-center">
                      {prob.code}
                    </span>
                    <div>
                      <div className="text-xs font-bold">{prob.title}</div>
                      <div className="text-[10px] opacity-75 font-mono">{prob.points} pts</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold opacity-75">{prob.difficulty}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CENTER COLUMN: Problem Statement & Code Editor */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="p-5 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-neutral-900 dark:text-white">
                Problem {selectedProblem.code}
              </span>
              <span className="font-mono text-neutral-400">{selectedProblem.points} Points</span>
            </div>
            <h2 className="text-lg font-bold text-neutral-950 dark:text-white">
              {selectedProblem.title}
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
              Given a sequence of positive integers, calculate the maximum score obtainable by choosing elements under lexicographical ordering constraints.
            </p>
          </div>

          <div className="flex-1 min-h-[360px]">
            <CodeEditor
              language={lang}
              code={code}
              onChange={setCode}
              onLanguageChange={setLang}
              onRun={() => alert('Contest test sample run completed: OK (12ms)')}
              onSubmit={() => alert('Contest submission accepted! Score +1000')}
              onReset={() => setCode('// Reset code')}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Live Contest Leaderboard */}
        <div className="lg:col-span-4">
          <ContestLeaderboard />
        </div>
      </div>
    </div>
  );
};
