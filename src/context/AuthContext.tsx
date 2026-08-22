import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, Difficulty } from '../types';
import { db } from '../services/db';
import { setCookie, getCookie, deleteCookie } from '../utils/cookies';
import { getApiUrl } from '../utils/apiConfig';
import { calculateSkillStats, calculateGlobalRank } from '../utils/userStats';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  login: (loginId: string, passwordInput: string) => Promise<boolean>;
  signup: (name: string, email: string, username: string, passwordInput: string) => boolean;
  loginWithGoogle: (googleToken: string) => Promise<boolean>;
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

  // Sync active user's live rating, globalRank & skill stats in real time
  useEffect(() => {
    if (!user?.username) return;

    const syncUserStats = () => {
      try {
        const users = db.getUsers();
        const liveUser = users.find(u => u.username?.toLowerCase() === user.username.toLowerCase());
        if (liveUser) {
          const currentRating = liveUser.rating ?? user.rating;
          const currentSolvedIds = liveUser.solvedProblemIds ?? (user.solvedProblemIds || []);
          const currentSolvedCount = liveUser.solvedCount ?? (user.totalSolved || currentSolvedIds.length);
          const currentStreak = liveUser.streak ?? user.streakDays;
          const currentLevel = liveUser.level ?? user.level;
          const currentXP = liveUser.currentXP ?? user.currentXP;
          const currentNextXP = liveUser.nextLevelXP ?? user.nextLevelXP;

          const liveRank = calculateGlobalRank(user.username, currentRating);
          const { skillBreakdown, weakArea, recommendedTopic } = calculateSkillStats(currentSolvedIds);

          if (
            user.rating !== currentRating ||
            user.globalRank !== liveRank ||
            user.totalSolved !== currentSolvedCount ||
            user.streakDays !== currentStreak ||
            user.level !== currentLevel ||
            user.currentXP !== currentXP ||
            user.weakArea !== weakArea
          ) {
            setUser(prev => prev ? ({
              ...prev,
              rating: currentRating,
              totalSolved: currentSolvedCount,
              streakDays: currentStreak,
              level: currentLevel,
              currentXP,
              nextLevelXP: currentNextXP,
              solvedProblemIds: currentSolvedIds,
              globalRank: liveRank,
              skillBreakdown,
              weakArea,
              recommendedTopic
            }) : null);
          }
        }
      } catch {}
    };

    const fetchLiveUserFromApi = async () => {
      try {
        const res = await fetch(getApiUrl(`/users/${encodeURIComponent(user.username)}`));
        if (res.ok) {
          const apiUser = await res.json();
          if (apiUser && apiUser.username) {
            const apiRating = apiUser.rating ?? user.rating;
            const apiSolved = apiUser.solvedProblemIds ?? (user.solvedProblemIds || []);
            const apiCount = apiUser.solvedCount ?? (user.totalSolved || apiSolved.length);
            const liveRank = calculateGlobalRank(user.username, apiRating);
            const { skillBreakdown, weakArea, recommendedTopic } = calculateSkillStats(apiSolved);

            if (user.rating !== apiRating || user.totalSolved !== apiCount || user.globalRank !== liveRank) {
              setUser(prev => prev ? ({
                ...prev,
                rating: apiRating,
                totalSolved: apiCount,
                solvedProblemIds: apiSolved,
                level: apiUser.level ?? prev.level,
                currentXP: apiUser.currentXP ?? prev.currentXP,
                nextLevelXP: apiUser.nextLevelXP ?? prev.nextLevelXP,
                streakDays: apiUser.streak ?? prev.streakDays,
                globalRank: liveRank,
                skillBreakdown,
                weakArea,
                recommendedTopic
              }) : null);

              db.updateUser(user.username, {
                rating: apiRating,
                solvedCount: apiCount,
                level: apiUser.level,
                currentXP: apiUser.currentXP,
                nextLevelXP: apiUser.nextLevelXP,
                streak: apiUser.streak,
                solvedProblemIds: apiSolved
              });
            }
          }
        }
      } catch {}
    };

    // Run initial sync
    syncUserStats();
    fetchLiveUserFromApi();

    const interval = setInterval(() => {
      syncUserStats();
      fetchLiveUserFromApi();
    }, 3000);

    window.addEventListener('nimocode_db_update', syncUserStats);
    window.addEventListener('storage', syncUserStats);
    window.addEventListener('focus', fetchLiveUserFromApi);

    return () => {
      clearInterval(interval);
      window.removeEventListener('nimocode_db_update', syncUserStats);
      window.removeEventListener('storage', syncUserStats);
      window.removeEventListener('focus', fetchLiveUserFromApi);
    };
  }, [user?.username]);


  const login = async (loginId: string, passwordInput: string): Promise<boolean> => {
    const trimmedId = loginId.trim();
    const trimmedPass = passwordInput.trim();

    // 1. Real MongoDB Atlas Authentication API
    try {
      const res = await fetch(getApiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: trimmedId, password: trimmedPass })
      });
      if (res.ok) {
        const authUser = await res.json();
        if (authUser && authUser.username) {
          // Cache in local db
          db.addUser({
            name: authUser.name || authUser.username,
            email: authUser.email || `${authUser.username}@nimocode.ai`,
            username: authUser.username,
            password: authUser.password || trimmedPass
          });

          const solvedIds = authUser.solvedProblemIds || [];
          const { skillBreakdown, weakArea, recommendedTopic } = calculateSkillStats(solvedIds);
          const computedRank = calculateGlobalRank(authUser.username, authUser.rating || 1200);

          const profile: UserProfile = {
            username: authUser.username,
            name: authUser.name || authUser.username,
            email: authUser.email || `${authUser.username}@nimocode.ai`,
            avatar: authUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authUser.username)}`,
            title: authUser.badge || 'Competitive Coder',
            rating: authUser.rating || 1200,
            globalRank: computedRank,
            totalSolved: authUser.solvedCount || solvedIds.length || 0,
            solvedProblemIds: solvedIds,
            solvedStats: authUser.solvedStats || {
              easy: 0, easyTotal: 820, medium: 0, mediumTotal: 1450, hard: 0, hardTotal: 680
            },
            streakDays: authUser.streak || 1,
            level: authUser.level || 1,
            currentXP: authUser.currentXP || 0,
            nextLevelXP: authUser.nextLevelXP || 1000,
            weakArea,
            recommendedTopic,
            skillBreakdown,
            achievements: [
              { id: 'first-sub', title: 'First Steps', description: 'Joined NimoCode AI platform.', icon: '🚀', unlocked: true }
            ],
            submissionHeatmap: authUser.submissionHeatmap || {}
          };

          setUser(profile);
          if (authUser.role === 'admin' || authUser.username.toLowerCase() === 'admin') {
            setIsAdmin(true);
            setCookie('nimocode_admin_auth', 'true', 30);
          }
          return true;
        }
      }
    } catch (err) {
      console.warn('Backend login network issue, attempting local fallback:', err);
    }


    // 2. Local database fallback
    const localAuthUser = db.authenticateUser(trimmedId, passwordInput);
    if (localAuthUser) {
      const solvedIds = localAuthUser.solvedProblemIds || [];
      const { skillBreakdown, weakArea, recommendedTopic } = calculateSkillStats(solvedIds);
      const computedRank = calculateGlobalRank(localAuthUser.username, localAuthUser.rating || 1200);

      const profile: UserProfile = {
        username: localAuthUser.username,
        name: localAuthUser.name,
        email: localAuthUser.email,
        avatar: localAuthUser.avatar,
        title: localAuthUser.badge || 'Competitive Coder',
        rating: localAuthUser.rating,
        globalRank: computedRank,
        totalSolved: localAuthUser.solvedCount || solvedIds.length || 0,
        solvedProblemIds: solvedIds,
        solvedStats: localAuthUser.solvedStats || {
          easy: 0, easyTotal: 820, medium: 0, mediumTotal: 1450, hard: 0, hardTotal: 680
        },
        streakDays: localAuthUser.streak || 1,
        level: localAuthUser.level || 1,
        currentXP: localAuthUser.currentXP || 0,
        nextLevelXP: localAuthUser.nextLevelXP || 1000,
        weakArea,
        recommendedTopic,
        skillBreakdown,
        achievements: [
          { id: 'first-sub', title: 'First Steps', description: 'Joined NimoCode AI platform.', icon: '🚀', unlocked: true }
        ],
        submissionHeatmap: localAuthUser.submissionHeatmap || {}
      };

      setUser(profile);
      if (localAuthUser.role === 'admin' || localAuthUser.username.toLowerCase() === 'admin') {
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
      const { skillBreakdown, weakArea, recommendedTopic } = calculateSkillStats([]);
      const computedRank = calculateGlobalRank(createdUser.username, createdUser.rating || 1200);

      const profile: UserProfile = {
        username: createdUser.username,
        name: createdUser.name,
        email: createdUser.email,
        avatar: createdUser.avatar,
        title: 'New Challenger',
        rating: createdUser.rating,
        globalRank: computedRank,
        totalSolved: 0,
        solvedProblemIds: [],
        solvedStats: {
          easy: 0, easyTotal: 820, medium: 0, mediumTotal: 1450, hard: 0, hardTotal: 680
        },
        streakDays: 1,
        level: 1,
        currentXP: 0,
        nextLevelXP: 1000,
        weakArea,
        recommendedTopic,
        skillBreakdown,
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

  const loginWithGoogle = async (googleToken: string): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('/auth/google'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken })
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (!data.user) return false;
      const u = data.user;
      const solvedIds = u.solvedProblemIds || [];
      const { skillBreakdown, weakArea, recommendedTopic } = calculateSkillStats(solvedIds);
      const computedRank = calculateGlobalRank(u.username, u.rating || 1200);

      const profile: UserProfile = {
        username: u.username,
        name: u.name,
        email: u.email,
        avatar: u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`,
        title: u.badge || 'Google Member',
        rating: u.rating || 1200,
        globalRank: computedRank,
        totalSolved: u.solvedCount || solvedIds.length || 0,
        solvedProblemIds: solvedIds,
        solvedStats: u.solvedStats || { easy: 0, easyTotal: 820, medium: 0, mediumTotal: 1450, hard: 0, hardTotal: 680 },
        streakDays: u.streak || 1,
        level: u.level || 1,
        currentXP: u.currentXP || 0,
        nextLevelXP: u.nextLevelXP || 1000,
        weakArea,
        recommendedTopic,
        skillBreakdown,
        achievements: [{ id: 'google-join', title: 'Google Member', description: 'Signed in with Google.', icon: '🔵', unlocked: true }],
        submissionHeatmap: {}
      };
      setUser(profile);
      return true;
    } catch {
      return false;
    }
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

    const { skillBreakdown, weakArea, recommendedTopic } = calculateSkillStats(newSolvedIds);
    const newRank = calculateGlobalRank(user.username, newRating);

    const updatedProfile: UserProfile = {
      ...user,
      totalSolved: newTotal,
      rating: newRating,
      globalRank: newRank,
      solvedProblemIds: newSolvedIds,
      currentXP: newXP,
      level: newLevel,
      nextLevelXP: newNextXP,
      weakArea,
      recommendedTopic,
      skillBreakdown,
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
        loginWithGoogle,
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
