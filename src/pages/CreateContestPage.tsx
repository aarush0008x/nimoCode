import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, Plus, Check, Lock, UserCheck } from 'lucide-react';
import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';

export const CreateContestPage: React.FC = () => {
  const { problems, addContest } = useDb();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [prize1, setPrize1] = useState('$500 Amazon Gift Card');
  const [prize2, setPrize2] = useState('$250 Swag Pack');
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 pt-36 pb-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mx-auto text-amber-500">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-neutral-950 dark:text-white">Sign In Required to Host Contest</h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            You must be logged in with a real NimoCode account to organize custom contests, select problem sets, and set prize pools.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>Sign In</span>
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const toggleProblemSelect = (id: string) => {
    setSelectedProblemIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const contestProblems = selectedProblemIds.map((pId, idx) => {
      const prob = problems.find(p => p.id === pId);
      return {
        id: pId,
        code: (['A', 'B', 'C', 'D', 'E'][idx % 5] as any),
        title: prob?.title || `Problem ${idx + 1}`,
        difficulty: prob?.difficulty || 'Medium',
        points: (idx + 1) * 500,
        solvedCount: 0
      };
    });

    addContest({
      title,
      subtitle: subtitle || 'Organizer Custom Speed Run',
      startTime: 'Starts Today at 20:00 UTC',
      durationMinutes,
      status: 'UPCOMING',
      prizes: [prize1, prize2].filter(Boolean),
      problems: contestProblems.length > 0 ? contestProblems : [
        { id: '1', code: 'A', title: 'Two Sum', difficulty: 'Easy', points: 500, solvedCount: 0 }
      ]
    });

    navigate('/contests');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 space-y-3 relative overflow-hidden shadow-2xl">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
          <Trophy className="w-4 h-4" />
          CONTEST ORGANIZER STUDIO
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Host a Custom NimoCode Contest</h1>
        <p className="text-xs text-neutral-400 leading-relaxed font-mono">
          Creating contest as @{user.username} • Saved directly to Realtime Database.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs text-xs font-bold">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-neutral-950 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
            1. General Contest Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-700 dark:text-neutral-300">Contest Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. NimoCode Algorithm Cup 2026"
                className="w-full mt-1.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-neutral-700 dark:text-neutral-300">Subtitle / Tagline</label>
              <input
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="e.g. 2-Hour Speed Sprint Challenge"
                className="w-full mt-1.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-neutral-700 dark:text-neutral-300">Duration (Minutes)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full mt-1.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="text-neutral-700 dark:text-neutral-300">1st Place Prize</label>
              <input
                type="text"
                value={prize1}
                onChange={e => setPrize1(e.target.value)}
                className="w-full mt-1.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-neutral-700 dark:text-neutral-300">2nd Place Prize</label>
              <input
                type="text"
                value={prize2}
                onChange={e => setPrize2(e.target.value)}
                className="w-full mt-1.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Problem Picker */}
        <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
              2. Select Contest Problem Set ({selectedProblemIds.length} Selected)
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono">Pick from MongoDB catalog</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
            {problems.slice(0, 10).map(prob => {
              const isSelected = selectedProblemIds.includes(prob.id);
              return (
                <div
                  key={prob.id}
                  onClick={() => toggleProblemSelect(prob.id)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 shadow-xs'
                      : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs">#{prob.number} {prob.title}</div>
                    <div className="text-[10px] opacity-70 font-mono">{prob.difficulty} • {prob.category}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => navigate('/contests')}
            className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Live Contest</span>
          </button>
        </div>
      </form>
    </div>
  );
};
