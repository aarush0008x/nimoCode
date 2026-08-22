import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, X, Layers, Eye, Sliders } from 'lucide-react';
import type { Problem } from '../../types';

interface StepState {
  stepIndex: number;
  description: string;
  codeLine: number;
  array: number[];
  pointers: { name: string; index: number; color: string }[];
  hashMap: { key: string; val: string }[];
  stack: string[];
}

interface AlgorithmVisualizerModalProps {
  problem: Problem;
  onClose: () => void;
}

export const AlgorithmVisualizerModal: React.FC<AlgorithmVisualizerModalProps> = ({ problem, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speedMs, setSpeedMs] = useState(1200);

  const steps: StepState[] = [
    {
      stepIndex: 0,
      description: 'Initialize algorithm. Target = 9. Create empty Hash Map lookup table.',
      codeLine: 1,
      array: [2, 7, 11, 15],
      pointers: [{ name: 'i = 0', index: 0, color: '#f59e0b' }],
      hashMap: [],
      stack: ['twoSum(nums, target=9)']
    },
    {
      stepIndex: 1,
      description: 'Iterate index 0: Current value = 2. Complement needed = 9 - 2 = 7. Not found in map.',
      codeLine: 3,
      array: [2, 7, 11, 15],
      pointers: [{ name: 'i = 0 (val: 2)', index: 0, color: '#f59e0b' }],
      hashMap: [{ key: '2', val: 'index 0' }],
      stack: ['twoSum: loop iteration 0', 'map.set(2, 0)']
    },
    {
      stepIndex: 2,
      description: 'Iterate index 1: Current value = 7. Complement needed = 9 - 7 = 2. Found in map at index 0!',
      codeLine: 4,
      array: [2, 7, 11, 15],
      pointers: [
        { name: 'match: 0', index: 0, color: '#10b981' },
        { name: 'i = 1 (val: 7)', index: 1, color: '#10b981' }
      ],
      hashMap: [{ key: '2', val: 'index 0' }],
      stack: ['twoSum: loop iteration 1', 'map.has(2) -> TRUE']
    },
    {
      stepIndex: 3,
      description: 'SUCCESS! Target sum 9 formed by nums[0] (2) + nums[1] (7). Returning pair [0, 1].',
      codeLine: 5,
      array: [2, 7, 11, 15],
      pointers: [
        { name: 'Pair [0]', index: 0, color: '#10b981' },
        { name: 'Pair [1]', index: 1, color: '#10b981' }
      ],
      hashMap: [{ key: '2', val: 'index 0' }],
      stack: ['return [0, 1] -> Solved in O(N) time']
    }
  ];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {

      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speedMs, steps.length]);

  const active = steps[currentStep] || steps[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in text-left">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-4xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Algorithm & Memory Visualizer</h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold">
                  LIVE AST TRACER
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">#{problem.number} {problem.title} • Step-by-Step Pointers & Hash Table State</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
              STEP {active.stepIndex + 1} OF {steps.length}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-white">{active.description}</p>
          </div>
          <div className="shrink-0 text-right font-mono text-xs text-neutral-400">
            <div>Line: <strong className="text-amber-400">{active.codeLine}</strong></div>
          </div>
        </div>

        <div className="space-y-4 p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>INPUT ARRAY MEMORY SLOTS (`nums`)</span>
            <span>TARGET = 9</span>
          </div>

          <div className="flex items-center justify-center gap-4 py-4 overflow-x-auto">
            {active.array.map((val, idx) => {
              const matchedPointer = active.pointers.find((p) => p.index === idx);
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-mono font-extrabold text-lg transition-all duration-300 border-2 shadow-lg ${
                      matchedPointer
                        ? 'bg-amber-500/20 text-white scale-110'
                        : 'bg-neutral-950 text-neutral-300 border-neutral-800'
                    }`}
                    style={{ borderColor: matchedPointer ? matchedPointer.color : undefined }}
                  >
                    {val}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">idx [{idx}]</span>
                  {matchedPointer && (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold animate-bounce shadow-md"
                      style={{ backgroundColor: `${matchedPointer.color}20`, color: matchedPointer.color }}
                    >
                      {matchedPointer.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                HASH MAP LOOKUP TABLE (`seenMap`)
              </span>
              <span className="text-[10px] text-neutral-400">{active.hashMap.length} Keys</span>
            </div>

            <div className="space-y-1.5 min-h-[70px]">
              {active.hashMap.length === 0 ? (
                <div className="text-xs font-mono text-neutral-600 py-3 text-center">Empty (No elements stored yet)</div>
              ) : (
                active.hashMap.map((entry, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-white flex justify-between items-center animate-fade-in"
                  >
                    <span className="text-amber-400 font-bold">Key: {entry.key}</span>
                    <span className="text-emerald-400">{entry.val}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-blue-400">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                EXECUTION CALL STACK
              </span>
              <span className="text-[10px] text-neutral-400">{active.stack.length} Frames</span>
            </div>

            <div className="space-y-1.5 min-h-[70px]">
              {active.stack.map((frame, i) => (
                <div
                  key={i}
                  className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-blue-300 truncate"
                >
                  ⚡ {frame}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 disabled:opacity-40 hover:bg-neutral-800 transition-colors"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-neutral-950" />}
              <span>{isPlaying ? 'Pause Animation' : 'Auto Play'}</span>
            </button>

            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 disabled:opacity-40 hover:bg-neutral-800 transition-colors"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
            <span>Speed:</span>
            {[800, 1200, 2000].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMs(s)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] ${
                  speedMs === s
                    ? 'bg-white text-neutral-950 font-bold border-white'
                    : 'border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {s === 800 ? 'Fast' : s === 1200 ? '1x' : 'Slow'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
