import React, { useState } from 'react';
import { ThumbsUp, Eye, Copy, Check, Sparkles, Clock, HardDrive } from 'lucide-react';
import { useDb } from '../../context/DbContext';

import { getProblemSolution } from '../../data/leetcodeSolutions';
import type { ProgrammingLanguage } from '../../types';

interface SolutionExplorerProps {
  problemId: string;
}

export const SolutionExplorer: React.FC<SolutionExplorerProps> = ({ problemId }) => {
  const { solutions, upvoteSolution } = useDb();
  const filteredSolutions = solutions.filter(s => s.problemId === problemId || problemId === '1');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<ProgrammingLanguage>('cpp');

  const probNum = parseInt(problemId, 10) || 1;
  const officialSolution = getProblemSolution(probNum);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Official Verified Multi-Language Solution Card */}
      {officialSolution && (
        <div className="p-5 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <span>Verified Optimal Solution</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold">
                    PASSED ALL TESTS
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 font-sans">
                  {officialSolution.approach}
                </div>
              </div>
            </div>

            {/* Complexity Badges */}
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="px-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{officialSolution.timeComplexity}</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-sky-400" />
                <span>{officialSolution.spaceComplexity}</span>
              </span>
            </div>
          </div>

          {/* Language Selector Pills */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['cpp', 'python', 'java', 'javascript', 'go', 'rust'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                    selectedLang === lang
                      ? 'bg-amber-500 text-neutral-950 shadow-xs'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JS' : lang}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleCopy('official', officialSolution.code[selectedLang] || '')}
              className="px-3 py-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono flex items-center gap-1.5 border border-neutral-800 transition-colors"
            >
              {copiedId === 'official' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Block */}
          <div className="relative font-mono text-xs">
            <pre className="p-4 rounded-2xl bg-neutral-900 text-neutral-100 overflow-x-auto border border-neutral-800/80 leading-relaxed max-h-96">
              <code>{officialSolution.code[selectedLang] || '// Solution code not available in this language'}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Community Solutions */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
            Community Solutions ({filteredSolutions.length})
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Sort by:</span>
            <select className="px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold border border-neutral-200 dark:border-neutral-700">
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
    </div>
  );
};
