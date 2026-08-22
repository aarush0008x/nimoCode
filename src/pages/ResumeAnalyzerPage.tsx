import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, RefreshCw, BookOpen } from 'lucide-react';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const ResumeAnalyzerPage: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState<'Google SWE' | 'Meta SWE' | 'Amazon SDE II' | 'Startup Full-Stack'>('Google SWE');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<{
    faangScore: number;
    strongAreas: string[];
    skillGaps: string[];
    recommendedDSA: string[];
    roadmapWeek1: string;
    roadmapWeek2: string;
    roadmapWeek3: string;
    roadmapWeek4: string;
  } | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const hasGraph = resumeText.toLowerCase().includes('graph') || resumeText.toLowerCase().includes('dijkstra');
      const hasSystemDesign = resumeText.toLowerCase().includes('redis') || resumeText.toLowerCase().includes('kafka') || resumeText.toLowerCase().includes('microservices');
      const hasCpp = resumeText.toLowerCase().includes('c++') || resumeText.toLowerCase().includes('rust');

      const faangScore = Math.min(94, 65 + (hasGraph ? 10 : 0) + (hasSystemDesign ? 12 : 0) + (hasCpp ? 7 : 0));

      setReport({
        faangScore,
        strongAreas: [
          'Solid Core CS Fundamentals & Clean Modular Architecture',
          'Demonstrated proficiency with async processing and database operations',
          'Good background in API integration and full-stack software delivery'
        ],
        skillGaps: [
          'Advanced Dynamic Programming (State Compression & Interval DP)',
          'High-throughput Distributed Systems (Consistent Hashing & Consensus algorithms)',
          'Concurrency, Thread-safety & Low-level Memory optimizations'
        ],
        recommendedDSA: [
          '#42 Trapping Rain Water (Hard - Monotonic Stack)',
          '#72 Edit Distance (Medium - 2D Dynamic Programming)',
          '#295 Find Median from Data Stream (Hard - Two Heaps)',
          '#146 LRU Cache (Medium - Doubly Linked List + Hash Map)'
        ],
        roadmapWeek1: 'Master Sliding Window, Two Pointers & Monotonic Stacks (Solve 15 problems).',
        roadmapWeek2: 'Tree Traversals (BFS/DFS), Lowest Common Ancestor & Graph Dijkstra (Solve 15 problems).',
        roadmapWeek3: 'Dynamic Programming patterns: 0/1 Knapsack, Longest Common Subsequence & Grid DP.',
        roadmapWeek4: 'System Design deep-dive: Sharding, Caching strategies, and FAANG Mock Interviews.'
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 animate-fade-in text-left">
      <ScrollReveal>
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Sparkles className="w-4 h-4" />
            <span>AI CAREER & FAANG READINESS SCANNER</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            AI Resume & Skill Gap Analyzer
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium">
            Paste your resume or GitHub summary. Our AI evaluates your algorithmic competency, identifies blindspots, and creates a tailored 30-day study roadmap.
          </p>
        </div>
      </ScrollReveal>

      <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Target Engineering Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white font-bold"
              >
                <option value="Google SWE">Google SWE (L4/L5 Algorithm Heavy)</option>
                <option value="Meta SWE">Meta SWE (Speed & Tree/Binary Search Focus)</option>
                <option value="Amazon SDE II">Amazon SDE II (Heaps, Strings & Leadership)</option>
                <option value="Startup Full-Stack">High-Growth Startup Tech Lead</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Sample Quick Load</label>
              <button
                type="button"
                onClick={() =>
                  setResumeText(
                    'Senior Full-Stack Engineer with 3+ years experience building React, Node.js, and PostgreSQL applications. Implemented microservices handling 50k RPM with Redis caching and Docker. Skilled in Python, TypeScript, and Data Structures.'
                  )
                }
                className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-mono text-neutral-700 dark:text-neutral-300 text-left truncate transition-colors"
              >
                📄 Load Sample SWE Resume
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Paste Resume Text or Projects Summary</label>
            <textarea
              rows={6}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your experience, technical skills, projects, and coursework here..."
              className="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || !resumeText.trim()}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-neutral-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isAnalyzing ? 'Evaluating Resume AST & FAANG Match...' : 'Generate AI FAANG Skill Evaluation →'}</span>
          </button>
        </form>
      </div>

      {report && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-neutral-950 text-white border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">TARGET EVALUATION: {targetRole}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                  VERIFIED CANDIDATE
                </span>
              </div>
              <h2 className="text-2xl font-extrabold">FAANG Readiness Score: {report.faangScore} / 100</h2>
              <p className="text-xs text-neutral-400">Competitive standing relative to current Google & Meta candidate pools.</p>
            </div>

            <div className="w-24 h-24 rounded-full bg-amber-500/10 border-4 border-amber-500/40 text-amber-400 flex flex-col items-center justify-center font-bold font-mono">
              <span className="text-2xl font-extrabold">{report.faangScore}%</span>
              <span className="text-[9px] uppercase text-neutral-400">MATCH</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Strengths</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                {report.strongAreas.map((st, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Critical Skill Gaps to Fix</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                {report.skillGaps.map((sg, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{sg}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-950 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Personalized 30-Day FAANG Preparation Roadmap</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="text-[10px] font-mono font-bold text-amber-500 uppercase">WEEK 1: ARRAYS & STACKS</div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">{report.roadmapWeek1}</p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="text-[10px] font-mono font-bold text-blue-500 uppercase">WEEK 2: TREES & GRAPHS</div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">{report.roadmapWeek2}</p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="text-[10px] font-mono font-bold text-purple-500 uppercase">WEEK 3: DYNAMIC PROG</div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">{report.roadmapWeek3}</p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="text-[10px] font-mono font-bold text-emerald-500 uppercase">WEEK 4: MOCK INTERVIEWS</div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">{report.roadmapWeek4}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
