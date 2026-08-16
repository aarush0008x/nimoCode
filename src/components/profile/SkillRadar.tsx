import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, AlertTriangle, ArrowRight, Brain } from 'lucide-react';
import type { Category } from '../../types';

interface SkillRadarProps {
  skillBreakdown: Record<Category, number>;
  weakArea: Category;
  recommendedTopic: string;
}

export const SkillRadar: React.FC<SkillRadarProps> = ({
  skillBreakdown,
  weakArea,
  recommendedTopic
}) => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-neutral-900 dark:text-white" />
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Skill Breakdown & AI Analysis</h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold font-mono border border-neutral-200 dark:border-neutral-700">
          Topic Mastery
        </span>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3">
        {Object.entries(skillBreakdown).map(([category, percent]) => (
          <div key={category} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-neutral-800 dark:text-neutral-200">{category}</span>
              <span className="font-mono text-neutral-500 font-bold">{percent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div
                style={{ width: `${percent}%` }}
                className={`h-full rounded-full transition-all duration-1000 ${
                  percent >= 75
                    ? 'bg-emerald-500'
                    : percent >= 50
                    ? 'bg-neutral-800 dark:bg-neutral-200'
                    : 'bg-amber-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Weakest Area & AI Diagnostics Box */}
      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Weakest Area Identified:</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono">
              {weakArea}
            </span>
          </div>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
          {recommendedTopic}
        </p>

        <Link
          to={`/problems?category=${encodeURIComponent(weakArea)}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs transition-all shadow-xs group"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Start Recommended Path</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
