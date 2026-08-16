import React from 'react';
import { Link } from 'react-router-dom';
import { Percent, Layers, ChevronRight } from 'lucide-react';
import type { Problem } from '../../types';
import { DifficultyBadge } from '../common/DifficultyBadge';
import { StatusBadge } from '../common/StatusBadge';
import { useAuth } from '../../context/AuthContext';

interface ProblemCardProps {
  problem: Problem;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem }) => {
  const { user } = useAuth();

  // Dynamically compute solved status for the current logged-in user
  const isSolved = user
    ? user.solvedProblemIds?.includes(problem.id) || user.solvedProblemIds?.includes(problem.number.toString())
    : false;

  const currentStatus = isSolved ? 'solved' : 'todo';

  return (
    <Link
      to={`/problems/${problem.id}`}
      className="group block p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-0.5 transition-all duration-200 shadow-xs hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title and tags */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <StatusBadge status={currentStatus} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
                #{problem.number}
              </span>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                {problem.title}
              </h3>
              <DifficultyBadge difficulty={problem.difficulty} size="sm" />
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap text-xs text-neutral-500 dark:text-neutral-400">
              <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-950 font-semibold text-[11px] text-neutral-700 dark:text-neutral-300">
                {problem.category}
              </span>
              {problem.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-neutral-400 dark:text-neutral-500 text-[11px]">
                  • {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats & CTA */}
        <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800/60">
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-neutral-400" />
              <span>{problem.acceptanceRate}%</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-neutral-400" />
              <span>{(problem.totalSubmissions / 1000).toFixed(0)}k subs</span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 group-hover:bg-neutral-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-950 transition-all duration-200">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};
