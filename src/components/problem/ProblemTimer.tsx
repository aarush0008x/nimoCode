import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, ChevronDown } from 'lucide-react';

interface ProblemTimerProps {
  className?: string;
}

export const ProblemTimer: React.FC<ProblemTimerProps> = ({ className = '' }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [targetMinutes, setTargetMinutes] = useState<number | null>(null); // null = stopwatch mode, 20/30/45 = countdown
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(true);
  };

  const handleSelectTarget = (mins: number | null) => {
    setTargetMinutes(mins);
    setSeconds(0);
    setIsRunning(true);
    setShowOptions(false);
  };

  // Format time
  const formatTime = () => {
    if (targetMinutes) {
      const remainingSeconds = Math.max(0, targetMinutes * 60 - seconds);
      const m = Math.floor(remainingSeconds / 60);
      const s = remainingSeconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isOverTime = targetMinutes ? seconds >= targetMinutes * 60 : false;

  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all shadow-xs ${
        isOverTime
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 animate-pulse'
          : isRunning
          ? 'bg-neutral-900 text-white dark:bg-neutral-800 dark:text-neutral-100 border-neutral-700'
          : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
      }`}>
        <Clock className={`w-3.5 h-3.5 ${isRunning ? 'text-amber-400 animate-spin-slow' : 'text-neutral-400'}`} />
        
        <span className="min-w-[42px] text-center tracking-wider">{formatTime()}</span>

        <button
          onClick={toggleTimer}
          className="p-1 rounded-md hover:bg-white/10 dark:hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
          title={isRunning ? 'Pause Timer' : 'Resume Timer'}
        >
          {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
        </button>

        <button
          onClick={resetTimer}
          className="p-1 rounded-md hover:bg-white/10 dark:hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-3 h-3" />
        </button>

        <button
          onClick={() => setShowOptions(prev => !prev)}
          className="p-0.5 rounded text-neutral-400 hover:text-white transition-colors"
          title="Timer Mode"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Target Options Dropdown */}
      {showOptions && (
        <div className="absolute top-full left-0 mt-1.5 w-44 rounded-2xl bg-neutral-950 border border-neutral-800 p-2 shadow-2xl z-50 text-xs font-medium space-y-1">
          <div className="text-[10px] text-neutral-500 font-bold uppercase px-2 py-1">Timer Target</div>
          <button
            onClick={() => handleSelectTarget(null)}
            className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors ${
              targetMinutes === null
                ? 'bg-amber-500/10 text-amber-400 font-bold'
                : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            ?? Stopwatch (Count Up)
          </button>
          <button
            onClick={() => handleSelectTarget(20)}
            className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors ${
              targetMinutes === 20
                ? 'bg-amber-500/10 text-amber-400 font-bold'
                : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            ? 20 mins (Fast Speed)
          </button>
          <button
            onClick={() => handleSelectTarget(30)}
            className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors ${
              targetMinutes === 30
                ? 'bg-amber-500/10 text-amber-400 font-bold'
                : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            ?? 30 mins (Standard FAANG)
          </button>
          <button
            onClick={() => handleSelectTarget(45)}
            className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors ${
              targetMinutes === 45
                ? 'bg-amber-500/10 text-amber-400 font-bold'
                : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            ?? 45 mins (Hard Problem)
          </button>
        </div>
      )}
    </div>
  );
};
