import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDb } from '../context/DbContext';
import { getCookie, deleteCookie } from '../utils/cookies';
import { waf } from '../services/waf';
import { getApiUrl } from '../utils/apiConfig';
import type { WafLogEntry } from '../services/waf';
import {
  ShieldAlert,
  Plus,
  Trash2,
  Users,
  Code2,
  Trophy,
  Search,
  LogOut,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  LifeBuoy,
  Mail
} from 'lucide-react';
import type { Category, Difficulty } from '../types';
import { BUILT_IN_ACHIEVEMENTS } from '../utils/achievementEvaluator';



export const AdminPage: React.FC = () => {
  const {
    problems,
    contests,
    users,
    discussions,
    addProblem,
    deleteProblem,
    addContest,
    deleteContest,
    updateUserRole,
    toggleUserBan,
    deleteUser,
    deleteDiscussion,
    achievements,
    addAchievement,
    deleteAchievement
  } = useDb();

  const navigate = useNavigate();

  // Guard Route Security Check
  useEffect(() => {
    const isAuth = getCookie('nimocode_admin_auth') === 'true' || sessionStorage.getItem('nimocode_admin_auth') === 'true';
    if (!isAuth) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleAdminLogout = () => {
    deleteCookie('nimocode_admin_auth');
    deleteCookie('nimocode_admin_username');
    sessionStorage.removeItem('nimocode_admin_auth');
    navigate('/admin/login');
  };

    // Achievements Creation State
  const [showAddAchModal, setShowAddAchModal] = useState(false);
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchDesc, setNewAchDesc] = useState('');
  const [newAchIcon, setNewAchIcon] = useState('🏆');
  const [newAchTarget, setNewAchTarget] = useState(1);
  const [newAchXp, setNewAchXp] = useState(500);

  const handleCreateAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle.trim() || !newAchDesc.trim()) return;

    addAchievement({
      id: `ach-custom-${Date.now()}`,
      title: newAchTitle.trim(),
      description: newAchDesc.trim(),
      icon: newAchIcon || '🏆',
      unlocked: false,
      progress: 0,
      maxProgress: newAchTarget || 1
    });

    setNewAchTitle('');
    setNewAchDesc('');
    setNewAchTarget(1);
    setNewAchXp(500);
    setShowAddAchModal(false);
  };

  const [activeTab, setActiveTab] = useState<'analytics' | 'problems' | 'contests' | 'users' | 'tickets' | 'broadcast' | 'community' | 'waf' | 'achievements'>('analytics');
  const [problemSearch, setProblemSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Email Broadcast State
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('ALL');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<string | null>(null);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastMessage) return;

    setIsBroadcasting(true);
    setBroadcastResult(null);

    try {
      const apiBase = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${apiBase}/admin/broadcast-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: broadcastSubject,
          message: broadcastMessage,
          targetEmail: broadcastTarget
        })
      });

      const data = await res.json();
      if (res.ok) {
        setBroadcastResult(`✅ ${data.message}`);
        setBroadcastSubject('');
        setBroadcastMessage('');
      } else {
        setBroadcastResult(`❌ ${data.error || 'Failed to dispatch email broadcast.'}`);
      }
    } catch {
      setBroadcastResult('❌ Broadcast failed to reach backend API.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Tickets State
  const [tickets, setTickets] = useState<any[]>([]);
  const fetchTickets = async () => {
    try {
      const res = await fetch(getApiUrl('/tickets'));
      if (res.ok) {
        const data = await res.json();
        setTickets(data || []);
      }
    } catch {}
  };

  const handleUpdateTicketStatus = async (id: string, status: string) => {
    try {
      await fetch(getApiUrl(`/tickets/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchTickets();
    } catch {}
  };

  // WAF Logs State
  const [wafLogs, setWafLogs] = useState<WafLogEntry[]>(() => waf.getLogs());

  useEffect(() => {
    fetchTickets();
    const handleWafUpdate = () => {
      setWafLogs(waf.getLogs());
    };
    window.addEventListener('nimocode_waf_update', handleWafUpdate);
    return () => window.removeEventListener('nimocode_waf_update', handleWafUpdate);
  }, []);

  // Modal State for New Problem
  const [showAddProblemModal, setShowAddProblemModal] = useState(false);
  const [newProbTitle, setNewProbTitle] = useState('');
  const [newProbCategory, setNewProbCategory] = useState<Category>('Arrays');
  const [newProbDifficulty, setNewProbDifficulty] = useState<Difficulty>('Easy');
  const [newProbDesc, setNewProbDesc] = useState('');
  const [newProbInput, setNewProbInput] = useState('');
  const [newProbOutput, setNewProbOutput] = useState('');
  const [newProbCppCode] = useState('class Solution {\npublic:\n    void solve() {\n        // Code\n    }\n};');

  // Modal State for New Contest
  const [showAddContestModal, setShowAddContestModal] = useState(false);
  const [newContestTitle, setNewContestTitle] = useState('');
  const [newContestSubtitle, setNewContestSubtitle] = useState('');
  const [newContestFromDate, setNewContestFromDate] = useState(() => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [newContestToDate, setNewContestToDate] = useState(() => {
    const d = new Date(Date.now() + 2 * 60 * 60 * 1000);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [newContestDuration, setNewContestDuration] = useState(120);
  const [newContestStatus, setNewContestStatus] = useState<'LIVE' | 'UPCOMING' | 'PAST'>('UPCOMING');

  const handleFromDateChange = (val: string) => {
    setNewContestFromDate(val);
    if (newContestToDate) {
      const start = new Date(val).getTime();
      const end = new Date(newContestToDate).getTime();
      if (end > start) {
        setNewContestDuration(Math.round((end - start) / 60000));
      }
    }
  };

  const handleToDateChange = (val: string) => {
    setNewContestToDate(val);
    if (newContestFromDate) {
      const start = new Date(newContestFromDate).getTime();
      const end = new Date(val).getTime();
      if (end > start) {
        setNewContestDuration(Math.round((end - start) / 60000));
      }
    }
  };


  const handleCreateProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProbTitle || !newProbDesc) return;

    // WAF inspection
    const wafCheck = waf.inspectInput(newProbTitle + ' ' + newProbDesc, '/api/admin/problems');
    if (!wafCheck.safe) {
      alert(`🛡️ WAF Blocked: Input contains potential ${wafCheck.threatType} threat.`);
      return;
    }

    addProblem({
      slug: newProbTitle.toLowerCase().replace(/\s+/g, '-'),
      title: newProbTitle,
      number: 0,
      difficulty: newProbDifficulty,
      category: newProbCategory,
      tags: [newProbCategory.toLowerCase(), 'algorithm'],
      description: newProbDesc,
      examples: [
        {
          input: newProbInput || 'nums = [1, 2, 3]',
          output: newProbOutput || '6',
          explanation: 'Sample test case execution'
        }
      ],
      constraints: ['1 <= N <= 10^5'],
      hints: ['Consider standard iterative approach'],
      starterCode: {
        cpp: newProbCppCode,
        python: '# Solution\ndef solve():\n    pass',
        javascript: '// Solution\nfunction solve() {}',
        java: 'class Solution {\n    public void solve() {}\n}',
        go: 'package main',
        rust: '// Solution'
      },
      testCases: [
        {
          id: 1,
          input: newProbInput || '1 2 3',
          expectedOutput: newProbOutput || '6',
          isHidden: false
        }
      ]
    });

    setShowAddProblemModal(false);
    setNewProbTitle('');
    setNewProbDesc('');
    setNewProbInput('');
    setNewProbOutput('');
  };

  const handleCreateContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContestTitle.trim()) return;

    const startObj = new Date(newContestFromDate);
    const endObj = new Date(newContestToDate);
    const diffMins = Math.max(15, Math.round((endObj.getTime() - startObj.getTime()) / 60000)) || newContestDuration;
    const formattedStart = `${startObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${startObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    addContest({
      title: newContestTitle.trim(),
      subtitle: newContestSubtitle.trim() || 'Official NimoCode Competitive Sprint',
      startTime: formattedStart,
      endTime: newContestToDate,
      durationMinutes: diffMins,
      status: newContestStatus,
      prizes: ['$500 Gift Card', '$250 Swag Pack'],
      problems: [
        {
          id: problems[0]?.id || '1',
          code: 'A',
          title: problems[0]?.title || 'Two Sum',
          difficulty: problems[0]?.difficulty || 'Easy',
          points: 500,
          solvedCount: 0
        },
        {
          id: problems[1]?.id || '2',
          code: 'B',
          title: problems[1]?.title || 'Reverse Linked List',
          difficulty: problems[1]?.difficulty || 'Easy',
          points: 750,
          solvedCount: 0
        }
      ]
    });

    setShowAddContestModal(false);
    setNewContestTitle('');
    setNewContestSubtitle('');
  };


  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setUserToDelete(null);
    }
  };

  const filteredProblems = problems.filter(p =>
    p.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(problemSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-2xl relative overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              NIMOCODE SECURED ADMIN PORTAL
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">System & Security Management</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> WAF Active
          </span>
          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Portal</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(['analytics', 'problems', 'contests', 'users', 'achievements', 'tickets', 'broadcast', 'community', 'waf'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold capitalize transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === tab
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            {tab === 'achievements' ? (
              <>
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Achievements ({BUILT_IN_ACHIEVEMENTS.length + achievements.length})</span>
              </>
            ) : tab === 'waf' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>WAF Security</span>
              </>
            ) : tab === 'tickets' ? (
              <>
                <LifeBuoy className="w-3.5 h-3.5 text-emerald-500" />
                <span>Support Tickets ({tickets.length})</span>
              </>
            ) : tab === 'broadcast' ? (
              <>
                <Mail className="w-3.5 h-3.5 text-sky-500" />
                <span>Email Broadcast</span>
              </>
            ) : (
              tab
            )}
          </button>
        ))}
      </div>

      {/* 1. ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase">
                <span>Total Users</span>
                <Users className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
              </div>
              <div className="text-3xl font-extrabold text-neutral-950 dark:text-white font-mono">
                {users.length.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">MongoDB Persistence Layer</div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase">
                <span>Active Problems</span>
                <Code2 className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
              </div>
              <div className="text-3xl font-extrabold text-neutral-950 dark:text-white font-mono">
                {problems.length}
              </div>
              <div className="text-[11px] text-neutral-500 font-bold">100% test cases verified</div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase">
                <span>Total Contests</span>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-neutral-950 dark:text-white font-mono">
                {contests.length}
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">1 Arena currently LIVE</div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase">
                <span>WAF Threats Blocked</span>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-neutral-950 dark:text-white font-mono">
                {wafLogs.length}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">0 Breach Incidents</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROBLEMS MANAGER TAB */}
      {activeTab === 'problems' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={problemSearch}
                onChange={e => setProblemSearch(e.target.value)}
                placeholder="Search problem catalog..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white"
              />
            </div>

            <button
              onClick={() => setShowAddProblemModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Problem</span>
            </button>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100/80 dark:bg-neutral-950/80 text-neutral-400 font-bold uppercase border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-4 text-center font-mono">ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-center">Difficulty</th>
                  <th className="p-4 text-center">Submissions</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-semibold">
                {filteredProblems.map(prob => (
                  <tr key={prob.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/50">
                    <td className="p-4 text-center font-mono text-neutral-400">#{prob.number}</td>
                    <td className="p-4 font-bold text-neutral-950 dark:text-white">{prob.title}</td>
                    <td className="p-4">{prob.category}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600' :
                        prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono text-neutral-500">{(prob.totalSubmissions / 1000).toFixed(0)}k</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteProblem(prob.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Delete Problem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CONTESTS MANAGER TAB */}
      {activeTab === 'contests' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-950 dark:text-white">Active Contests</h3>
            <button
              onClick={() => setShowAddContestModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Contest</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contests.map(c => (
              <div key={c.id} className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                    {c.status}
                  </span>
                  <button
                    onClick={() => deleteContest(c.id)}
                    className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold text-base text-neutral-950 dark:text-white">{c.title}</h4>
                  <p className="text-xs text-neutral-500 mt-1">{c.subtitle}</p>
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  Duration: {c.durationMinutes} mins • {c.participantsCount} Coders Registered
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. USER MANAGER TAB (WITH DELETE USER FEATURE) */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search user database..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white"
              />
            </div>
            <span className="text-xs font-mono text-neutral-500">Showing {filteredUsers.length} Users</span>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100/80 dark:bg-neutral-950/80 text-neutral-400 font-bold uppercase border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4 text-center font-mono">Rating</th>
                  <th className="p-4 text-center">Role</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-semibold">
                {filteredUsers.map(u => (
                  <tr key={u.username} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/50">
                    <td className="p-4 flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-neutral-950 dark:text-white">{u.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">@{u.username}</div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-neutral-950 dark:text-white">{u.rating}</td>
                    <td className="p-4 text-center">
                      <select
                        value={u.role}
                        onChange={e => updateUserRole(u.username, e.target.value as any)}
                        className="px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      {u.isBanned ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 text-[10px] font-bold">Banned</span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">Active</span>
                      )}
                    </td>
                    <td className="p-4 text-center flex items-center justify-center gap-2">
                      <button
                        onClick={() => toggleUserBan(u.username)}
                        className="px-2.5 py-1 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        {u.isBanned ? 'Unban' : 'Ban'}
                      </button>

                      {/* DELETE USER BUTTON */}
                      <button
                        onClick={() => setUserToDelete(u.username)}
                        className="px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20 transition-all flex items-center gap-1"
                        title="Permanently Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. SUPPORT TICKETS TAB */}
      {activeTab === 'tickets' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-xs space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-neutral-950 dark:text-white">Support Tickets Dashboard</h3>
              <p className="text-xs text-neutral-400 font-mono">User contact inquiries dispatched from /contact form</p>
            </div>
            <button
              onClick={fetchTickets}
              className="px-3.5 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Tickets</span>
            </button>
          </div>

          {tickets.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-neutral-400">
              No user support tickets submitted yet. Tickets sent from /contact will appear here live!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Subject & Message</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {tickets.map(t => (
                    <tr key={t.id || t._id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/50">
                      <td className="py-3 px-4 font-bold text-amber-500">{t.id || t._id}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-neutral-950 dark:text-white">{t.name}</div>
                        <div className="text-[10px] text-neutral-400">{t.email}</div>
                      </td>
                      <td className="py-3 px-4 text-neutral-400">{t.category}</td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-neutral-900 dark:text-white">{t.subject}</div>
                        <div className="text-[11px] text-neutral-400 truncate">{t.message}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-500' :
                          t.priority === 'High' ? 'bg-amber-500/10 text-amber-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' :
                          t.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' : 'bg-sky-500/10 text-sky-500'
                        }`}>
                          {t.status || 'Open'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        {t.status !== 'Resolved' && (
                          <button
                            onClick={() => handleUpdateTicketStatus(t.id || t._id, 'Resolved')}
                            className="px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[10px] font-bold border border-emerald-500/20"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. EMAIL BROADCAST TAB */}
      {activeTab === 'broadcast' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <h3 className="text-base font-extrabold text-neutral-950 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-sky-500" />
              <span>Admin Mass Email Announcement Dispatch</span>
            </h3>
            <p className="text-xs text-neutral-400 font-mono">Send real HTML emails from nimocodeai@gmail.com to all registered users or specific accounts.</p>
          </div>

          {broadcastResult && (
            <div className={`p-4 rounded-2xl text-xs font-mono font-bold ${
              broadcastResult.startsWith('✅') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
            }`}>
              {broadcastResult}
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs font-medium max-w-2xl">
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider font-mono">Recipient Target</label>
              <select
                value={broadcastTarget}
                onChange={e => setBroadcastTarget(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">📢 All Registered Platform Users ({users.length} Users)</option>
                {users.map(u => (
                  <option key={u.username} value={u.username}>👤 @{u.username}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider font-mono">Announcement Subject *</label>
              <input
                type="text"
                required
                value={broadcastSubject}
                onChange={e => setBroadcastSubject(e.target.value)}
                placeholder="e.g. 🔥 Weekly Grand Coding Contest 42 Starts Tonight!"
                className="w-full px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider font-mono">Announcement HTML / Text Body *</label>
              <textarea
                required
                rows={6}
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                placeholder="Type your official announcement details here..."
                className="w-full px-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={isBroadcasting}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              <span>{isBroadcasting ? 'Dispatching Mass Email...' : 'Send Mass Announcement Email'}</span>
            </button>
          </form>
        </div>
      )}

      {/* 7. COMMUNITY MODERATION TAB */}
      {activeTab === 'community' && (
        <div className="space-y-4">
          {discussions.map(d => (
            <div key={d.id} className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-neutral-950 dark:text-white">{d.title}</h4>
                <p className="text-[11px] text-neutral-500 mt-1">By @{d.author} • {d.category}</p>
              </div>
              <button
                onClick={() => deleteDiscussion(d.id)}
                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 6. WAF SECURITY DASHBOARD TAB */}
      {activeTab === 'waf' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-950 dark:text-white">Live Web Application Firewall (WAF) Logs</h3>
              <p className="text-xs text-neutral-500">Real-time threat inspection engine blocking XSS, SQLi, and RCE payloads.</p>
            </div>
            <button
              onClick={() => { waf.clearLogs(); setWafLogs([]); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Clear Audit Logs
            </button>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-100/80 dark:bg-neutral-950/80 text-neutral-400 font-bold uppercase border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-4">Time</th>
                  <th className="p-4">Threat Vector</th>
                  <th className="p-4 text-center">Severity</th>
                  <th className="p-4">Endpoint</th>
                  <th className="p-4">Blocked Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-semibold">
                {wafLogs.map(log => (
                  <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/50">
                    <td className="p-4 text-neutral-400">{log.timestamp}</td>
                    <td className="p-4 font-bold text-neutral-950 dark:text-white">{log.threatType}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-500">{log.endpoint}</td>
                    <td className="p-4 text-rose-500 max-w-xs truncate">{log.blockedPayload}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-fade-in text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">Delete User Permanently?</h3>
              <p className="text-xs text-neutral-500">
                Are you sure you want to delete user <strong className="text-neutral-900 dark:text-white">@{userToDelete}</strong>? This action will purge their profile and submissions from the database.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PROBLEM MODAL */}
      {showAddProblemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 w-full max-w-2xl space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Add New Problem to NimoCode DB</h3>

            <form onSubmit={handleCreateProblem} className="space-y-3 text-xs font-bold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-600 dark:text-neutral-400">Problem Title</label>
                  <input
                    type="text"
                    required
                    value={newProbTitle}
                    onChange={e => setNewProbTitle(e.target.value)}
                    placeholder="e.g. Reverse Linked List II"
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-600 dark:text-neutral-400">Category</label>
                  <select
                    value={newProbCategory}
                    onChange={e => setNewProbCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  >
                    <option value="Arrays">Arrays</option>
                    <option value="Strings">Strings</option>
                    <option value="Trees">Trees</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400">Difficulty</label>
                <select
                  value={newProbDifficulty}
                  onChange={e => setNewProbDifficulty(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400">Problem Description</label>
                <textarea
                  required
                  rows={3}
                  value={newProbDesc}
                  onChange={e => setNewProbDesc(e.target.value)}
                  placeholder="Problem statement details..."
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-600 dark:text-neutral-400">Sample Input</label>
                  <input
                    type="text"
                    value={newProbInput}
                    onChange={e => setNewProbInput(e.target.value)}
                    placeholder="nums = [1,2,3]"
                    className="w-full p-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-600 dark:text-neutral-400">Expected Output</label>
                  <input
                    type="text"
                    value={newProbOutput}
                    onChange={e => setNewProbOutput(e.target.value)}
                    placeholder="6"
                    className="w-full p-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProblemModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
                >
                  Save Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CONTEST MODAL */}
      {showAddContestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Schedule New Contest</h3>

            <form onSubmit={handleCreateContest} className="space-y-3 text-xs font-bold">
              <div>
                <label className="text-neutral-600 dark:text-neutral-400">Contest Title</label>
                <input
                  type="text"
                  required
                  value={newContestTitle}
                  onChange={e => setNewContestTitle(e.target.value)}
                  placeholder="NimoCode Weekly Sprint 42"
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400">Subtitle</label>
                <input
                  type="text"
                  value={newContestSubtitle}
                  onChange={e => setNewContestSubtitle(e.target.value)}
                  placeholder="Speed run challenge with cash prizes"
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
                    <span>From Date &amp; Time *</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newContestFromDate}
                    onChange={e => handleFromDateChange(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
                    <span>To Date &amp; Time *</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newContestToDate}
                    onChange={e => handleToDateChange(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-600 dark:text-neutral-400">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newContestDuration}
                    onChange={e => setNewContestDuration(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-neutral-600 dark:text-neutral-400">Status</label>
                  <select
                    value={newContestStatus}
                    onChange={e => setNewContestStatus(e.target.value as any)}
                    className="w-full mt-1 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="LIVE">Live Now</option>
                    <option value="PAST">Past</option>
                  </select>
                </div>
              </div>


              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddContestModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold"
                >
                  Launch Contest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 9. ACHIEVEMENTS MANAGER TAB */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-950 dark:text-white">Platform Achievements &amp; Badges</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-mono font-bold">
                  {BUILT_IN_ACHIEVEMENTS.length + achievements.length} Total Badges
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Manage global achievement criteria, reward XP tiers, and deploy custom event milestones for competitive candidates.
              </p>
            </div>

            <button
              onClick={() => setShowAddAchModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-extrabold shadow-md transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Achievement</span>
            </button>
          </div>

          {/* Grid of Achievements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Custom Admin Achievements */}
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-5 rounded-3xl bg-neutral-950 text-white border border-amber-500/30 shadow-lg relative space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl">
                    {ach.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase">
                      Admin Custom
                    </span>
                    <button
                      onClick={() => deleteAchievement(ach.id)}
                      className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete Achievement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-white">{ach.title}</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{ach.description}</p>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Target Scope: {ach.maxProgress || 1}</span>
                  <span className="text-emerald-400 font-bold">+XP Reward</span>
                </div>
              </div>
            ))}

            {/* Built-in Achievements */}
            {BUILT_IN_ACHIEVEMENTS.map((ach) => (
              <div
                key={ach.id}
                className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl">
                    {ach.icon}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-mono font-bold uppercase">
                    Built-in
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white">{ach.title}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{ach.description}</p>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Target: {ach.requiredValue || 1}</span>
                  <span className="text-amber-500 font-bold">+{ach.xpReward || 250} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE ACHIEVEMENT MODAL */}
      {showAddAchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-neutral-950 dark:text-white">Create New Achievement</h3>
              </div>
              <button onClick={() => setShowAddAchModal(false)} className="text-neutral-400 hover:text-neutral-600">✕</button>
            </div>

            <form onSubmit={handleCreateAchievement} className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-neutral-600 dark:text-neutral-400">Achievement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Codeforces Master or Hackathon Champion"
                  value={newAchTitle}
                  onChange={e => setNewAchTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-neutral-600 dark:text-neutral-400">Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe what the user must do to unlock this badge..."
                  value={newAchDesc}
                  onChange={e => setNewAchDesc(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-600 dark:text-neutral-400">Badge Icon</label>
                  <select
                    value={newAchIcon}
                    onChange={e => setNewAchIcon(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-base"
                  >
                    <option value="🏆">🏆 Trophy</option>
                    <option value="👑">👑 Crown</option>
                    <option value="🔥">🔥 Fire</option>
                    <option value="⚡">⚡ Lightning</option>
                    <option value="🚀">🚀 Rocket</option>
                    <option value="💎">💎 Diamond</option>
                    <option value="🧠">🧠 Brain</option>
                    <option value="⚔️">⚔️ Swords</option>
                    <option value="🎖️">🎖️ Medal</option>
                    <option value="🌟">🌟 Star</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-600 dark:text-neutral-400">Solved Target</label>
                  <input
                    type="number"
                    min={1}
                    value={newAchTarget}
                    onChange={e => setNewAchTarget(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-neutral-600 dark:text-neutral-400">XP Reward</label>
                  <input
                    type="number"
                    min={50}
                    step={50}
                    value={newAchXp}
                    onChange={e => setNewAchXp(Number(e.target.value))}
                    className="w-full mt-1 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-4 rounded-2xl bg-neutral-950 text-white border border-neutral-800 space-y-2">
                <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">Badge Live Preview</div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xl">
                    {newAchIcon}
                  </div>
                  <div>
                    <div className="font-bold text-xs">{newAchTitle || 'Untitled Achievement'}</div>
                    <div className="text-[11px] text-neutral-400">{newAchDesc || 'Achievement description preview...'}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAchModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold"
                >
                  Deploy Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
