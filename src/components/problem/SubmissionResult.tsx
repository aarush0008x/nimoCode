import React from 'react';
import { CheckCircle2, XCircle, Clock, Cpu, Loader2, Sparkles, TrendingUp, FolderGit2 } from 'lucide-react';
import type { Submission } from '../../types';
import { formatTimeMs, formatMemoryMb } from '../../utils/formatters';

interface SubmissionResultProps {
  submission: Submission | null;
  isRunning: boolean;
  onAskAI?: (prompt: string) => void;
  onOpenDistribution?: () => void;
  onOpenGitHubSync?: () => void;
}

export const SubmissionResult: React.FC<SubmissionResultProps> = ({
  submission,
  isRunning,
  onAskAI,
  onOpenDistribution,
  onOpenGitHubSync
}) => {

  if (isRunning) {
    return (
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center justify-center gap-3 shadow-xs">
        <Loader2 className="w-5 h-5 text-neutral-800 dark:text-neutral-200 animate-spin" />
        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          Compiling & running test cases against execution engine...
        </span>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-center text-xs text-neutral-500 shadow-xs">
        Run or Submit your code to see execution status, runtime performance, and test results.
      </div>
    );
  }

  const isSuccess = submission.status === 'Accepted';

  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-4 animate-fade-in shadow-xs">
      {/* Header status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
              <span>Accepted</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <XCircle className="w-4 h-4 fill-rose-500/20" />
              <span>{submission.status}</span>
            </div>
          )}
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            ({submission.passedCases} / {submission.totalCases} test cases passed)
          </span>
        </div>

        {/* Ask AI shortcut button */}
        {!isSuccess && onAskAI && (
          <button
            onClick={() => onAskAI(`Explain why my code produced status "${submission.status}". My output was "${submission.userOutput}" but expected "${submission.expectedOutput}".`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-xs font-bold border border-neutral-300 dark:border-neutral-700 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Analyze Error with AI
          </button>
        )}
      </div>

      {/* Metrics Row */}
      {isSuccess && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
            <Clock className="w-4 h-4 text-neutral-500" />
            <div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Runtime</div>
              <div className="text-xs font-bold text-neutral-900 dark:text-white font-mono">
                {formatTimeMs(submission.runtimeMs)}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
            <Cpu className="w-4 h-4 text-neutral-500" />
            <div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">Memory</div>
              <div className="text-xs font-bold text-neutral-900 dark:text-white font-mono">
                {formatMemoryMb(submission.memoryMb)}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 col-span-2 sm:col-span-1 flex items-center justify-center text-center">
            <div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">Beat Rate</div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                94.8% of coders
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-3 flex flex-wrap items-center gap-2 pt-1">
            {onOpenDistribution && (
              <button
                onClick={onOpenDistribution}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold border border-neutral-300 dark:border-neutral-700 transition-all"
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                <span>Runtime Distribution (Bell Curve)</span>
              </button>
            )}

            {onOpenGitHubSync && (
              <button
                onClick={onOpenGitHubSync}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold border border-neutral-300 dark:border-neutral-700 transition-all"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sync to GitHub Repo</span>
              </button>
            )}
          </div>
        </div>
      )}


      {/* Output / Diff display for failed case */}
      {!isSuccess && (
        <div className="space-y-3 font-mono text-xs">
          {submission.failedTestCase && (
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 block mb-1 font-semibold font-sans text-xs">Input:</span>
              <pre className="text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap">{submission.failedTestCase.input}</pre>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
              <span className="text-rose-600 dark:text-rose-400 block mb-1 font-semibold font-sans text-xs">Your Output:</span>
              <pre className="text-rose-700 dark:text-rose-300 font-semibold whitespace-pre-wrap">
                {submission.userOutput || '[]'}
              </pre>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <span className="text-emerald-600 dark:text-emerald-400 block mb-1 font-semibold font-sans text-xs">Expected Output:</span>
              <pre className="text-emerald-700 dark:text-emerald-300 font-semibold whitespace-pre-wrap">
                {submission.expectedOutput || '[]'}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
