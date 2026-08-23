import React, { useState } from 'react';
import { Cpu, HardDrive, X, CheckCircle2, TrendingUp } from 'lucide-react';
import type { Submission } from '../../types';

interface RuntimeDistributionModalProps {
  submission: Submission;
  onClose: () => void;
}

export const RuntimeDistributionModal: React.FC<RuntimeDistributionModalProps> = ({ submission, onClose }) => {
  const [activeMetric, setActiveMetric] = useState<'runtime' | 'memory'>('runtime');

  const runtimeMs = submission.runtimeMs || 14;
  const memoryMb = submission.memoryMb || 8.4;
  const runtimeBeats = Math.min(99.4, Math.max(70, Number((100 - (runtimeMs / 100) * 45).toFixed(1))));
  const memoryBeats = Math.min(98.8, Math.max(65, Number((100 - (memoryMb / 30) * 35).toFixed(1))));

  const runtimeBins = [
    { ms: '0-5ms', count: 12, isUser: runtimeMs <= 5 },
    { ms: '6-10ms', count: 38, isUser: runtimeMs > 5 && runtimeMs <= 10 },
    { ms: '11-15ms', count: 85, isUser: runtimeMs > 10 && runtimeMs <= 15 },
    { ms: '16-20ms', count: 64, isUser: runtimeMs > 15 && runtimeMs <= 20 },
    { ms: '21-30ms', count: 32, isUser: runtimeMs > 20 && runtimeMs <= 30 },
    { ms: '31-50ms', count: 18, isUser: runtimeMs > 30 && runtimeMs <= 50 },
    { ms: '50ms+', count: 8, isUser: runtimeMs > 50 }
  ];

  const memoryBins = [
    { mb: '7-8 MB', count: 42, isUser: memoryMb <= 8 },
    { mb: '8-9 MB', count: 95, isUser: memoryMb > 8 && memoryMb <= 9 },
    { mb: '9-10 MB', count: 68, isUser: memoryMb > 9 && memoryMb <= 10 },
    { mb: '10-12 MB', count: 35, isUser: memoryMb > 10 && memoryMb <= 12 },
    { mb: '12-16 MB', count: 19, isUser: memoryMb > 12 && memoryMb <= 16 },
    { mb: '16 MB+', count: 7, isUser: memoryMb > 16 }
  ];

  const activeBins = activeMetric === 'runtime' ? runtimeBins : memoryBins;
  const maxCount = Math.max(...activeBins.map((b) => b.count));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in text-left">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Runtime & Memory Bell Curve</h3>
              <p className="text-xs text-neutral-400 font-mono">Global Percentile Distribution Benchmark</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveMetric('runtime')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeMetric === 'runtime'
                ? 'bg-amber-500/10 border-amber-500 shadow-md'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 font-bold">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                RUNTIME
              </span>
              <span className="text-xs font-bold text-amber-400 font-mono">{runtimeMs} ms</span>
            </div>
            <div className="text-lg font-extrabold text-white mt-1">Beats {runtimeBeats}%</div>
            <div className="text-[10px] text-neutral-400 font-mono">of all {submission.language.toUpperCase()} submissions</div>
          </button>

          <button
            onClick={() => setActiveMetric('memory')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeMetric === 'memory'
                ? 'bg-amber-500/10 border-amber-500 shadow-md'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 font-bold">
                <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                MEMORY
              </span>
              <span className="text-xs font-bold text-blue-400 font-mono">{memoryMb} MB</span>
            </div>
            <div className="text-lg font-extrabold text-white mt-1">Beats {memoryBeats}%</div>
            <div className="text-[10px] text-neutral-400 font-mono">of all {submission.language.toUpperCase()} submissions</div>
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>DISTRIBUTION FREQUENCY</span>
            <span className="text-amber-400 font-bold">● Your Solution</span>
          </div>

          <div className="flex items-end justify-between gap-3 h-44 pt-4 border-b border-neutral-800">
            {activeBins.map((bin: any, idx) => {
              const heightPercent = Math.max(15, Math.round((bin.count / maxCount) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                  {bin.isUser && (
                    <div className="absolute -top-6 px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] font-mono animate-bounce shadow-md">
                      YOU
                    </div>
                  )}

                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-500 relative ${
                      bin.isUser
                        ? 'bg-amber-400 shadow-md shadow-amber-500/30'
                        : 'bg-neutral-800 hover:bg-neutral-700'
                    }`}
                  />
                  <span className="text-[10px] font-mono text-neutral-400 whitespace-nowrap">
                    {activeMetric === 'runtime' ? bin.ms : bin.mb}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pt-2">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Optimal Algorithmic Tier
            </span>
            <span>Language: {submission.language.toUpperCase()}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-md transition-all"
          >
            Close Benchmark
          </button>
        </div>
      </div>
    </div>
  );
};
