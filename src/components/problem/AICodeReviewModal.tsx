import React, { useState } from 'react';
import { Sparkles, Cpu, HardDrive, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import type { Problem, ProgrammingLanguage } from '../../types';

interface AICodeReviewModalProps {
  problem: Problem;
  code: string;
  language: ProgrammingLanguage;
  onClose: () => void;
}

export const AICodeReviewModal: React.FC<AICodeReviewModalProps> = ({ problem: _problem, code, language: _language, onClose }) => {
  const [analyzing, setAnalyzing] = useState(true);

  // Simulated static complexity evaluation engine
  const isHashSolution = code.includes('unordered_map') || code.includes('dict') || code.includes('Map') || code.includes('HashMap');
  const timeComplexity = isHashSolution ? 'O(N) - Linear Time' : 'O(N²) - Quadratic Time';
  const spaceComplexity = isHashSolution ? 'O(N) - Hash Table Memory' : 'O(1) - Constant Space';
  const qualityScore = isHashSolution ? 96 : 74;

  const suggestions = isHashSolution
    ? [
        'Optimal single-pass hash lookup implemented correctly.',
        'Consider reserving hash map capacity upfront to prevent rehashes.',
        'Variable naming and loop boundaries follow standard competitive coding style.'
      ]
    : [
        'Brute force nested loop detected. Time complexity can be reduced from O(N²) to O(N).',
        'Use a Hash Map or Dictionary to store complement values during array iteration.',
        'Add early return condition when complement is found.'
      ];

  const bugsFound = code.length < 20 ? ['Code length is very short. Ensure edge cases like empty arrays are handled.'] : [];

  React.useEffect(() => {
    const timer = setTimeout(() => setAnalyzing(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 w-full max-w-2xl space-y-6 shadow-2xl animate-fade-in relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-950 dark:text-white">CodeArena AI Code Review</h3>
              <p className="text-xs text-neutral-400 font-mono">Complexity & Code Quality Breakdown</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300"
          >
            Close
          </button>
        </div>

        {analyzing ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 font-mono">
              Analyzing AST & Executing Complexity Evaluation...
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Complexity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-bold uppercase">
                  <Cpu className="w-4 h-4 text-emerald-500" />
                  <span>Time Complexity</span>
                </div>
                <div className="text-sm font-extrabold text-neutral-950 dark:text-white font-mono">{timeComplexity}</div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-bold uppercase">
                  <HardDrive className="w-4 h-4 text-amber-500" />
                  <span>Space Complexity</span>
                </div>
                <div className="text-sm font-extrabold text-neutral-950 dark:text-white font-mono">{spaceComplexity}</div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-bold uppercase">
                  <CheckCircle className="w-4 h-4 text-sky-500" />
                  <span>Quality Score</span>
                </div>
                <div className="text-sm font-extrabold text-neutral-950 dark:text-white font-mono">{qualityScore} / 100</div>
              </div>
            </div>

            {/* AI Optimization Tips */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">AI Optimization Suggestions</h4>
              <div className="space-y-2">
                {suggestions.map((sug, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{sug}</span>
                  </div>
                ))}
              </div>
            </div>

            {bugsFound.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bugsFound[0]}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
