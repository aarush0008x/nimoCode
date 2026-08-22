import type { LeaderboardEntry } from '../types';

export const GLOBAL_COMMUNITY_USERS: (LeaderboardEntry & { role: 'admin' | 'user' | 'moderator' })[] = [];

export const MOCK_GLOBAL_LEADERBOARD: LeaderboardEntry[] = [];
