import type { Contest, ContestLeaderboardEntry } from '../types';

export const MOCK_CONTESTS: Contest[] = [
  {
    id: 'weekly-42',
    title: 'Weekly Arena #42',
    subtitle: 'Regular weekly contest to sharpen your algorithm skills and boost your global rating.',
    startTime: '2026-08-20T20:00:00Z',
    endTime: '2026-08-20T21:30:00Z',
    durationMinutes: 90,
    participantsCount: 2481,
    status: 'UPCOMING',
    registered: true,
    prizes: ['$500 Amazon Gift Card', 'CodeArena Pro Lifetime', 'Exclusive Digital Badge'],
    problems: [
      { id: 'c1', code: 'A', title: 'Minimum Array Operations', points: 500, difficulty: 'Easy', solvedCount: 1890 },
      { id: 'c2', code: 'B', title: 'Subtree Sum Inversion', points: 1000, difficulty: 'Medium', solvedCount: 1240 },
      { id: 'c3', code: 'C', title: 'Maximum Path Weight in Directed Graph', points: 1500, difficulty: 'Medium', solvedCount: 680 },
      { id: 'c4', code: 'D', title: 'Dynamic Segment Tree Coloring', points: 2200, difficulty: 'Hard', solvedCount: 142 },
      { id: 'c5', code: 'E', title: 'Quantum State Transitions', points: 3000, difficulty: 'Hard', solvedCount: 29 }
    ]
  },
  {
    id: 'biweekly-18',
    title: 'Biweekly Speed Hack #18',
    subtitle: 'Fast-paced 60 minute challenge focused on arrays, string manipulation, and greedy algorithms.',
    startTime: '2026-08-16T08:00:00Z',
    endTime: '2026-08-16T09:30:00Z',
    durationMinutes: 90,
    participantsCount: 3820,
    status: 'LIVE',
    registered: true,
    prizes: ['$1,000 Cash Prize', 'CodeArena Swag Box', 'Direct Interview Referral'],
    problems: [
      { id: 'b1', code: 'A', title: 'Lexicographical Swap', points: 500, difficulty: 'Easy', solvedCount: 2950 },
      { id: 'b2', code: 'B', title: 'Grid Path with Max Multipliers', points: 1000, difficulty: 'Medium', solvedCount: 1830 },
      { id: 'b3', code: 'C', title: 'k-Factor Substrings', points: 1500, difficulty: 'Medium', solvedCount: 940 },
      { id: 'b4', code: 'D', title: 'Tree Decomposition Range Queries', points: 2500, difficulty: 'Hard', solvedCount: 88 }
    ]
  },
  {
    id: 'grand-prix-2026',
    title: 'CodeArena Grand Prix 2026',
    subtitle: 'Annual global championship bringing together top competitive programmers worldwide.',
    startTime: '2026-08-10T14:00:00Z',
    endTime: '2026-08-10T17:00:00Z',
    durationMinutes: 180,
    participantsCount: 8940,
    status: 'PAST',
    registered: false,
    prizes: ['$10,000 Grand Prize', 'Championship Trophy'],
    problems: [
      { id: 'g1', code: 'A', title: 'Bitwise Prefix Harmony', points: 500, difficulty: 'Easy', solvedCount: 6540 },
      { id: 'g2', code: 'B', title: 'Monotonic Stack Partition', points: 1000, difficulty: 'Medium', solvedCount: 4210 },
      { id: 'g3', code: 'C', title: 'Optimal Flow Network', points: 1800, difficulty: 'Medium', solvedCount: 2190 },
      { id: 'g4', code: 'D', title: 'String Alignment Dynamic Graph', points: 2600, difficulty: 'Hard', solvedCount: 630 },
      { id: 'g5', code: 'E', title: 'Tree Edit Distance with Operations', points: 3500, difficulty: 'Hard', solvedCount: 112 }
    ]
  }
];

export const MOCK_CONTEST_LEADERBOARD: ContestLeaderboardEntry[] = [
  {
    rank: 1,
    username: 'tourist_god',
    name: 'Gennady Korotkevich',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    country: 'BY',
    solvedCount: 4,
    score: 5500,
    penaltyMinutes: 42,
    problemScores: {
      A: { solved: true, timeMs: 4, attempts: 1 },
      B: { solved: true, timeMs: 12, attempts: 1 },
      C: { solved: true, timeMs: 25, attempts: 1 },
      D: { solved: true, timeMs: 41, attempts: 1 }
    }
  },
  {
    rank: 2,
    username: 'benq_dev',
    name: 'Benjamin Qi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    country: 'US',
    solvedCount: 4,
    score: 5500,
    penaltyMinutes: 58,
    problemScores: {
      A: { solved: true, timeMs: 5, attempts: 1 },
      B: { solved: true, timeMs: 15, attempts: 1 },
      C: { solved: true, timeMs: 31, attempts: 2 },
      D: { solved: true, timeMs: 52, attempts: 1 }
    }
  },
  {
    rank: 3,
    username: 'neal_wu',
    name: 'Neal Wu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    country: 'US',
    solvedCount: 4,
    score: 5500,
    penaltyMinutes: 69,
    problemScores: {
      A: { solved: true, timeMs: 6, attempts: 1 },
      B: { solved: true, timeMs: 18, attempts: 1 },
      C: { solved: true, timeMs: 34, attempts: 1 },
      D: { solved: true, timeMs: 65, attempts: 2 }
    }
  },
  {
    rank: 4,
    username: 'ecnerwala',
    name: 'Andrew He',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150',
    country: 'US',
    solvedCount: 3,
    score: 3000,
    penaltyMinutes: 44,
    problemScores: {
      A: { solved: true, timeMs: 7, attempts: 1 },
      B: { solved: true, timeMs: 16, attempts: 1 },
      C: { solved: true, timeMs: 39, attempts: 1 },
      D: { solved: false, attempts: 3 }
    }
  },
  {
    rank: 5,
    username: 'alex_code',
    name: 'Alexandre Rivera',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    country: 'FR',
    solvedCount: 3,
    score: 3000,
    penaltyMinutes: 52,
    problemScores: {
      A: { solved: true, timeMs: 8, attempts: 1 },
      B: { solved: true, timeMs: 22, attempts: 1 },
      C: { solved: true, timeMs: 48, attempts: 2 },
      D: { solved: false, attempts: 1 }
    }
  }
];
