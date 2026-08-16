import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/db';
import type { Problem, Contest, LeaderboardEntry, DiscussionPost, SolutionPost, Submission } from '../types';

interface DbContextType {
  problems: Problem[];
  contests: Contest[];
  users: (LeaderboardEntry & { role: 'admin' | 'user' | 'moderator'; isBanned?: boolean })[];
  discussions: DiscussionPost[];
  solutions: SolutionPost[];
  submissions: Submission[];
  refreshDb: () => void;
  addProblem: typeof db.addProblem;
  updateProblem: typeof db.updateProblem;
  deleteProblem: typeof db.deleteProblem;
  addContest: typeof db.addContest;
  updateContest: typeof db.updateContest;
  deleteContest: typeof db.deleteContest;
  updateUserRole: typeof db.updateUserRole;
  toggleUserBan: typeof db.toggleUserBan;
  deleteUser: typeof db.deleteUser;
  addSubmission: typeof db.addSubmission;
  addDiscussion: typeof db.addDiscussion;
  deleteDiscussion: typeof db.deleteDiscussion;
  upvoteDiscussion: typeof db.upvoteDiscussion;
  addSolution: typeof db.addSolution;
  upvoteSolution: typeof db.upvoteSolution;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

import { getApiUrl } from '../utils/apiConfig';

export const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [problems, setProblems] = useState<Problem[]>(() => db.getProblems());
  const [contests, setContests] = useState<Contest[]>(() => db.getContests());
  const [users, setUsers] = useState(() => db.getUsers());
  const [discussions, setDiscussions] = useState<DiscussionPost[]>(() => db.getDiscussions());
  const [solutions, setSolutions] = useState<SolutionPost[]>(() => db.getSolutions());
  const [submissions, setSubmissions] = useState<Submission[]>(() => db.getSubmissions());

  const refreshDb = () => {
    setProblems(db.getProblems());
    setContests(db.getContests());
    setUsers(db.getUsers());
    setDiscussions(db.getDiscussions());
    setSolutions(db.getSolutions());
    setSubmissions(db.getSubmissions());
  };

  useEffect(() => {
    const fetchLiveUsers = async () => {
      try {
        const res = await fetch(getApiUrl('/users'));
        if (res.ok) {
          const apiUsers = await res.json();
          if (Array.isArray(apiUsers) && apiUsers.length > 0) {
            const localUsers = db.getUsers();
            // Merge API users & local users cleanly by username
            const map = new Map();
            localUsers.forEach(u => map.set(u.username.toLowerCase(), u));
            apiUsers.forEach(u => {
              if (u.username) {
                map.set(u.username.toLowerCase(), {
                  _id: u._id || `user-${u.username}`,
                  rank: u.rank || 1,
                  name: u.name || u.username,
                  username: u.username,
                  email: u.email || `${u.username}@nimocode.ai`,
                  avatar: u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.username)}`,
                  rating: u.rating || 1200,
                  solvedCount: u.solvedCount || 0,
                  contestWins: u.contestWins || 0,
                  streak: u.streak || 1,
                  trend: u.trend || 'same',
                  badge: u.badge || 'Knight',
                  country: u.country || 'USA',
                  role: u.role || 'user',
                  level: u.level || 1,
                  currentXP: u.currentXP || 0,
                  nextLevelXP: u.nextLevelXP || 1000,
                  solvedProblemIds: u.solvedProblemIds || [],
                  submissionHeatmap: u.submissionHeatmap || {}
                });
              }
            });

            const merged = Array.from(map.values()).sort((a, b) => b.rating - a.rating);
            const ranked = merged.map((user, idx) => ({ ...user, rank: idx + 1 }));
            setUsers(ranked);
            localStorage.setItem('nimocode_users', JSON.stringify(ranked));
          }
        }
      } catch {}
    };

    fetchLiveUsers();

    const handleDbUpdate = () => {
      refreshDb();
      fetchLiveUsers();
    };

    window.addEventListener('nimocode_db_update', handleDbUpdate);
    return () => {
      window.removeEventListener('nimocode_db_update', handleDbUpdate);
    };
  }, []);

  return (
    <DbContext.Provider
      value={{
        problems,
        contests,
        users,
        discussions,
        solutions,
        submissions,
        refreshDb,
        addProblem: db.addProblem,
        updateProblem: db.updateProblem,
        deleteProblem: db.deleteProblem,
        addContest: db.addContest,
        updateContest: db.updateContest,
        deleteContest: db.deleteContest,
        updateUserRole: db.updateUserRole,
        toggleUserBan: db.toggleUserBan,
        deleteUser: db.deleteUser,
        addSubmission: db.addSubmission,
        addDiscussion: db.addDiscussion,
        deleteDiscussion: db.deleteDiscussion,
        upvoteDiscussion: db.upvoteDiscussion,
        addSolution: db.addSolution,
        upvoteSolution: db.upvoteSolution
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (!context) {
    throw new Error('useDb must be used within a DbProvider');
  }
  return context;
};
