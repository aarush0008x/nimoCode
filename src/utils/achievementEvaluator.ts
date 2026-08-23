import type { Achievement, UserProfile } from '../types';

export interface BaseAchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'signup' | 'solved_count' | 'rating' | 'streak' | 'level' | 'contest' | 'duels' | 'custom';
  requiredValue?: number;
  xpReward?: number;
}

export const BUILT_IN_ACHIEVEMENTS: BaseAchievementDefinition[] = [
  {
    id: 'first-step',
    title: 'First Steps',
    description: 'Joined NimoCode AI platform and created a genuine competitive profile.',
    icon: '🚀',
    type: 'signup'
  },
  {
    id: 'streak-7',
    title: '7-Day Streak Warrior',
    description: 'Maintained a daily coding submission streak for 7 consecutive days.',
    icon: '🔥',
    type: 'streak',
    requiredValue: 7,
    xpReward: 200
  },
  {
    id: 'streak-30',
    title: '30-Day Streak Grandmaster',
    description: 'Maintained a relentless daily submission streak for 30 days.',
    icon: '⚡',
    type: 'streak',
    requiredValue: 30,
    xpReward: 1000
  },
  {
    id: 'solved-25',
    title: 'Problem Solver (25 Solved)',
    description: 'Solved 25 unique algorithmic coding challenges.',
    icon: '🥉',
    type: 'solved_count',
    requiredValue: 25,
    xpReward: 250
  },
  {
    id: 'solved-100',
    title: 'Century Club (100 Solved)',
    description: 'Solved 100+ unique coding challenges across array, graph, and tree topics.',
    icon: '🥈',
    type: 'solved_count',
    requiredValue: 100,
    xpReward: 1000
  },
  {
    id: 'solved-500',
    title: 'Algorithm Virtuoso (500 Solved)',
    description: 'Solved 500+ LeetCode-grade algorithmic problems.',
    icon: '🥇',
    type: 'solved_count',
    requiredValue: 500,
    xpReward: 3000
  },
  {
    id: 'solved-2000',
    title: 'Legendary Finisher (2,000 Solved)',
    description: 'Completed the entire 2,000+ problem catalog on NimoCode.',
    icon: '👑',
    type: 'solved_count',
    requiredValue: 2000,
    xpReward: 10000
  },
  {
    id: 'rating-1500',
    title: 'Candidate Master (1500+ ELO)',
    description: 'Reached a competitive rating of 1,500+ in ranked 1v1 duels & contests.',
    icon: '⚔️',
    type: 'rating',
    requiredValue: 1500,
    xpReward: 500
  },
  {
    id: 'rating-2000',
    title: 'Grandmaster Division (2000+ ELO)',
    description: 'Surpassed the 2,000 ELO threshold in competitive arenas.',
    icon: '🏆',
    type: 'rating',
    requiredValue: 2000,
    xpReward: 2500
  },
  {
    id: 'level-10',
    title: 'Veteran Level 10',
    description: 'Reached Level 10 by gaining algorithmic XP through submissions.',
    icon: '🎖️',
    type: 'level',
    requiredValue: 10,
    xpReward: 400
  },
  {
    id: 'level-25',
    title: 'Apex Level 25',
    description: 'Reached Level 25 on NimoCode leaderboards.',
    icon: '💎',
    type: 'level',
    requiredValue: 25,
    xpReward: 1500
  },
  {
    id: 'webrtc-pair',
    title: 'Collaborative Pair Programmer',
    description: 'Engaged in a live WebRTC audio and shared Monaco pair session.',
    icon: '🎙️',
    type: 'custom',
    requiredValue: 1,
    xpReward: 300
  }
];

export const evaluateUserAchievements = (
  user: Partial<UserProfile>,
  customAchievements: Achievement[] = []
): Achievement[] => {
  const solvedCount = user.totalSolved || user.solvedProblemIds?.length || 0;
  const rating = user.rating || 1200;
  const streak = user.streakDays || 1;
  const level = user.level || 1;

  const builtInEvaluated: Achievement[] = BUILT_IN_ACHIEVEMENTS.map((def) => {
    let unlocked = false;
    let progress = 0;
    let maxProgress = def.requiredValue || 1;

    switch (def.type) {
      case 'signup':
        unlocked = true;
        progress = 1;
        maxProgress = 1;
        break;
      case 'solved_count':
        progress = solvedCount;
        unlocked = solvedCount >= (def.requiredValue || 1);
        break;
      case 'rating':
        progress = rating;
        unlocked = rating >= (def.requiredValue || 1);
        break;
      case 'streak':
        progress = streak;
        unlocked = streak >= (def.requiredValue || 1);
        break;
      case 'level':
        progress = level;
        unlocked = level >= (def.requiredValue || 1);
        break;
      case 'custom':
        unlocked = Boolean(user.username);
        progress = 1;
        maxProgress = 1;
        break;
      default:
        unlocked = false;
    }

    return {
      id: def.id,
      title: def.title,
      description: def.description,
      icon: def.icon,
      unlocked,
      progress: Math.min(progress, maxProgress),
      maxProgress,
      unlockedAt: unlocked ? '2026-08-20' : undefined
    };
  });

  // Evaluate admin-created custom achievements
  const customEvaluated: Achievement[] = customAchievements.map((ca) => {
    const isUnlocked = ca.maxProgress ? solvedCount >= ca.maxProgress : ca.unlocked;
    return {
      ...ca,
      unlocked: isUnlocked,
      progress: Math.min(solvedCount, ca.maxProgress || 1),
      maxProgress: ca.maxProgress || 1
    };
  });

  return [...builtInEvaluated, ...customEvaluated];
};
