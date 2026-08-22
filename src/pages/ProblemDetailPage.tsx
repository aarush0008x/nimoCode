import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Code2,
  MessageSquare,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Layers,
  ArrowRight,
  Trophy,
  Zap,
  Lock,
  UserCheck
} from 'lucide-react';
import { useDb } from '../context/DbContext';
import { DifficultyBadge } from '../components/common/DifficultyBadge';
import { CodeEditor } from '../components/problem/CodeEditor';
import { SubmissionResult } from '../components/problem/SubmissionResult';
import { AIChat } from '../components/problem/AIChat';
import { SolutionExplorer } from '../components/problem/SolutionExplorer';
import { ProblemDiscussion } from '../components/problem/ProblemDiscussion';
import { ProblemTimer } from '../components/problem/ProblemTimer';
import { AICodeReviewModal } from '../components/problem/AICodeReviewModal';

import { AIDebuggerModal } from '../components/problem/AIDebuggerModal';
import type { ProgrammingLanguage, Submission } from '../types';
import { runCodeExecution } from '../utils/codeRunner';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { problems, addSubmission, updateProblem } = useDb();
  const { markProblemSolved, user } = useAuth();

  const problem = problems.find(p => p.id === id || p.number.toString() === id) || problems[0];

  const currentIndex = problems.findIndex(p => p.id === problem.id);
  const prevProblem = currentIndex > 0 ? problems[currentIndex - 1] : null;
  const nextProblem = currentIndex >= 0 && currentIndex < problems.length - 1 ? problems[currentIndex + 1] : null;

  const [activeTab, setActiveTab] = useState<'description' | 'solutions' | 'discussions'>('description');
  const [selectedLang, setSelectedLang] = useState<ProgrammingLanguage>('cpp');
  const [code, setCode] = useState<string>(problem.starterCode.cpp);
  const [isRunning, setIsRunning] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [rightTab, setRightTab] = useState<'editor' | 'ai'>('editor');
  const [openHintIndex, setOpenHintIndex] = useState<number | null>(null);
  const [showAcceptedModal, setShowAcceptedModal] = useState(false);
  const [showAIDebugger, setShowAIDebugger] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAIReviewModal, setShowAIReviewModal] = useState(false);

  const handleLanguageChange = (newLang: ProgrammingLanguage) => {
    setSelectedLang(newLang);
    setCode(problem.starterCode[newLang] || '// Write solution code here');
  };

  const handleResetCode = () => {
    setCode(problem.starterCode[selectedLang] || '');
    setSubmission(null);
  };

  const handleRunCode = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setIsRunning(true);
    setRightTab('editor');
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
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setIsRunning(true);
    setRightTab('editor');
    const result = await runCodeExecution({
      problem,
      language: selectedLang,
      code,
      isSubmission: true
    });
    setSubmission(result);
    setIsRunning(false);

    if (result.status === 'Accepted') {
      // 1. Mark Problem Solved & Update User Rating/XP in DB
      markProblemSolved(problem.id, problem.difficulty);

      // 2. Persist Realtime Submission Log to DB
      addSubmission({
        id: `sub-${Date.now()}`,
        problemId: problem.id,
        language: selectedLang,
        code,
        status: 'Accepted',
        runtimeMs: result.runtimeMs,
        memoryMb: result.memoryMb,
        timestamp: new Date().toLocaleTimeString()
      });

      // 3. Update Problem Submission Count in DB
      updateProblem(problem.id, {
        totalSubmissions: problem.totalSubmissions + 1,
        solvedStatus: 'solved'
      });

      setShowAcceptedModal(true);

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const goToNextProblem = () => {
    setShowAcceptedModal(false);
    if (nextProblem) {
      navigate(`/problems/${nextProblem.id}`);
    }
  };

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] space-y-4">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <Link
            to="/problems"
            className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-xs font-semibold flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Problems</span>
          </Link>

          <span className="text-neutral-300 dark:text-neutral-700">/</span>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400">#{problem.number}</span>
            <h1 className="text-sm font-bold text-neutral-900 dark:text-white">{problem.title}</h1>
            <DifficultyBadge difficulty={problem.difficulty} size="sm" />
          </div>
        </div>

        {/* Timer & Navigation Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <ProblemTimer />

          {prevProblem && (
            <Link
              to={`/problems/${prevProblem.id}`}
              className="p-1.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-xs font-bold flex items-center gap-1"
              title={`Previous Problem: #${prevProblem.number} ${prevProblem.title}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </Link>
          )}


          {nextProblem && (
            <Link
              to={`/problems/${nextProblem.id}`}
              className="p-1.5 px-3.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all text-xs font-extrabold flex items-center gap-1 shadow-xs"
              title={`Next Problem: #${nextProblem.number} ${nextProblem.title}`}
            >
              <span>Next Problem</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={() => setShowAIReviewModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Code Review</span>
          </button>

          <button
            onClick={() => setRightTab(rightTab === 'ai' ? 'editor' : 'ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              rightTab === 'ai'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 shadow-xs'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>NimoCode AI</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[680px]">
        {/* LEFT PANEL: Problem Details / Solutions / Discussions */}
        <div className="lg:col-span-5 flex flex-col bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 p-2 bg-neutral-100/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'description'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
              Description
            </button>
            <button
              onClick={() => setActiveTab('solutions')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'solutions'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-500" />
              Solutions
            </button>
            <button
              onClick={() => setActiveTab('discussions')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'discussions'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
              Discussions
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 p-5 overflow-y-auto max-h-[700px] space-y-6">
            {activeTab === 'description' && (
              <>
                {/* Meta stats */}
                <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Acceptance Rate: {problem.acceptanceRate}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Submissions: {(problem.totalSubmissions / 1000).toFixed(0)}k</span>
                  </div>
                </div>

                {/* Description Body */}
                <div className="prose dark:prose-invert text-xs leading-relaxed space-y-3">
                  <div className="whitespace-pre-wrap text-neutral-900 dark:text-neutral-100 font-medium">
                    {problem.description}
                  </div>
                </div>

                {/* Examples */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Examples</h4>
                  {problem.examples.map((ex, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-1.5 font-mono text-xs shadow-xs">
                      <div className="font-bold text-neutral-950 dark:text-white font-sans text-[11px]">Example {idx + 1}:</div>
                      <div className="text-neutral-800 dark:text-neutral-200"><span className="text-neutral-400">Input:</span> {ex.input}</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold"><span className="text-neutral-400 font-normal">Output:</span> {ex.output}</div>
                      {ex.explanation && <div className="text-neutral-500 text-[11px] pt-1 font-sans"><span className="font-bold">Explanation:</span> {ex.explanation}</div>}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Constraints</h4>
                  <ul className="list-disc list-inside space-y-1 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                    {problem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Guided Hints */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Lightbulb className="w-4 h-4" />
                    <span>Guided Hints ({problem.hints.length})</span>
                  </div>
                  <div className="space-y-2">
                    {problem.hints.map((hint, idx) => (
                      <div key={idx} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        <button
                          onClick={() => setOpenHintIndex(openHintIndex === idx ? null : idx)}
                          className="w-full p-3 bg-neutral-50 dark:bg-neutral-950 text-left text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-between"
                        >
                          <span>Hint {idx + 1}</span>
                          <span className="text-[10px] text-neutral-400">{openHintIndex === idx ? 'Hide' : 'Show'}</span>
                        </button>
                        {openHintIndex === idx && (
                          <div className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
                            {hint}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'solutions' && <SolutionExplorer problemId={problem.id} />}
            {activeTab === 'discussions' && <ProblemDiscussion problemId={problem.id} problemTitle={problem.title} />}
          </div>
        </div>


        {/* RIGHT PANEL: Code Editor or AI Assistant */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {rightTab === 'editor' ? (
            <>
              <div className="flex-1 min-h-[480px]">
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

              {/* Execution Console Results */}
              <div className="min-h-[160px]">
                <SubmissionResult submission={submission} isRunning={isRunning} />
              </div>
            </>
          ) : (
            <div className="h-full min-h-[600px] bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <AIChat problem={problem} currentCode={code} />
            </div>
          )}
        </div>
      </div>

      {/* LOGIN REQUIRED MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 w-full max-w-md space-y-6 shadow-2xl animate-fade-in text-center">
            <div className="w-14 h-14 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-neutral-950 dark:text-white">Sign In Required to Solve</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                You must be logged in with a real NimoCode account to run code, submit solutions, earn XP, gain rating, and save your progress to MongoDB.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200"
              >
                Cancel
              </button>

              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In</span>
              </Link>

              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-md"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ACCEPTED SOLUTION & REALTIME DB SUCCESS MODAL */}
      {showAcceptedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 w-full max-w-lg space-y-6 shadow-2xl animate-fade-in text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                ACCEPTED • PERSISTED TO REALTIME DB
              </span>
              <h2 className="text-2xl font-extrabold text-neutral-950 dark:text-white tracking-tight pt-2">
                Problem #{problem.number} Solved!
              </h2>
              <p className="text-xs text-neutral-500">
                Your code passed all hidden test cases and your rating progress was saved to the database.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs">
              <div>
                <div className="text-[10px] text-neutral-400 uppercase font-sans font-bold">Runtime</div>
                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                  {submission?.runtimeMs || 42}ms
                </div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400 uppercase font-sans font-bold">Rating Gained</div>
                <div className="font-mono font-bold text-amber-500 text-sm mt-0.5 flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5 fill-amber-500 inline" /> +15
                </div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-400 uppercase font-sans font-bold">XP Gained</div>
                <div className="font-mono font-bold text-neutral-950 dark:text-white text-sm mt-0.5 flex items-center justify-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-neutral-950 dark:fill-white inline" /> +50 XP
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowAcceptedModal(false)}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200"
              >
                Review Solution
              </button>

              {nextProblem ? (
                <button
                  onClick={goToNextProblem}
                  className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <span>Next Problem</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  to="/problems"
                  className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <span>Problem Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI CODE REVIEW MODAL */}
      {showAIReviewModal && (
        <AICodeReviewModal
          problem={problem}
          code={code}
          language={selectedLang}
          onClose={() => setShowAIReviewModal(false)}
        />
      )}

      {/* AI DEBUGGER MODAL */}
      {showAIDebugger && (
        <AIDebuggerModal
          problem={problem}
          code={code}
          language={selectedLang}
          onClose={() => setShowAIDebugger(false)}
        />
      )}
    </div>
  );
};
