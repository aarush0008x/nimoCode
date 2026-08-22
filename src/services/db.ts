import { generateLeetCode2000Problems } from '../data/leetcodeDataset';
import { MOCK_CONTESTS } from '../data/contests';
import { GLOBAL_COMMUNITY_USERS } from '../data/leaderboard';
import type { Problem, Contest, LeaderboardEntry, DiscussionPost, SolutionPost, Submission, UserReview } from '../types';
import { getApiUrl } from '../utils/apiConfig';

const LEETCODE_2000_PROBLEMS = generateLeetCode2000Problems();

const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://nimocode.onrender.com/api');

const STORAGE_KEYS = {
  PROBLEMS: 'nimocode_problems_v1',
  CONTESTS: 'nimocode_contests_v1',
  USERS: 'nimocode_users_v1',
  DISCUSSIONS: 'nimocode_discussions_v1',
  SOLUTIONS: 'nimocode_solutions_v1',
  SUBMISSIONS: 'nimocode_submissions_v1',
  REVIEWS: 'nimocode_reviews_v1'
};


export type DbUserRecord = LeaderboardEntry & {
  _id?: string;
  email?: string;
  password?: string;
  role: 'admin' | 'user' | 'moderator';
  isBanned?: boolean;
  currentXP?: number;
  nextLevelXP?: number;
  level?: number;
  solvedProblemIds?: string[];
  submissionHeatmap?: Record<string, number>;
  bio?: string;
  college?: string;
  gradYear?: number | string;
  major?: string;
  friends?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  solvedStats?: {
    easy: number;
    easyTotal: number;
    medium: number;
    mediumTotal: number;
    hard: number;
    hardTotal: number;
  };
};


// Seed initial database if empty
const seedDatabaseIfEmpty = () => {
  try {
    const existingProbs = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
    if (!existingProbs || JSON.parse(existingProbs).length < LEETCODE_2000_PROBLEMS.length || existingProbs.includes('"solvedStatus":"solved"')) {
      const cleanProbs = LEETCODE_2000_PROBLEMS.map(p => ({ ...p, solvedStatus: 'todo' as const }));
      localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(cleanProbs));
    }
  } catch {
    const cleanProbs = LEETCODE_2000_PROBLEMS.map(p => ({ ...p, solvedStatus: 'todo' as const }));
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(cleanProbs));
  }

  // Ensure clean contests without dummy test items
  try {
    const rawContests = localStorage.getItem(STORAGE_KEYS.CONTESTS);
    if (rawContests) {
      const parsed = JSON.parse(rawContests);
      const cleaned = parsed.filter((c: any) => 
        c && c.title && c.title.toLowerCase() !== 'test' && c.subtitle && c.subtitle.toLowerCase() !== 'test' && !c.id.toLowerCase().includes('test')
      );
      localStorage.setItem(STORAGE_KEYS.CONTESTS, JSON.stringify(cleaned));
    }
  } catch {}

  if (!localStorage.getItem(STORAGE_KEYS.CONTESTS)) {
    localStorage.setItem(STORAGE_KEYS.CONTESTS, JSON.stringify([]));
  }


  // Clear old fake discussions
  try {
    const existingDisc = localStorage.getItem(STORAGE_KEYS.DISCUSSIONS);
    if (existingDisc && existingDisc.includes('cpp_master')) {
      localStorage.removeItem(STORAGE_KEYS.DISCUSSIONS);
    }
  } catch {
    // Ignore
  }

  if (!localStorage.getItem(STORAGE_KEYS.DISCUSSIONS)) {
    localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.SOLUTIONS)) {
    localStorage.setItem(STORAGE_KEYS.SOLUTIONS, JSON.stringify([]));
  }

  // Purge fake seed users from localStorage
  try {
    const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (existingUsers && (existingUsers.includes('tourist') || existingUsers.includes('benq'))) {
      localStorage.removeItem(STORAGE_KEYS.USERS);
    }
  } catch {}
};

