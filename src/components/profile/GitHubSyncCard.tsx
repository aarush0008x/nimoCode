import React, { useState } from 'react';
import { CheckCircle2, RefreshCw, GitBranch, ArrowUpRight, ShieldCheck, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

import { GitHubIcon } from '../common/SocialIcons';
import { useAuth } from '../../context/AuthContext';
import type { SyncResult } from '../../services/githubSync';
import confetti from 'canvas-confetti';


export const GitHubSyncCard: React.FC = () => {
  const { user, syncGitHubSolutions } = useAuth();
  const [repoName, setRepoName] = useState('aarush0008x/neetcode-solutions');
  const [syncTarget, setSyncTarget] = useState<number>(2000);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [progressState, setProgressState] = useState<{
    stage: string;
    percent: number;
    solvedCount: number;
    currentProblemTitle?: string;
  } | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  const handleSyncNow = async () => {
    if (isSyncing) return;
    setSyncError(null);
    setSyncResult(null);

    if (!user) {
      setSyncError('Please log in to your NimoCode account before syncing solutions.');
      return;
    }

    setIsSyncing(true);

    try {
      const result = await syncGitHubSolutions(
        repoName,
        syncTarget,
        (stage, percent, solvedCount, currentProblemTitle) => {
          setProgressState({ stage, percent, solvedCount, currentProblemTitle });
        }
      );

      setSyncResult(result);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      console.error('GitHub Sync failed:', err);
      setSyncError(err?.message || 'Failed to sync solutions from GitHub repository.');
    } finally {
      setIsSyncing(false);
      setProgressState(null);
    }
  };


  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-6 shadow-2xl relative overflow-hidden text-left">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-500 shadow-md">
            <GitHubIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">GitHub 2,000 Solutions Sync Engine</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                v2.0 Realtime
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Sync, verify algorithmic test cases, and implement accepted code from your GitHub repository.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>CONNECTED</span>
        </div>
      </div>

      {/* Preset Target Selector */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider font-mono">
          Select Sync Target Scope
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setSyncTarget(75)}
            className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${
              syncTarget === 75
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white">Blind 75 Core</span>
              <span className="text-[10px] font-mono font-bold">75 Probs</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">+3,750 XP ? Top FAANG</div>
          </button>

          <button
            type="button"
            onClick={() => setSyncTarget(150)}
            className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${
              syncTarget === 150
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white">NeetCode 150</span>
              <span className="text-[10px] font-mono font-bold">150 Probs</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">+12,500 XP ? Full Roadmap</div>
          </button>

          <button
            type="button"
            onClick={() => setSyncTarget(2000)}
            className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${
              syncTarget === 2000
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white">Full 2,000 Solutions</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-neutral-950">ALL</span>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono mt-1">+200,000+ XP ? Complete DSA</div>
          </button>
        </div>
      </div>

      {/* Target Repo Input & Trigger Button */}
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-wider font-mono">
            GitHub Repository URL or Handle
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-xs">github.com/</span>
              <input
                type="text"
                value={repoName.replace(/^https?:\/\/github\.com\//i, '')}
                onChange={e => setRepoName(e.target.value)}
                placeholder="aarush0008x/neetcode-solutions"
                className="w-full pl-26 pr-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-amber-500 text-xs font-mono font-bold"
              />

            </div>

            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-neutral-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying & Implementing...</span>
                </>
              ) : (
                <>
                  <GitBranch className="w-4 h-4" />
                  <span>Sync & Verify ({syncTarget} Solutions)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {syncError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center justify-between animate-fade-in">
          <span>⚠️ {syncError}</span>
          {!user && (
            <Link
              to="/login"
              className="px-3 py-1 rounded-xl bg-rose-500 text-white font-extrabold text-[10px]"
            >
              Sign In Now
            </Link>
          )}
        </div>
      )}

      {/* Real-time animated progress bar */}

      {isSyncing && progressState && (
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2.5 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-bold font-mono">
            <span className="text-amber-400 flex items-center gap-1.5 truncate">
              <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>{progressState.stage}</span>
            </span>
            <span className="text-white ml-2 shrink-0">{progressState.percent}%</span>
          </div>

          <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
            <div
              style={{ width: `${progressState.percent}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
            />
          </div>

          <div className="text-[10px] text-neutral-400 font-mono flex items-center justify-between">
            <span>Verified: <strong className="text-emerald-400">{progressState.solvedCount}</strong> / {syncTarget} problems</span>
            <span>Language: Python ? C++ ? Java ? JS</span>
          </div>
        </div>
      )}

      {/* Sync Success Summary Card */}
      {syncResult && (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 space-y-4 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-neutral-950 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">
                  {syncResult.totalSynced} Solutions Verified & Solved in NimoCode!
                </h4>
                <p className="text-[11px] text-emerald-300 font-sans">
                  All test cases passed. Solutions implemented directly in problem workspaces.
                </p>
              </div>
            </div>

            <a
              href={syncResult.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-white hover:underline flex items-center gap-1 shrink-0 font-mono font-bold bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800"
            >
              <span>GitHub Repo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-emerald-500/20">
              <div className="text-[10px] text-neutral-400 uppercase font-sans">Total Solved</div>
              <div className="text-sm font-extrabold text-white mt-0.5">+{syncResult.totalSynced}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-emerald-500/20">
              <div className="text-[10px] text-neutral-400 uppercase font-sans">XP Awarded</div>
              <div className="text-sm font-extrabold text-amber-400 mt-0.5">+{syncResult.xpEarned.toLocaleString()} XP</div>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-emerald-500/20">
              <div className="text-[10px] text-neutral-400 uppercase font-sans">New Level</div>
              <div className="text-sm font-extrabold text-emerald-400 mt-0.5">Level {syncResult.newLevel}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-emerald-500/20">
              <div className="text-[10px] text-neutral-400 uppercase font-sans">Global Rank</div>
              <div className="text-sm font-extrabold text-amber-500 mt-0.5">#{syncResult.newRank}</div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Link
              to="/problems"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-extrabold text-xs transition-all shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Solved Problems & Code Editor</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
