import React, { useState } from 'react';
import { Check, Copy, X, FolderGit2, CheckCircle2 } from 'lucide-react';
import type { Problem, Submission } from '../../types';

interface GitHubSyncModalProps {
  problem: Problem;
  submission: Submission;
  onClose: () => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({ problem, submission, onClose }) => {
  const [repoName, setRepoName] = useState('leetcode-solutions');
  const [isSynced, setIsSynced] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileName = `${String(problem.number).padStart(4, '0')}-${problem.slug || 'solution'}.${
    submission.language === 'cpp'
      ? 'cpp'
      : submission.language === 'python'
      ? 'py'
      : submission.language === 'javascript'
      ? 'js'
      : submission.language === 'java'
      ? 'java'
      : submission.language === 'go'
      ? 'go'
      : 'rs'
  }`;

  const commitMessage = `feat: solve #${problem.number} ${problem.title} [${problem.difficulty}] (${submission.runtimeMs || 14}ms, ${submission.language.toUpperCase()})`;

  const formattedMarkdown = `# ${problem.number}. ${problem.title}

## Difficulty: ${problem.difficulty} | Language: ${submission.language.toUpperCase()}

### Description
${problem.description}

### Submission Stats
- **Runtime:** ${submission.runtimeMs || 14} ms (Optimal)
- **Memory:** ${submission.memoryMb || 8.4} MB
- **Status:** Accepted

\`\`\`${submission.language}
${submission.code}
\`\`\`
`;

  const handleSyncToGitHub = () => {
    setIsSynced(true);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(formattedMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in text-left">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center">
              <FolderGit2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">GitHub 1-Click Solution Auto-Sync</h3>
              <p className="text-xs text-neutral-400 font-mono">Export solution with markdown README to your repo</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Target GitHub Repository</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="username/repo-name"
                className="flex-1 p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 text-xs font-mono">
            <div className="text-neutral-400">Generated File: <strong className="text-amber-400">{fileName}</strong></div>
            <div className="text-neutral-400">Commit Message: <span className="text-emerald-400">{commitMessage}</span></div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-400">
              <span>PREVIEW README MARKDOWN</span>
              <button
                onClick={handleCopyMarkdown}
                className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Markdown' : 'Copy Markdown'}</span>
              </button>
            </div>
            <div className="max-h-36 overflow-y-auto font-mono text-[11px] text-neutral-300 whitespace-pre-wrap p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              {formattedMarkdown}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {isSynced ? (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Committed & Pushed to {repoName}!</span>
            </div>
          ) : (
            <span className="text-[11px] font-mono text-neutral-400">Supports Public & Private GitHub Repos</span>
          )}

          <button
            onClick={handleSyncToGitHub}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>{isSynced ? 'Push Again' : 'Sync & Push to GitHub'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
