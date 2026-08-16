import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, Difficulty } from '../types';
import { db } from '../services/db';
import { setCookie, getCookie, deleteCookie } from '../utils/cookies';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  login: (loginId: string, passwordInput: string) => boolean;
  signup: (name: string, email: string, username: string, passwordInput: string) => boolean;
  logout: () => void;
  toggleAdminRole: () => void;
  markProblemSolved: (problemId: string, difficulty: Difficulty) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      // 1. Try reading from persistent cookie
      const cookieUser = getCookie('nimocode_active_user');
      if (cookieUser) {
        return JSON.parse(cookieUser);
      }
      // 2. Fallback to localStorage / sessionStorage
      const localUser = localStorage.getItem('nimocode_active_user') || sessionStorage.getItem('nimocode_active_user');
      if (localUser) {
        return JSON.parse(localUser);
      }
    } catch {
      // Ignore
    }
    return null;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return getCookie('nimocode_admin_auth') === 'true' || sessionStorage.getItem('nimocode_admin_auth') === 'true';
  });

  // Keep cookies & storage updated when user state changes
  useEffect(() => {
    if (user) {
      const userStr = JSON.stringify(user);
      setCookie('nimocode_active_user', userStr, 30);
      setCookie('nimocode_session_token', `token-${user.username}-${Date.now()}`, 30);
      localStorage.setItem('nimocode_active_user', userStr);
      sessionStorage.setItem('nimocode_active_user', userStr);
    } else {
      deleteCookie('nimocode_active_user');
      deleteCookie('nimocode_session_token');
      localStorage.removeItem('nimocode_active_user');
      sessionStorage.removeItem('nimocode_active_user');
    }
  }, [user]);

  const login = (loginId: string, passwordInput: string): boolean => {
    const authUser = db.authenticateUser(loginId, passwordInput);
    if (authUser) {
      const profile: UserProfile = {
        username: authUser.username,
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar,
        title: authUser.badge || 'Competitive Coder',
        rating: authUser.rating,
        globalRank: authUser.rank,
        totalSolved: authUser.solvedCount,
        solvedProblemIds: authUser.solvedProblemIds || [],
        solvedStats: authUser.solvedStats || {
          easy: 0, easyTotal: 820, medium: 0, mediumTotal: 1450, hard: 0, hardTotal: 680
        },
        streakDays: authUser.streak,
        level: authUser.level || 1,
        currentXP: authUser.currentXP || 0,
        nextLevelXP: authUser.nextLevelXP || 1000,
        weakArea: 'Dynamic Programming',
        recommendedTopic: 'Practice array and dynamic programming challenges.',
        skillBreakdown: {
          'Arrays': 50, 'Strings': 40, 'Trees': 30, 'Graphs': 20, 'Dynamic Programming': 10, 'SQL': 40, 'Algorithms': 45, 'Binary Search': 35, 'Stack': 40, 'Hash Table': 50, 'Math': 30, 'Heap': 25
        },
        achievements: [
          { id: 'first-sub', title: 'First Steps', description: 'Joined NimoCode AI platform.', icon: '🚀', unlocked: true }
        ],
        submissionHeatmap: authUser.submissionHeatmap || {}
      };

      setUser(profile);
      if (authUser.role === 'admin') {
        setIsAdmin(true);
        setCookie('nimocode_admin_auth', 'true', 30);
      }
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, username: string, passwordInput: string): boolean => {
    const createdUser = db.addUser({ name, email, username, password: passwordInput });
    if (createdUser) {
      const profile: UserProfile = {
        username: createdUser.username,
        name: createdUser.name,
        email: createdUser.email,
        avatar: createdUser.avatar,
        title: 'New Challenger',
        rating: createdUser.rating,
        globalRank: createdUser.rank,
        totalSolved: 0,
        solvedProblemIds: [],
        solvedStats: {
          easy: 0, easyTotal: 820, medium: 0, mediumTotal: 1450, hard: 0, hardTotal: 680
        },
        streakDays: 1,
        level: 1,
        currentXP: 0,
        nextLevelXP: 1000,
        weakArea: 'Arrays',
        recommendedTopic: 'Start solving Easy Array challenges.',
        skillBreakdown: {
          'Arrays': 0, 'Strings': 0, 'Trees': 0, 'Graphs': 0, 'Dynamic Programming': 0, 'SQL': 0, 'Algorithms': 0, 'Binary Search': 0, 'Stack': 0, 'Hash Table': 0, 'Math': 0, 'Heap': 0
        },
        achievements: [
          { id: 'first-sub', title: 'New Challenger', description: 'Registered real NimoCode account.', icon: '🚀', unlocked: true }
        ],
        submissionHeatmap: {}
      };

      setUser(profile);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    deleteCookie('nimocode_active_user');
    deleteCookie('nimocode_session_token');
    deleteCookie('nimocode_admin_auth');
    localStorage.removeItem('nimocode_active_user');
    sessionStorage.removeItem('nimocode_active_user');
    sessionStorage.removeItem('nimocode_admin_auth');
  };

  const toggleAdminRole = () => {
    setIsAdmin(prev => {
      const next = !prev;
      if (next) {
        setCookie('nimocode_admin_auth', 'true', 30);
      } else {
        deleteCookie('nimocode_admin_auth');
      }
      return next;
    });
  };

  const markProblemSolved = (problemId: string, difficulty: Difficulty) => {
    if (!user) return;

    if (user.solvedProblemIds?.includes(problemId)) return;

    const ratingGain = difficulty === 'Hard' ? 60 : difficulty === 'Medium' ? 30 : 15;
    const xpGain = difficulty === 'Hard' ? 200 : difficulty === 'Medium' ? 100 : 50;

    const newSolvedIds = [...(user.solvedProblemIds || []), problemId];
    const newTotal = user.totalSolved + 1;
    const newRating = user.rating + ratingGain;
    const newXP = user.currentXP + xpGain;
    let newLevel = user.level;
    let newNextXP = user.nextLevelXP;

    if (newXP >= newNextXP) {
      newLevel += 1;
      newNextXP += 1000;
    }

    const updatedProfile: UserProfile = {
      ...user,
      totalSolved: newTotal,
      rating: newRating,
      solvedProblemIds: newSolvedIds,
      currentXP: newXP,
      level: newLevel,
      nextLevelXP: newNextXP,
      solvedStats: {
        ...user.solvedStats,
        easy: difficulty === 'Easy' ? user.solvedStats.easy + 1 : user.solvedStats.easy,
        medium: difficulty === 'Medium' ? user.solvedStats.medium + 1 : user.solvedStats.medium,
        hard: difficulty === 'Hard' ? user.solvedStats.hard + 1 : user.solvedStats.hard
      }
    };

    setUser(updatedProfile);

    // Sync to DB
    db.updateUser(user.username, {
      rating: newRating,
      solvedCount: newTotal,
      level: newLevel,
      currentXP: newXP,
      nextLevelXP: newNextXP,
      solvedProblemIds: newSolvedIds
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        login,
        signup,
        logout,
        toggleAdminRole,
        markProblemSolved
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
