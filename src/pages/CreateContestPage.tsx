import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, Plus, Check, Lock, UserCheck, FileText, Trash2, Sparkles, BookOpen, Search, Code, CheckCircle2 } from 'lucide-react';
import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';
import type { Difficulty, Category, Problem } from '../types';

interface ContestProblemItem {
  id: string;
  code: 'A' | 'B' | 'C' | 'D' | 'E';
  title: string;
  difficulty: Difficulty;
  points: number;
  isCustom?: boolean;
  description?: string;
  examples?: { input: string; output: string; explanation?: string }[];
  starterCode?: Record<string, string>;
  category?: Category;
}

export const CreateContestPage: React.FC = () => {
  const { problems, addContest, addProblem } = useDb();
  const { user } = useAuth();
  const navigate = useNavigate();

  // General Contest Information
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [prize1, setPrize1] = useState('$500 Amazon Gift Card');
  const [prize2, setPrize2] = useState('$250 Swag Pack');

  // Problems mode & list
  const [activeMode, setActiveMode] = useState<'catalog' | 'custom'>('custom');
  const [contestProblems, setContestProblems] = useState<ContestProblemItem[]>([]);
  const [searchCatalog, setSearchCatalog] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'All'>('All');

  // Custom Problem Creator Form State
  const [customTitle, setCustomTitle] = useState('');
  const [customDifficulty, setCustomDifficulty] = useState<Difficulty>('Medium');
  const [customCategory, setCustomCategory] = useState<Category>('Algorithms');
  const [customPoints, setCustomPoints] = useState(500);
  const [customDescription, setCustomDescription] = useState('');
  const [sampleInput, setSampleInput] = useState('nums = [2, 7, 11, 15], target = 9');
  const [sampleOutput, setSampleOutput] = useState('[0, 1]');
  const [sampleExplanation, setSampleExplanation] = useState('Because nums[0] + nums[1] == 9, we return [0, 1].');
  const [showCustomSuccess, setShowCustomSuccess] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 pt-36 pb-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mx-auto text-amber-500">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-neutral-950 dark:text-white">Sign In Required to Host Contest</h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            You must be logged in with a real NimoCode account to organize custom contests, author custom problem statements, and set prize pools.
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

  // Toggle problem from catalog
  const toggleCatalogProblem = (prob: Problem) => {
    setContestProblems(prev => {
      const exists = prev.find(p => p.id === prob.id);
      if (exists) {
        return prev.filter(p => p.id !== prob.id).map((p, idx) => ({
          ...p,
          code: (['A', 'B', 'C', 'D', 'E'][idx % 5] as any)
        }));
      }
      if (prev.length >= 5) {
        alert('A contest can have a maximum of 5 problems (A to E).');
        return prev;
      }
      const nextLetter = (['A', 'B', 'C', 'D', 'E'][prev.length % 5] as any);
      return [
        ...prev,
        {
          id: prob.id,
          code: nextLetter,
          title: prob.title,
          difficulty: prob.difficulty,
          points: (prev.length + 1) * 500,
          category: prob.category
        }
      ];
    });
  };

  // Add custom author question
  const handleAddCustomProblem = () => {
    if (!customTitle.trim() || !customDescription.trim()) {
      alert('Please enter a problem title and problem description.');
      return;
    }
    if (contestProblems.length >= 5) {
      alert('A contest can have a maximum of 5 problems (A to E).');
      return;
    }

    const customId = `custom-prob-${Date.now()}`;
    const nextLetter = (['A', 'B', 'C', 'D', 'E'][contestProblems.length % 5] as any);

    const newCustomProbItem: ContestProblemItem = {
      id: customId,
      code: nextLetter,
      title: customTitle.trim(),
      difficulty: customDifficulty,
      points: customPoints,
      isCustom: true,
      category: customCategory,
      description: customDescription.trim(),
      examples: [
        {
          input: sampleInput.trim() || 'nums = [1, 2, 3]',
          output: sampleOutput.trim() || '6',
          explanation: sampleExplanation.trim()
        }
      ],
      starterCode: {
        cpp: `// Solution for ${customTitle}\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Your solution code here\n    }\n};`,
        python: `# Solution for ${customTitle}\nclass Solution:\n    def solve(self):\n        pass\n`,
        javascript: `// Solution for ${customTitle}\nclass Solution {\n    solve() {\n        // Your code here\n    }\n}\n`,
        java: `// Solution for ${customTitle}\nclass Solution {\n    public void solve() {\n        // Your code here\n    }\n}\n`
      }
    };

    // Save to global problem database so it is executable in workspace
    addProblem({
      number: problems.length + 1,
      title: newCustomProbItem.title,
      slug: newCustomProbItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      difficulty: newCustomProbItem.difficulty,
      category: newCustomProbItem.category || 'Algorithms',
      description: newCustomProbItem.description || '',
      examples: newCustomProbItem.examples || [],
      constraints: ['1 <= N <= 10^5', 'Time Limit: 2.0s', 'Memory Limit: 256MB'],
      hints: ['Analyze edge cases and optimal time complexity before writing solution.'],
      starterCode: newCustomProbItem.starterCode as any,
      testCases: [
        { id: 1, input: sampleInput, expectedOutput: sampleOutput, isHidden: false }
      ],
      tags: ['Contest', customCategory]
    });

    setContestProblems(prev => [...prev, newCustomProbItem]);

    // Reset Form
    setCustomTitle('');
    setCustomDescription('');
    setSampleInput('');
    setSampleOutput('');
    setSampleExplanation('');
    setShowCustomSuccess(true);
    setTimeout(() => setShowCustomSuccess(false), 2500);
  };

  const removeProblem = (id: string) => {
    setContestProblems(prev =>
      prev.filter(p => p.id !== id).map((p, idx) => ({
        ...p,
        code: (['A', 'B', 'C', 'D', 'E'][idx % 5] as any)
      }))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (contestProblems.length === 0) {
      alert('Please add at least 1 problem to the contest (from catalog or create your own custom question).');
      return;
    }

    addContest({
      title: title.trim(),
      subtitle: subtitle.trim() || `Organized by @${user.username}`,
      startTime: 'Starts Today at 20:00 UTC',
      durationMinutes,
      status: 'UPCOMING',
      prizes: [prize1, prize2].filter(Boolean),
      problems: contestProblems.map(p => ({
        id: p.id,
        code: p.code,
        title: p.title,
        difficulty: p.difficulty,
        points: p.points,
        solvedCount: 0
      }))
    });

    navigate('/contests');
  };

  const filteredCatalog = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchCatalog.toLowerCase()) ||
      p.category.toLowerCase().includes(searchCatalog.toLowerCase()) ||
      p.number.toString().includes(searchCatalog);
    const matchesDiff = filterDifficulty === 'All' || p.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

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
          Author your own original problem statements &amp; questions, or pick from our catalog. Synced in real time to MongoDB Atlas.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-8 shadow-xs text-xs font-bold">
        {/* SECTION 1: CONTEST INFORMATION */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-neutral-950 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>1. General Contest Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-700 dark:text-neutral-300">Contest Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. NimoCode Algorithm Grand Prix 2026"
                className="w-full mt-1.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-neutral-700 dark:text-neutral-300">Subtitle / Tagline</label>
              <input
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="e.g. 2-Hour Speed Sprint • $750 Prize Pool"
                className="w-full mt-1.5 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-neutral-700 dark:text-neutral-300">Duration (Minutes)</label>
              <input
                type="number"
                min={15}
                max={360}
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

        {/* SECTION 2: PROBLEM SET BUILDER */}
        <div className="space-y-5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>2. Contest Problem Set ({contestProblems.length}/5 Added)</span>
              </h3>
              <p className="text-[11px] text-neutral-500 font-normal mt-0.5">
                Add up to 5 problems (A to E). You can write your own custom question statements or pick from the catalog.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setActiveMode('custom')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMode === 'custom'
                    ? 'bg-amber-500 text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Write Custom Question</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('catalog')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMode === 'catalog'
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse Catalog</span>
              </button>
            </div>
          </div>

          {/* ACTIVE PROBLEMS PILL ROW */}
          {contestProblems.length > 0 && (
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Assigned Contest Problems:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {contestProblems.map(cp => (
                  <div key={cp.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-500 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                        {cp.code}
                      </span>
                      <div className="truncate">
                        <div className="font-bold text-neutral-900 dark:text-white truncate">{cp.title}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {cp.difficulty} • {cp.points} pts {cp.isCustom && '• ✏️ Custom Problem'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProblem(cp.id)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-rose-500 transition-colors shrink-0 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MODE A: CUSTOM PROBLEM AUTHORING STUDIO ── */}
          {activeMode === 'custom' && (
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-neutral-950 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Author Custom Problem Statement</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-normal">
                    Create an original algorithmic question with your own problem statement, test cases, and points.
                  </div>
                </div>
                {showCustomSuccess && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[11px] font-bold flex items-center gap-1 border border-emerald-500/20 animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Added to Contest!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="text-neutral-700 dark:text-neutral-300">Problem Title *</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={e => setCustomTitle(e.target.value)}
                    placeholder="e.g. Minimum Flips in Binary Grid"
                    className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-neutral-700 dark:text-neutral-300">Points Value</label>
                  <input
                    type="number"
                    value={customPoints}
                    onChange={e => setCustomPoints(Number(e.target.value))}
                    step={100}
                    className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-700 dark:text-neutral-300">Difficulty</label>
                  <select
                    value={customDifficulty}
                    onChange={e => setCustomDifficulty(e.target.value as Difficulty)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-700 dark:text-neutral-300">Category / Topic</label>
                  <select
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value as Category)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="Arrays">Arrays</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                    <option value="Strings">Strings</option>
                    <option value="Binary Search">Binary Search</option>
                    <option value="Algorithms">Algorithms</option>
                    <option value="Math">Math</option>
                    <option value="Heap">Heap</option>
                    <option value="Stack">Stack</option>
                    <option value="Hash Table">Hash Table</option>
                  </select>
                </div>
              </div>

              {/* Problem Description Textarea */}
              <div>
                <label className="text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                  <span>Problem Statement &amp; Requirements *</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Supports Markdown &amp; Math</span>
                </label>
                <textarea
                  rows={4}
                  value={customDescription}
                  onChange={e => setCustomDescription(e.target.value)}
                  placeholder="Describe the problem, input constraints, edge cases, and expected output format..."
                  className="w-full mt-1 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-medium text-xs leading-relaxed"
                />
              </div>

              {/* Sample Test Case / Example */}
              <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sample Example &amp; Test Case</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-neutral-500">Sample Input</label>
                    <input
                      type="text"
                      value={sampleInput}
                      onChange={e => setSampleInput(e.target.value)}
                      placeholder="e.g. nums = [2, 7, 11, 15], target = 9"
                      className="w-full mt-1 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500">Expected Output</label>
                    <input
                      type="text"
                      value={sampleOutput}
                      onChange={e => setSampleOutput(e.target.value)}
                      placeholder="e.g. [0, 1]"
                      className="w-full mt-1 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-emerald-500 font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500">Explanation (Optional)</label>
                  <input
                    type="text"
                    value={sampleExplanation}
                    onChange={e => setSampleExplanation(e.target.value)}
                    placeholder="e.g. Because nums[0] + nums[1] == 9, we return [0, 1]."
                    className="w-full mt-1 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddCustomProblem}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Question to Problem Set</span>
              </button>
            </div>
          )}

          {/* ── MODE B: BROWSE CATALOG ── */}
          {activeMode === 'catalog' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchCatalog}
                    onChange={e => setSearchCatalog(e.target.value)}
                    placeholder="Search catalog by title, tag, number..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
                  />
                </div>
                <div className="flex gap-1">
                  {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFilterDifficulty(d)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                        filterDifficulty === d
                          ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950'
                          : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-500 border-neutral-200 dark:border-neutral-800'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto p-1">
                {filteredCatalog.slice(0, 30).map(prob => {
                  const isSelected = contestProblems.some(p => p.id === prob.id);
                  return (
                    <div
                      key={prob.id}
                      onClick={() => toggleCatalogProblem(prob)}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 shadow-xs'
                          : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="font-bold text-xs truncate">#{prob.number} {prob.title}</div>
                        <div className="text-[10px] opacity-70 font-mono">{prob.difficulty} • {prob.category}</div>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 opacity-40 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
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
            <span>Publish Live Contest ({contestProblems.length} Problems)</span>
          </button>
        </div>
      </form>
    </div>
  );
};

