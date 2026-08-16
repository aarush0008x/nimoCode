import type { UserProfile } from '../types';

// Generate 365 days of submission heatmap data
const generateHeatmapData = (): Record<string, number> => {
  const map: Record<string, number> = {};
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Create random activity with realistic clusters
    const random = Math.random();
    if (random > 0.45) {
      map[dateStr] = Math.floor(Math.random() * 8) + 1;
    } else {
      map[dateStr] = 0;
    }
  }
  return map;
};

export const CURRENT_USER: UserProfile = {
  username: 'aarush_dev',
  name: 'Aarush Singh',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  title: 'Competitive Programmer & Full Stack Engineer',
  rating: 1842,
  globalRank: 1248,
  totalSolved: 127,
  solvedStats: {
    easy: 64,
    easyTotal: 820,
    medium: 48,
    mediumTotal: 1450,
    hard: 15,
    hardTotal: 680
  },
  streakDays: 14,
  level: 18,
  currentXP: 2840,
  nextLevelXP: 3000,
  weakArea: 'Dynamic Programming',
  recommendedTopic: 'Solve 3 Easy DP problems to reinforce state transition patterns.',
  skillBreakdown: {
    'Arrays': 82,
    'Strings': 74,
    'Trees': 61,
    'Graphs': 43,
    'Dynamic Programming': 31,
    'SQL': 67,
    'Algorithms': 78,
    'Binary Search': 65,
    'Stack': 70,
    'Hash Table': 85,
    'Math': 55,
    'Heap': 40
  },
  achievements: [
    {
      id: 'streak-30',
      title: '30 Day Streak',
      description: 'Maintained a daily coding submission streak for 30 consecutive days.',
      icon: '🔥',
      unlocked: true,
      unlockedAt: '2026-07-28'
    },
    {
      id: 'solved-100',
      title: '100 Problems',
      description: 'Solved over 100 unique coding challenges across all topics.',
      icon: '⚡',
      unlocked: true,
      unlockedAt: '2026-08-02'
    },
    {
      id: 'contest-winner',
      title: 'Contest Winner',
      description: 'Placed in the Top 10 in an official CodeArena Weekly Contest.',
      icon: '🏆',
      unlocked: true,
      unlockedAt: '2026-08-11'
    },
    {
      id: 'dp-master',
      title: 'DP Master',
      description: 'Solve 20 Medium or Hard Dynamic Programming problems.',
      icon: '🧠',
      unlocked: false,
      progress: 7,
      maxProgress: 20
    },
    {
      id: 'first-sub',
      title: 'First Submission',
      description: 'Successfully submitted your first solution on CodeArena.',
      icon: '🚀',
      unlocked: true,
      unlockedAt: '2026-01-15'
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Achieve a sub-10ms execution time on a Medium problem.',
      icon: '⚡',
      unlocked: true,
      unlockedAt: '2026-06-04'
    }
  ],
  submissionHeatmap: generateHeatmapData()
};
