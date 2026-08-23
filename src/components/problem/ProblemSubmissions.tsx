import React, { useState } from 'react';
import { useDb } from '../../context/DbContext';
import type { ProgrammingLanguage, Submission } from '../../types';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Code2, Copy, Check, ArrowRight, Terminal } from 'lucide-react';




interface ProblemSubmissionsProps {
  problemId: string;
  onLoadCode?: (code: string, language: ProgrammingLanguage) => void;
}

export const ProblemSubmissions: React.FC<ProblemSubmissionsProps> = ({ problemId, onLoadCode }) => {
  const { submissions } = useDb();
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter submissions for this problem
  const problemSubmissions = submissions.filter(
    s => s.problemId === problemId || s.problemId === problemId.toString()
  );

  const acceptedCount = problemSubmissions.filter(s => s.status === 'Accepted').length;
  const bestRuntime = problemSubmissions
    .filter(s => s.status === 'Accepted' && s.runtimeMs !== undefined)
    .sort((a, b) => (a.runtimeMs || 0) - (b.runtimeMs || 0))[0]?.runtimeMs;

  const handleCopyCode = async (sub: Submission) => {
    await navigator.clipboard.writeText(sub.code);
    setCopiedId(sub.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: Submission['status']) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accepted
          </span>
        );
      case 'Wrong Answer':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold font-mono">
            <XCircle className="w-3.5 h-3.5" />
            Wrong Answer
          </span>
        );
      case 'Time Limit Exceeded':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold font-mono">
            <Clock className="w-3.5 h-3.5" />
            Time Limit Exceeded
          </span>
        );
      case 'Runtime Error':
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            Runtime Error
          </span>
        );
    }
  };

  if (problemSubmissions.length === 0) {
    return (
      <div className="py-12 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
          <Terminal className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">No Submissions Yet</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
            Write your solution in the Monaco editor and click <strong>Submit</strong> to record your first execution.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center font-mono">
        <div>
          <div className="text-[10px] text-neutral-400 uppercase font-bold">Total Attempts</div>
          <div className="text-sm font-extrabold text-neutral-900 dark:text-white mt-0.5">{problemSubmissions.length}</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400 uppercase font-bold">Accepted</div>
          <div className="text-sm font-extrabold text-emerald-500 mt-0.5">{acceptedCount}</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400 uppercase font-bold">Best Runtime</div>
          <div className="text-sm font-extrabold text-amber-500 mt-0.5">{bestRuntime ? `${bestRuntime} ms` : '—'}</div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-3">
        {problemSubmissions.map((sub, idx) => {
          const isSelected = selectedSub?.id === sub.id;
          return (
            <div
              key={sub.id || idx}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                isSelected
                  ? 'bg-neutral-50 dark:bg-neutral-950 border-amber-500/50 shadow-md'
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              {/* Header row */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {getStatusBadge(sub.status)}
                  <span className="px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-mono font-bold uppercase">
                    {sub.language}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-neutral-400">
                  {sub.timestamp || 'Just now'}
                </span>
              </div>

              {/* Metrics row */}
              <div className="flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-400 pt-1">
                <div className="flex items-center gap-4">
                  {sub.runtimeMs !== undefined && (
                    <span>
                      Runtime: <strong className="text-neutral-900 dark:text-white font-bold">{sub.runtimeMs} ms</strong>
                    </span>
                  )}
                  {sub.memoryMb !== undefined && (
                    <span>
                      Memory: <strong className="text-neutral-900 dark:text-white font-bold">{sub.memoryMb} MB</strong>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedSub(isSelected ? null : sub)}
                  className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Hide Code' : 'View Code'}</span>
                </button>
              </div>

              {/* Expanded Code & Actions */}
              {isSelected && (
                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase">
                      Submitted Solution ({sub.language})
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(sub)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-colors"
                      >
                        {copiedId === sub.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === sub.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      {onLoadCode && (
                        <button
                          onClick={() => onLoadCode(sub.code, sub.language)}
                          className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold transition-all"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>Load in Editor</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <pre className="p-3.5 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800 max-h-64">
                    <code>{sub.code}</code>
                  </pre>

                  {/* Failed testcase info if any */}
                  {sub.failedTestCase && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono space-y-1.5 text-left">
                      <div className="text-rose-400 font-bold uppercase text-[10px]">Failed Test Case:</div>
                      <div className="text-neutral-400">Input: <span className="text-neutral-200">{sub.failedTestCase.input}</span></div>
                      <div className="text-rose-400">Expected: {sub.failedTestCase.expected}</div>
                      <div className="text-rose-300 font-bold">Your Output: {sub.failedTestCase.actual}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
