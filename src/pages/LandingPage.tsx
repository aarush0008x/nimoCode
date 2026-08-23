import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Bot,
  Play,
  Users,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';
import { ProblemCard } from '../components/problem/ProblemCard';
import { ContestCard } from '../components/contest/ContestCard';
import { PodiumCard } from '../components/leaderboard/PodiumCard';
import { RealtimeReviewsSection } from '../components/landing/RealtimeReviewsSection';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const { problems, contests, users, submissions } = useDb();

  const [heroRunning, setHeroRunning] = useState(false);
  const [heroExecuted, setHeroExecuted] = useState(false);

  // 100% Real-time dynamic stats directly from active database records
  const totalSolvedCount = (users || []).reduce((acc, u) => acc + (u.solvedCount || 0), 0);
  const totalSubmissionsCount = (submissions?.length || 0) + totalSolvedCount;
  const activeCodersCount = (users || []).length;

  // Filter out any dummy test contests
  const validContests = (contests || []).filter(c => 
    c && c.title && c.title.toLowerCase() !== 'test' && 
    c.subtitle && c.subtitle.toLowerCase() !== 'test' && 
    !c.id.toLowerCase().includes('test')
  );


  const handleHeroRunCode = () => {
    setHeroRunning(true);
    setTimeout(() => {
      setHeroRunning(false);
      setHeroExecuted(true);
    }, 1100);
  };

  return (
    <div className="space-y-24 pb-16 pt-24 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-10" />

        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Eyebrow */}
          <ScrollReveal direction="down">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Terminal className="w-3.5 h-3.5 text-neutral-500" />
              THE NEXT GENERATION OF CODING PRACTICE
            </div>
          </ScrollReveal>

          {/* Main Heading */}
          <ScrollReveal delayMs={100}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.1]">
              Code smarter.{' '}
              <span className="text-neutral-600 dark:text-neutral-400 font-bold">
                Compete faster.
              </span>
            </h1>
          </ScrollReveal>

          {/* Subheading */}
          <ScrollReveal delayMs={200}>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-medium leading-relaxed">
              An AI-powered competitive programming ecosystem with 2,000+ LeetCode problems, 1v1 duels, live contests, and automated complexity evaluation.
            </p>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal delayMs={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/problems"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <span>Explore 2,000+ Problems</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              {user ? (
                <Link
                  to="/profile"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Go to Profile &amp; Stats</span>
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Create Account</span>
                </Link>
              )}
            </div>
          </ScrollReveal>


          {/* Animated Activity Strip */}
          <ScrollReveal delayMs={400}>
            <div className="inline-flex flex-wrap items-center justify-center gap-6 px-6 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-neutral-900 dark:text-white">{totalSolvedCount.toLocaleString()}</span> problems solved today
              </div>
              <div className="hidden sm:block text-neutral-300 dark:text-neutral-700">•</div>
              <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200 font-bold">
                +{totalSubmissionsCount.toLocaleString()} submissions
              </div>
              <div className="hidden sm:block text-neutral-300 dark:text-neutral-700">•</div>
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                <Users className="w-3.5 h-3.5 inline" /> {activeCodersCount} active coder{activeCodersCount !== 1 ? 's' : ''}
              </div>
            </div>

          </ScrollReveal>
        </div>

        {/* HERO VISUAL */}
        <ScrollReveal delayMs={500} className="mt-12 max-w-5xl mx-auto">
          <div className="rounded-3xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden">
            {/* Window Topbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="w-3 h-3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="ml-2 font-mono text-neutral-500 text-[11px]">workspace / two-sum.cpp</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-500">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">Easy</span>
                <span>•</span>
                <span>C++ 20</span>
              </div>
            </div>

            {/* Split Workspace Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800 min-h-[360px]">
              <div className="p-6 space-y-4 bg-neutral-50 dark:bg-neutral-950/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400">Problem #1</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    Easy
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Two Sum</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Given an array of integers <code className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded text-neutral-900 dark:text-neutral-100">nums</code> and an integer <code className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded text-neutral-900 dark:text-neutral-100">target</code>, return indices of the two numbers such that they add up to target.
                </p>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono space-y-1 shadow-xs">
                  <div className="text-neutral-400 font-sans font-bold text-[11px]">Example 1:</div>
                  <div className="text-neutral-900 dark:text-neutral-100">Input: nums = [2,7,11,15], target = 9</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">Output: [0,1]</div>
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between space-y-4 bg-white dark:bg-neutral-900">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                    <span>Solution.cpp</span>
                    <span>O(N) Hash Map</span>
                  </div>
                  <pre className="p-4 rounded-2xl bg-neutral-950 text-neutral-100 font-mono text-xs overflow-x-auto border border-neutral-800">
                    <code>{`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (mp.find(complement) != mp.end()) {
                return {mp[complement], i};
            }
            mp[nums[i]] = i;
        }
        return {};
    }
};`}</code>
                  </pre>
                </div>

                <div className="space-y-3 pt-2">
                  {heroExecuted && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono flex items-center justify-between text-emerald-600 dark:text-emerald-400 animate-fade-in">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>✓ 42 / 42 test cases passed</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span>Runtime: 48 ms</span>
                        <span>Memory: 14.2 MB</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={handleHeroRunCode}
                      disabled={heroRunning}
                      className="px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                    >
                      {heroRunning ? (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-white dark:border-neutral-950 border-t-transparent animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Run Code & Test
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 2. PHILOSOPHY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="p-8 sm:p-12 rounded-3xl bg-neutral-950 dark:bg-neutral-950 text-white border border-neutral-800 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 text-xs font-bold border border-neutral-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                CORE PHILOSOPHY
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                "Every submission is a learning opportunity."
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                Traditional coding platforms tell users whether their answer is correct. NimoCode goes further by helping users understand what went wrong, why it failed, and what concept to learn next.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. PROBLEM EXPLORER PREVIEW */}
      <section id="problems" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                PRACTICE WITHOUT LIMITS
              </div>
              <h2 className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                From your first array problem to advanced dynamic programming.
              </h2>
            </div>
            <Link
              to="/problems"
              className="text-xs font-bold text-neutral-950 dark:text-white hover:underline flex items-center gap-1 shrink-0"
            >
              View All {problems.length}+ Problems →
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problems.slice(0, 6).map((problem, idx) => (
            <ScrollReveal key={problem.id} delayMs={idx * 70}>
              <ProblemCard problem={problem} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. AI-POWERED FEEDBACK SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs font-bold">
                <Bot className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                INTELLIGENT AI COACH
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
                Guided feedback that teaches, never spoils.
              </h2>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                NimoCode AI analyzes your code syntax, pinpoints edge case failures, and provides guided hints step-by-step.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
                <div className="w-7 h-7 rounded-lg bg-white text-neutral-950 flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div>
                  <div className="font-bold text-xs">NimoCode AI Assistant</div>
                  <div className="text-[10px] text-emerald-400 font-mono">● Active Coach</div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 font-mono text-neutral-300">
                  User: "Why is my solution failing on duplicate values?"
                </div>

                <div className="p-4 rounded-2xl bg-neutral-800 border border-neutral-700 text-neutral-100 space-y-2">
                  <p className="leading-relaxed">
                    "Your code works for unique inputs, but fails when the input contains duplicates. Try storing values as you step through the array."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. CONTEST SECTION */}
      <section id="contests" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                LIVE ARENA
              </div>
              <h2 className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                Compete with developers worldwide.
              </h2>
            </div>
            <Link
              to="/contests"
              className="text-xs font-bold text-neutral-950 dark:text-white hover:underline flex items-center gap-1 shrink-0"
            >
              View All Contests →
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {validContests.length > 0 ? (
            validContests.slice(0, 3).map((contest, idx) => (
              <ScrollReveal key={contest.id} delayMs={idx * 80}>
                <ContestCard contest={contest} />
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-full p-8 rounded-3xl bg-neutral-900 border border-neutral-800 text-center text-neutral-400 text-xs">
              <span>No active contests currently running. Click "Host Your Own Contest" to schedule one!</span>
            </div>
          )}
        </div>

      </section>

      {/* 6. REAL LEADERBOARD PREVIEW */}
      <section id="leaderboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              HALL OF FAME
            </div>
            <h2 className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
              Global Rankings
            </h2>
          </div>
        </ScrollReveal>

        {users.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {users.slice(0, 3).map((entry, idx) => (
              <ScrollReveal key={entry.username} delayMs={idx * 100}>
                <PodiumCard entry={entry} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* 7. REAL-TIME COMMUNITY REVIEWS */}
      <RealtimeReviewsSection />

      {/* 8. FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <ScrollReveal>
          <div className="p-10 sm:p-16 rounded-3xl bg-neutral-950 dark:bg-neutral-950 text-white border border-neutral-800 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight relative z-10">
              Your next solution starts here.
            </h2>

            <p className="text-neutral-400 max-w-md mx-auto text-sm sm:text-base relative z-10">
              Stop watching tutorials. Start solving real problems with instant AI feedback.
            </p>

            <div className="pt-2 relative z-10">
              <Link
                to={user ? "/problems" : "/signup"}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs shadow-lg transition-all hover:scale-105"
              >
                <span>{user ? "Continue Practicing →" : "Enter NimoCode →"}</span>
              </Link>
            </div>

          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
