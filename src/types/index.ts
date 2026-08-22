export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category = 
  | 'Arrays' 
  | 'Strings' 
  | 'Trees' 
  | 'Graphs' 
  | 'Dynamic Programming' 
  | 'SQL' 
  | 'Algorithms'
  | 'Binary Search'
  | 'Stack'
  | 'Hash Table'
  | 'Math'
  | 'Heap';

export type ProgrammingLanguage = 'cpp' | 'python' | 'java' | 'javascript' | 'go' | 'rust';

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  number: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: Category;
  tags: string[];
  acceptanceRate: number;
  totalSubmissions: number;
  solvedStatus?: 'solved' | 'attempted' | 'todo';
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  hints: string[];
  starterCode: Record<ProgrammingLanguage, string>;
  testCases: TestCase[];
  solutionExplanation?: {
    approach: string;
    timeComplexity: string;
    spaceComplexity: string;
    code: Record<ProgrammingLanguage, string>;
  };
}

export interface Submission {
  id: string;
  problemId: string;
  language: ProgrammingLanguage;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Running';
  runtimeMs?: number;
  memoryMb?: number;
  passedCases?: number;
  totalCases?: number;
  timestamp: string;
  userOutput?: string;
  expectedOutput?: string;
  failedTestCase?: {
    input: string;
    expected: string;
    actual: string;
  };
}

export interface ContestProblem {
  id: string;
  code: 'A' | 'B' | 'C' | 'D' | 'E';
  title: string;
  points: number;
  difficulty: Difficulty;
  solvedCount?: number;
}

export interface Contest {
  id: string;
  title: string;
  subtitle: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  participantsCount: number;
  status: 'LIVE' | 'UPCOMING' | 'PAST';
  registered?: boolean;
  problems: ContestProblem[];
  prizes?: string[];
  registeredUsers?: Array<{
    username: string;
    name: string;
    avatar: string;
    score?: number;
    penaltyMinutes?: number;
    registeredAt?: string;
    problemScores?: Record<string, { solved: boolean; timeMs?: number; attempts: number }>;
  }>;
}


export interface ContestLeaderboardEntry {
  rank: number;
  username: string;
  name: string;
  avatar: string;
  country?: string;
  solvedCount: number;
  score: number;
  penaltyMinutes: number;
  problemScores: Record<string, { solved: boolean; timeMs?: number; attempts: number }>;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  name: string;
  avatar: string;
  rating: number;
  solvedCount: number;
  contestWins: number;
  streak: number;
  country?: string;
  badge?: string;
  trend: 'up' | 'down' | 'same';
  categoryScores?: {
    arrays: number;
    strings: number;
    trees: number;
    graphs: number;
    dp: number;
    sql: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface UserProfile {
  username: string;
  name: string;
  avatar: string;
  email?: string;
  title: string;
  rating: number;
  globalRank: number;
  totalSolved: number;
  solvedProblemIds?: string[];
  solvedStats: {
    easy: number;
    easyTotal: number;
    medium: number;
    mediumTotal: number;
    hard: number;
    hardTotal: number;
  };
  streakDays: number;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  weakArea: Category;
  recommendedTopic: string;
  skillBreakdown: Record<Category, number>;
  achievements: Achievement[];
  submissionHeatmap: Record<string, number>; // 'YYYY-MM-DD': count
}

export interface SolutionPost {
  id: string;
  problemId: string;
  problemTitle: string;
  author: string;
  authorAvatar: string;
  language: ProgrammingLanguage;
  title: string;
  runtimeMs: number;
  memoryMb: number;
  upvotes: number;
  views: number;
  isBestRuntime?: boolean;
  isMostElegant?: boolean;
  isMostUpvoted?: boolean;
  code: string;
  explanation: string;
  createdAt: string;
}

export interface DiscussionPost {
  id: string;
  problemId?: string;
  problemTitle?: string;
  title: string;
  author: string;
  authorAvatar: string;
  category: 'General' | 'Interview Prep' | 'Algorithmic Tips' | 'Bug Report' | 'Career';
  upvotes: number;
  repliesCount: number;
  createdAt: string;
  tags: string[];
  content: string;
}

export interface DuelMatch {
  id: string;
  player1: { username: string; name: string; avatar: string; rating: number; status: 'coding' | 'submitted' | 'accepted'; testCasesPassed: number };
  player2: { username: string; name: string; avatar: string; rating: number; status: 'coding' | 'submitted' | 'accepted'; testCasesPassed: number };
  problemId: string;
  problemTitle: string;
  difficulty: Difficulty;
  ratingStakes: number;
  durationSeconds: number;
  remainingSeconds: number;
  status: 'QUEUED' | 'IN_PROGRESS' | 'FINISHED';
  winnerUsername?: string;
}

export interface AICodeReviewResult {
  timeComplexity: string;
  spaceComplexity: string;
  qualityScore: number;
  summary: string;
  suggestions: string[];
  bugsFound: string[];
  optimizedCodeSnippet?: string;
}
