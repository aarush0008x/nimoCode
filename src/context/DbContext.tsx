import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/db';
import type { Problem, Contest, LeaderboardEntry, DiscussionPost, SolutionPost, Submission, UserReview } from '../types';

interface DbContextType {
  problems: Problem[];
  contests: Contest[];
  users: (LeaderboardEntry & { role: 'admin' | 'user' | 'moderator'; isBanned?: boolean })[];
  discussions: DiscussionPost[];
  solutions: SolutionPost[];
  submissions: Submission[];
  reviews: UserReview[];
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
  addReview: typeof db.addReview;
  likeReview: typeof db.likeReview;
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
  const [reviews, setReviews] = useState<UserReview[]>(() => db.getReviews());

  const refreshDb = () => {
    setProblems(db.getProblems());
    setContests(db.getContests());
    setUsers(db.getUsers());
    setDiscussions(db.getDiscussions());
    setSolutions(db.getSolutions());
    setSubmissions(db.getSubmissions());
    setReviews(db.getReviews());
  };


  useEffect(() => {
    const fetchLiveUsers = async () => {
      try {
        const res = await fetch(getApiUrl('/users'));
        if (res.ok) {
          const apiUsers = await res.json();
          if (Array.isArray(apiUsers) && apiUsers.length > 0) {
            const localUsers = db.getUsers();
            const map = new Map();
            localUsers.forEach(u => map.set(u.username.toLowerCase(), u));
            apiUsers.forEach(u => {
              if (u.username) {
                const prevLocal = map.get(u.username.toLowerCase());
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
                  submissionHeatmap: u.submissionHeatmap || {},
                  bio: u.bio || prevLocal?.bio || '',
                  college: u.college || prevLocal?.college || '',
                  gradYear: u.gradYear || prevLocal?.gradYear || '',
                  major: u.major || prevLocal?.major || '',
                  friends: u.friends || prevLocal?.friends || [],
                  socialLinks: u.socialLinks || prevLocal?.socialLinks || {}
                });

              }
            });

            const merged = Array.from(map.values()).sort((a, b) => (b.rating || 1200) - (a.rating || 1200));
            const ranked = merged.map((user, idx) => ({ ...user, rank: idx + 1 }));
            setUsers(ranked);
            localStorage.setItem('nimocode_users', JSON.stringify(ranked));
            localStorage.setItem('nimocode_users_v1', JSON.stringify(ranked));
            window.dispatchEvent(new Event('nimocode_db_update'));

          }
        }
      } catch {}
    };


    const fetchLiveContests = async () => {
      try {
        const res = await fetch(getApiUrl('/contests'));
        if (res.ok) {
          const apiContests = await res.json();
          if (Array.isArray(apiContests)) {
            const cleanContests = apiContests.filter(c => (c.title || '').toLowerCase() !== 'test' && (c.subtitle || '').toLowerCase() !== 'test');
            setContests(cleanContests);
            localStorage.setItem('nimocode_contests_v1', JSON.stringify(cleanContests));
          }
        }
      } catch {}
    };

    const fetchLiveDiscussions = async () => {
      try {
        const res = await fetch(getApiUrl('/discussions'));
        if (res.ok) {
          const apiDiscussions = await res.json();
          if (Array.isArray(apiDiscussions)) {
            const clean = apiDiscussions.filter(d => d.author !== 'cpp_master' && d.author !== 'coder_pro' && d.author !== 'sarah_tech');
            setDiscussions(clean);
            localStorage.setItem('nimocode_discussions_v1', JSON.stringify(clean));
          }
        }
      } catch {}
    };

    const fetchLiveReviews = async () => {
      try {
        const res = await fetch(getApiUrl('/reviews'));
        if (res.ok) {
          const apiReviews = await res.json();
          if (Array.isArray(apiReviews) && apiReviews.length > 0) {
            setReviews(apiReviews);
            localStorage.setItem('nimocode_reviews_v1', JSON.stringify(apiReviews));
          }
        }
      } catch {}
    };

    fetchLiveUsers();
    fetchLiveContests();
    fetchLiveDiscussions();
    fetchLiveReviews();

    const interval = setInterval(() => {
      fetchLiveUsers();
      fetchLiveContests();
      fetchLiveDiscussions();
      fetchLiveReviews();
    }, 4000);

    const handleDbUpdate = () => {
      refreshDb();
      fetchLiveUsers();
      fetchLiveContests();
      fetchLiveDiscussions();
      fetchLiveReviews();
    };

    window.addEventListener('nimocode_db_update', handleDbUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('nimocode_db_update', handleDbUpdate);
    };
  }, []);

  const handleAddContest = (contestData: Omit<Contest, 'id' | 'participantsCount'>): Contest => {
    const created = db.addContest(contestData);
    // Remote sync to real MongoDB Atlas backend
    fetch(getApiUrl('/contests'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created)
    }).then(async (res) => {
      if (res.ok) {
        const refreshed = await fetch(getApiUrl('/contests'));
        if (refreshed.ok) {
          const liveList = await refreshed.json();
          if (Array.isArray(liveList) && liveList.length > 0) {
            setContests(liveList);
            localStorage.setItem('nimocode_contests_v1', JSON.stringify(liveList));
          }
        }
      }
    }).catch(() => {});
    return created;
  };

  return (
    <DbContext.Provider
      value={{
        problems,
        contests,
        users,
        discussions,
        solutions,
        submissions,
        reviews,
        refreshDb,
        addProblem: db.addProblem,
        updateProblem: db.updateProblem,
        deleteProblem: db.deleteProblem,
        addContest: handleAddContest,
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
        upvoteSolution: db.upvoteSolution,
        addReview: db.addReview,
        likeReview: db.likeReview
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

