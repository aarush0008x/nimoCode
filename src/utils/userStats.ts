import type { Category } from '../types';
import { db } from '../services/db';


export const ALL_CATEGORIES: Category[] = [
  'Arrays',
  'Strings',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'SQL',
  'Algorithms',
  'Binary Search',
  'Stack',
  'Hash Table',
  'Math',
  'Heap'
];

export const calculateSkillStats = (solvedProblemIds: string[] = []) => {
  const problems = db.getProblems();
  const categoryCounts: Record<string, number> = {};

  ALL_CATEGORIES.forEach(cat => {
    categoryCounts[cat] = 0;
  });

  solvedProblemIds.forEach(id => {
    const prob = problems.find(p => p.id === id);
    if (prob && categoryCounts[prob.category] !== undefined) {
      categoryCounts[prob.category]++;
    }
  });

  const skillBreakdown: Record<Category, number> = {} as any;
  let minMastery = 999;
  let weakestCategory: Category = 'Dynamic Programming';

  ALL_CATEGORIES.forEach(cat => {
    const count = categoryCounts[cat] || 0;
    // Dynamic percentage: 5% baseline + 15% per solved problem up to 100%
    const mastery = Math.min(100, Math.round(count * 15 + (count > 0 ? 10 : 5)));
    skillBreakdown[cat] = mastery;

    if (mastery < minMastery) {
      minMastery = mastery;
      weakestCategory = cat;
    }
  });

  const recommendedAdvice: Record<string, string> = {
    'Dynamic Programming': 'Practice memoization and bottom-up DP problems like 0/1 Knapsack and Longest Common Subsequence.',
    'Arrays': 'Master two-pointer and sliding window techniques on contiguous subarrays.',
    'Strings': 'Work on string hashing, pattern matching (KMP), and frequency counting.',
    'Trees': 'Practice tree traversals (pre/in/post/level order) and lowest common ancestor.',
    'Graphs': 'Focus on BFS/DFS cycle detection, topological sort, and Dijkstra algorithm.',
    'SQL': 'Practice complex JOINs, window functions (ROW_NUMBER, RANK), and aggregations.',
    'Algorithms': 'Review greedy strategies, divide & conquer, and backtracking patterns.',
    'Binary Search': 'Practice monotonic search spaces and binary searching the answer.',
    'Stack': 'Work on monotonic stacks for next greater element problems.',
    'Hash Table': 'Strengthen hash map lookups, collision handling, and grouping techniques.',
    'Math': 'Review modular arithmetic, prime factorizations, and combinatorics.',
    'Heap': 'Practice top-K frequent elements and median in a data stream patterns.'
  };

  return {
    skillBreakdown,
    weakArea: weakestCategory,
    recommendedTopic: recommendedAdvice[weakestCategory] || `Focus on solving ${weakestCategory} problems to boost your global ranking.`
  };
};




export const calculateGlobalRank = (username: string, rating: number): number => {
  try {
    const users = db.getUsers();
    const userMap = new Map<string, number>();

    users.forEach(u => {
      if (u.username) {
        userMap.set(u.username.toLowerCase(), u.rating || 1200);
      }
    });

    if (username) {
      userMap.set(username.toLowerCase(), rating || 1200);
    }

    const sorted = Array.from(userMap.entries()).sort((a, b) => b[1] - a[1]);
    const idx = sorted.findIndex(([uname]) => uname === username.toLowerCase());
    return idx >= 0 ? idx + 1 : 1;
  } catch {
    return 1;
  }
};
