import React, { useState } from 'react';
import { ThumbsUp, Eye, Copy, Check } from 'lucide-react';
import { useDb } from '../../context/DbContext';

interface SolutionExplorerProps {
  problemId: string;
}

export const SolutionExplorer: React.FC<SolutionExplorerProps> = ({ problemId }) => {
  const { solutions, upvoteSolution } = useDb();
  const filteredSolutions = solutions.filter(s => s.problemId === problemId || problemId === '1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-950 dark:text-white">Community Solutions ({filteredSolutions.length})</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Sort by:</span>
          <select className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold border border-neutral-200 dark:border-neutral-700">
            <option>Most Upvoted</option>
            <option>Best Runtime</option>
            <option>Most Elegant</option>
          </select>
        </div>
      </div>

      {filteredSolutions.map(sol => (
        <div
          key={sol.id}
          className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src={sol.authorAvatar} alt={sol.author} className="w-7 h-7 rounded-full object-cover shadow-xs" />
              <div>
                <div className="font-bold text-xs text-neutral-950 dark:text-white">@{sol.author}</div>
                <div className="text-[10px] text-neutral-400">{sol.createdAt}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {sol.isBestRuntime && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  Best Runtime ({sol.runtimeMs}ms)
                </span>
              )}
              {sol.isMostElegant && (
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-bold border border-neutral-300 dark:border-neutral-700">
                  Most Elegant
                </span>
              )}
            </div>
          </div>

          <h4 className="text-xs font-bold text-neutral-950 dark:text-white">{sol.title}</h4>

          <div className="relative font-mono text-xs">
            <pre className="p-3.5 rounded-xl bg-neutral-950 text-neutral-100 overflow-x-auto border border-neutral-800">
              <code>{sol.code}</code>
            </pre>
            <button
              onClick={() => handleCopy(sol.id, sol.code)}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            >
              {copiedId === sol.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">{sol.explanation}</p>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-500">
            <div className="flex items-center gap-4">
              <button
                onClick={() => upvoteSolution(sol.id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-bold transition-all"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
                <span>{sol.upvotes}</span>
              </button>

              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-neutral-400" />
                {sol.views} views
              </span>
            </div>

            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{sol.runtimeMs}ms</span>
          </div>
        </div>
      ))}
    </div>
  );
};
