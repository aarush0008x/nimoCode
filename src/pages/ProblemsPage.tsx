import React, { useState, useMemo } from 'react';
import { Search, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDb } from '../context/DbContext';
import { ProblemCard } from '../components/problem/ProblemCard';
import { DailyChallengeBanner } from '../components/common/DailyChallengeBanner';
import type { Category, Difficulty } from '../types';

const PROBLEMS_PER_PAGE = 50;

export const ProblemsPage: React.FC = () => {
  const { problems } = useDb();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('All');
  const [bookmarkedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('nimocode_bookmarked_problems') || '[]');
    } catch {
      return ['1', '2', '3'];
    }
  });
  const [currentPage, setCurrentPage] = useState(1);

  const companies = ['All', 'Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Netflix', 'Uber'];
  const playlists = [
    { id: 'All', label: 'All Problems' },
    { id: 'blind75', label: '🔥 Blind 75 Must Do' },
    { id: 'neetcode150', label: '⚡ NeetCode 150' },
    { id: 'amazon50', label: '📦 Amazon Top 50' },
    { id: 'bookmarked', label: '⭐ Bookmarked Problems' }
  ];

  // Filtered dataset
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.number.toString() === q ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q);

      const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesCompany =
        selectedCompany === 'All' ||
        p.tags.some(t => t.toLowerCase() === selectedCompany.toLowerCase()) ||
        (selectedCompany === 'Google' && p.number % 3 === 0) ||
        (selectedCompany === 'Meta' && p.number % 4 === 0) ||
        (selectedCompany === 'Amazon' && p.number % 2 === 0);

      const matchesPlaylist =
        selectedPlaylist === 'All' ||
        (selectedPlaylist === 'blind75' && p.number <= 75) ||
        (selectedPlaylist === 'neetcode150' && p.number <= 150) ||
        (selectedPlaylist === 'amazon50' && p.number % 2 === 0) ||
        (selectedPlaylist === 'bookmarked' && bookmarkedIds.includes(p.id));

      return matchesSearch && matchesDifficulty && matchesCategory && matchesCompany && matchesPlaylist;
    });
  }, [problems, searchQuery, selectedDifficulty, selectedCategory, selectedCompany, selectedPlaylist, bookmarkedIds]);

  const totalPages = Math.ceil(filteredProblems.length / PROBLEMS_PER_PAGE) || 1;

  // Current page sliced data
  const pageProblems = useMemo(() => {
    const start = (currentPage - 1) * PROBLEMS_PER_PAGE;
    return filteredProblems.slice(start, start + PROBLEMS_PER_PAGE);
  }, [filteredProblems, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categories: (Category | 'All')[] = [
    'All',
    'Arrays',
    'Strings',
    'Trees',
    'Graphs',
    'Dynamic Programming',
    'Binary Search',
    'Stack',
    'Hash Table',
    'Math',
    'Heap',
    'SQL',
    'Algorithms'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
      {/* Daily Challenge Banner */}
      <DailyChallengeBanner />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
            2,000+ LEETCODE PROBLEM LIBRARY
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            Problem Explorer ({problems.length.toLocaleString()} Problems)
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl font-medium">
            Search across the full collection of 2,000+ LeetCode problem statements with multi-language starter code and test cases.
          </p>
        </div>
      </div>

      {/* Curated LeetCode Playlists Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {playlists.map(pl => (
          <button
            key={pl.id}
            onClick={() => { setSelectedPlaylist(pl.id); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
              selectedPlaylist === pl.id
                ? 'bg-amber-500 text-neutral-950 shadow-md scale-102'
                : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/40'
            }`}
          >
            {pl.label}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Difficulty Segment */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-x-auto w-full md:w-auto">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => { setSelectedDifficulty(d); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  selectedDifficulty === d
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search 2,000+ problems by # or name..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>
        </div>

        {/* Company Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono shrink-0">FAANG Target:</span>
          {companies.map(c => (
            <button
              key={c}
              onClick={() => { setSelectedCompany(c); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
                selectedCompany === c
                  ? 'bg-amber-500 text-neutral-950 shadow-xs'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
              }`}
            >
              {c === 'All' ? 'All Companies' : `🔥 ${c}`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Counter & Active Filters Bar */}
      <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
        <div>
          Showing {((currentPage - 1) * PROBLEMS_PER_PAGE) + 1} - {Math.min(currentPage * PROBLEMS_PER_PAGE, filteredProblems.length)} of {filteredProblems.length.toLocaleString()} matching problems
        </div>
        <div>
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Problems List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pageProblems.map(problem => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-800 text-xs font-bold">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1 overflow-x-auto max-w-xs sm:max-w-md scrollbar-none">
            {Array.from({ length: Math.min(10, totalPages) }, (_, idx) => {
              let pageNum = idx + 1;
              if (totalPages > 10 && currentPage > 5) {
                pageNum = currentPage - 5 + idx;
                if (pageNum > totalPages) pageNum = totalPages - (9 - idx);
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                      : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
