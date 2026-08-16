import React, { useState } from 'react';
import { GitCommit, CheckCircle2, RefreshCw, GitBranch, ArrowUpRight } from 'lucide-react';

export const GitHubSyncCard: React.FC = () => {
  const [repoName, setRepoName] = useState('aarush/leetcode-solutions');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState<string | null>(null);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncStatus('Pushed 1 new accepted solution to github.com/aarush/leetcode-solutions!');
    }, 1400);
  };

  return (
    <div className="p-6 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <GitCommit className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">GitHub Solution Sync</h3>
            <p className="text-xs text-neutral-400 font-mono">Auto-commit accepted LeetCode solutions</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>CONNECTED</span>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        <div className="space-y-1">
          <label className="text-[10px] text-neutral-400 font-bold uppercase">Target GitHub Repository</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={repoName}
              onChange={e => setRepoName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-amber-500 text-xs"
            />
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Sync Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {lastSyncStatus && (
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 text-[11px] font-mono flex items-center justify-between">
            <span>{lastSyncStatus}</span>
            <a
              href={`https://github.com/${repoName}`}
              target="_blank"
              rel="noreferrer"
              className="text-white hover:underline flex items-center gap-0.5"
            >
              <span>View Repo</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