seedDatabaseIfEmpty();

// Database Service Interface connected to Realtime Express MongoDB Server
export const db = {
  // PROBLEMS
  getProblems: (): Problem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
      return data ? JSON.parse(data) : LEETCODE_2000_PROBLEMS;
    } catch {
      return LEETCODE_2000_PROBLEMS;
    }
  },

  addProblem: (problemData: Omit<Problem, 'id' | 'totalSubmissions' | 'acceptanceRate' | 'solvedStatus'>): Problem => {
    const problems = db.getProblems();
    const newId = (problems.length + 1).toString();
    const newNumber = problems.length > 0 ? Math.max(...problems.map(p => p.number)) + 1 : 1;

    const newProblem: Problem = {
      ...problemData,
      id: newId,
      number: newNumber,
      acceptanceRate: 50.0,
      totalSubmissions: 0,
      solvedStatus: 'todo'
    };

    const updated = [newProblem, ...problems];
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(updated));
    window.dispatchEvent(new Event('nimocode_db_update'));
    return newProblem;
  },

  updateProblem: (id: string, updatedFields: Partial<Problem>): Problem | null => {
    const problems = db.getProblems();
    const index = problems.findIndex(p => p.id === id);
    if (index === -1) return null;

    problems[index] = { ...problems[index], ...updatedFields };
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(problems));
    window.dispatchEvent(new Event('nimocode_db_update'));
    return problems[index];
  },

  deleteProblem: (id: string): boolean => {
    const problems = db.getProblems();
    const filtered = problems.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(filtered));
    window.dispatchEvent(new Event('nimocode_db_update'));
    return true;
  },

  // CONTESTS
  getContests: (): Contest[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTESTS);
      return data ? JSON.parse(data) : MOCK_CONTESTS;
    } catch {
      return MOCK_CONTESTS;
    }
  },

  addContest: (contestData: Omit<Contest, 'id' | 'participantsCount'>): Contest => {
    const contests = db.getContests();
    const newId = `contest-${Date.now()}`;
    const newContest: Contest = {
      ...contestData,
      id: newId,
      participantsCount: 1
    };

    const updated = [newContest, ...contests];
    localStorage.setItem(STORAGE_KEYS.CONTESTS, JSON.stringify(updated));
    window.dispatchEvent(new Event('nimocode_db_update'));
    return newContest;
  },

  updateContest: (id: string, updatedFields: Partial<Contest>): Contest | null => {
    const contests = db.getContests();
    const index = contests.findIndex(c => c.id === id);
    if (index === -1) return null;

    contests[index] = { ...contests[index], ...updatedFields };
    localStorage.setItem(STORAGE_KEYS.CONTESTS, JSON.stringify(contests));
    window.dispatchEvent(new Event('nimocode_db_update'));
    return contests[index];
  },

  deleteContest: (id: string): boolean => {
    const contests = db.getContests();
    const filtered = contests.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONTESTS, JSON.stringify(filtered));
    fetch(getApiUrl(`/contests/${encodeURIComponent(id)}`), { method: 'DELETE' }).catch(() => {});
    window.dispatchEvent(new Event('nimocode_db_update'));
    return true;
  },


  // USERS & REAL MONGODB LEADERBOARD
  getUsers: (): DbUserRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      const rawUsers: DbUserRecord[] = data ? JSON.parse(data) : [];

      const map = new Map<string, DbUserRecord>();
      
      // Initialize with all global registered community competitors
      GLOBAL_COMMUNITY_USERS.forEach(u => {
        map.set(u.username.toLowerCase(), {
          ...u,
          _id: `user-${u.username}`,
          email: `${u.username}@nimocode.ai`,
          isBanned: false
        });
      });

      // Merge / overwrite with any active/local user modifications
      rawUsers.forEach(u => {
        if (u && u.username) {
          const prev = map.get(u.username.toLowerCase());
          map.set(u.username.toLowerCase(), {
            ...prev,
            ...u
          });
        }
      });

      const merged = Array.from(map.values()).sort((a, b) => (b.rating || 1200) - (a.rating || 1200));
      return merged.map((user, idx) => ({
        ...user,
        rank: idx + 1
      }));
    } catch {
      return (GLOBAL_COMMUNITY_USERS as any) || [];
    }
  },


  addUser: (userData: { name: string; username: string; email: string; password?: string }): DbUserRecord => {
    const users = db.getUsers();

    const targetUser = userData.username.trim().toLowerCase();
    const targetEmail = userData.email.trim().toLowerCase();

    const existing = users.find(u =>
      (u.username || '').toLowerCase() === targetUser || (u.email || '').toLowerCase() === targetEmail
    );
    if (existing) {
      if ((existing.username || '').toLowerCase() === targetUser) {
        throw new Error(`Username "@${userData.username}" is already taken. Please choose another username.`);
      }
      throw new Error(`An account with email "${userData.email}" already exists.`);
    }

    const newUser: DbUserRecord = {
      _id: `507f1f77${Date.now().toString(16).padStart(16, '0')}`,
      rank: users.length + 1,
      name: userData.name,
      username: userData.username.toLowerCase(),
      email: userData.email.toLowerCase(),
      password: userData.password || 'password123',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.username)}`,
      rating: 1200,
      solvedCount: 0,
      contestWins: 0,
      streak: 1,
      trend: 'same',
      badge: 'Knight',
      country: 'USA',
      role: 'user',
      level: 1,
      currentXP: 0,
      nextLevelXP: 1000,
      solvedProblemIds: [],
      submissionHeatmap: {},
      solvedStats: {
        easy: 0, easyTotal: 820, medium: 0, mediumTotal: 1450, hard: 0, hardTotal: 680
      }
    };

    const updated = [...users, newUser];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));

    // Async sync to real MongoDB Backend
    fetch(getApiUrl('/auth/signup'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).catch(() => {});

    window.dispatchEvent(new Event('nimocode_db_update'));
    return newUser;
  },

  authenticateUser: (loginId: string, passwordInput: string): DbUserRecord | null => {
    const users = db.getUsers();
    const target = loginId.trim().toLowerCase();
    const pass = passwordInput.trim();
    const user = users.find(u =>
      (u.username && u.username.toLowerCase() === target) ||
      (u.email && u.email.toLowerCase() === target)
    );

    if (user && (!user.password || user.password === passwordInput || user.password === pass)) {
      return user;
    }
    return null;
  },

  updateUser: (username: string, updates: Partial<DbUserRecord>): DbUserRecord | null => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Sync to MongoDB Express API
    fetch(getApiUrl(`/users/${encodeURIComponent(username)}/progress`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(() => {});


    window.dispatchEvent(new Event('nimocode_db_update'));
    return users[index];
  },

  updateUserRole: (username: string, role: 'admin' | 'user' | 'moderator') => {
    db.updateUser(username, { role });
    fetch(`${API_BASE_URL}/users/${username}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    }).catch(() => {});
  },

  toggleUserBan: (username: string) => {
    const users = db.getUsers();
    const user = users.find(u => u.username === username);
    if (user) {
      db.updateUser(username, { isBanned: !user.isBanned });
    }
  },

  deleteUser: (username: string): boolean => {
    const users = db.getUsers();
    const filtered = users.filter(u => u.username.toLowerCase() !== username.toLowerCase());
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));

    // Sync to MongoDB Backend API
    fetch(`${API_BASE_URL}/users/${username}`, { method: 'DELETE' }).catch(() => {});

    window.dispatchEvent(new Event('nimocode_db_update'));
    return true;
  },

  // SUBMISSIONS
  getSubmissions: (): Submission[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addSubmission: (submission: Submission) => {
    const submissions = db.getSubmissions();
    const updated = [submission, ...submissions];
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated));

    // Sync to MongoDB Express API
    fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission)
    }).catch(() => {});

    window.dispatchEvent(new Event('nimocode_db_update'));
  },

  // DISCUSSIONS & SOLUTIONS
  getDiscussions: (): DiscussionPost[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISCUSSIONS);
      const parsed = data ? JSON.parse(data) : [];
      return parsed.filter((d: DiscussionPost) => d.author !== 'cpp_master' && d.author !== 'coder_pro' && d.author !== 'sarah_tech');
    } catch {
      return [];
    }
  },

  addDiscussion: (post: Omit<DiscussionPost, 'id' | 'upvotes' | 'repliesCount' | 'createdAt'>): DiscussionPost => {
    const discussions = db.getDiscussions();
    const newPost: DiscussionPost = {
      ...post,
      id: `disc-${Date.now()}`,
      upvotes: 1,
      repliesCount: 0,
      createdAt: 'Just now'
    };
    const updated = [newPost, ...discussions];
    localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(updated));

    // Sync to MongoDB Atlas API
    fetch(getApiUrl('/discussions'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    }).catch(() => {});

    window.dispatchEvent(new Event('nimocode_db_update'));
    return newPost;
  },

  deleteDiscussion: (id: string) => {
    const discussions = db.getDiscussions();
    const filtered = discussions.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(filtered));

    // Sync deletion to MongoDB Atlas API
    fetch(getApiUrl(`/discussions/${encodeURIComponent(id)}`), {
      method: 'DELETE'
    }).catch(() => {});

    window.dispatchEvent(new Event('nimocode_db_update'));
  },

  upvoteDiscussion: (id: string) => {
    const discussions = db.getDiscussions();
    const index = discussions.findIndex(d => d.id === id);
    if (index !== -1) {
      discussions[index].upvotes += 1;
      localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(discussions));

      fetch(getApiUrl(`/discussions/${encodeURIComponent(id)}/upvote`), {
        method: 'PUT'
      }).catch(() => {});

      window.dispatchEvent(new Event('nimocode_db_update'));
    }
  },


  getSolutions: (): SolutionPost[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SOLUTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addSolution: (post: Omit<SolutionPost, 'id' | 'upvotes' | 'views' | 'createdAt'>): SolutionPost => {
    const solutions = db.getSolutions();
    const newSolution: SolutionPost = {
      ...post,
      id: `sol-${Date.now()}`,
      upvotes: 1,
      views: 1,
      createdAt: 'Just now'
    };
    const updated = [newSolution, ...solutions];
    localStorage.setItem(STORAGE_KEYS.SOLUTIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event('nimocode_db_update'));
    return newSolution;
  },

  upvoteSolution: (id: string) => {
    const solutions = db.getSolutions();
    const index = solutions.findIndex(s => s.id === id);
    if (index !== -1) {
      solutions[index].upvotes += 1;
      localStorage.setItem(STORAGE_KEYS.SOLUTIONS, JSON.stringify(solutions));
      window.dispatchEvent(new Event('nimocode_db_update'));
    }
  },

  // COMMUNITY REVIEWS
  getReviews: (): UserReview[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addReview: (reviewData: Omit<UserReview, 'id' | 'createdAt' | 'likes'>): UserReview => {
    const reviews = db.getReviews();
    const newReview: UserReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: 'Just now',
      likes: 1
    };
    const updated = [newReview, ...reviews];
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));

    // Sync to MongoDB Atlas API
    fetch(getApiUrl('/reviews'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview)
    }).catch(() => {});

    window.dispatchEvent(new Event('nimocode_db_update'));
    return newReview;
  },

  likeReview: (id: string) => {
    const reviews = db.getReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx !== -1) {
      reviews[idx].likes = (reviews[idx].likes || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

      fetch(getApiUrl(`/reviews/${encodeURIComponent(id)}/like`), {
        method: 'PUT'
      }).catch(() => {});

      window.dispatchEvent(new Event('nimocode_db_update'));
    }
  }
};

