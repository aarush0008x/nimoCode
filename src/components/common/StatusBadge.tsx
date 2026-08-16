import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

interface StatusBadgeProps {
  status?: 'solved' | 'attempted' | 'todo';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'todo' }) => {
  if (status === 'solved') {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
        <CheckCircle2 className="w-4 h-4" /> Solved
      </span>
    );
  }
  if (status === 'attempted') {
    return (
      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium text-xs">
        <Clock className="w-4 h-4" /> Attempted
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-neutral-400 dark:text-neutral-500 text-xs">
      <Circle className="w-3.5 h-3.5" /> Todo
    </span>
  );
};
