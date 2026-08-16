import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Plus, Search, Users, AlertTriangle, Eye, Sparkles } from 'lucide-react';
import { useDb } from '../context/DbContext';
import { useAuth } from '../context/AuthContext';
import { waf } from '../services/waf';
import type { DiscussionPost } from '../types';

export const CommunityPage: React.FC = () => {
  const { discussions, solutions, addDiscussion, upvoteDiscussion, upvoteSolution } = useDb();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'Discussions' | 'Solutions'>('Discussions');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for New Discussion
  const [showNewDiscussionModal, setShowNewDiscussionModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DiscussionPost['category']>('Algorithmic Tips');
  const [newContent, setNewContent] = useState('');
  const [newTagsStr, setNewTagsStr] = useState('C++, Optimization');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('You must be signed in to post a discussion.');
      return;
    }

    if (!newTitle.trim() || !newContent.trim()) {
      setErrorMsg('Please enter both a title and content.');
      return;
    }

    // WAF Threat Inspection
    const titleCheck = waf.inspectInput(newTitle, '/api/discussions');
    const contentCheck = waf.inspectInput(newContent, '/api/discussions');

    if (!titleCheck.safe || !contentCheck.safe) {
      setErrorMsg(`🛡️ Blocked by NimoCode WAF: Potential XSS/SQLi payload detected in post.`);
      return;
    }

    const parsedTags = newTagsStr
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    addDiscussion({
      title: newTitle,
      author: user.username,
      authorAvatar: user.avatar,
      category: newCategory,
      tags: parsedTags.length > 0 ? parsedTags : ['General'],
      content: newContent
    });

    setShowNewDiscussionModal(false);
    setNewTitle('');
    setNewContent('');
  };

  const filteredDiscussions = discussions.filter(
    d =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSolutions = solutions.filter(
    s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.problemTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
            <Users className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
            COMMUNITY FORUM
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            Developer Discussions & Solutions
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl font-medium">
            Share algorithmic insights, discuss competitive strategies, and learn from registered developers.
          </p>
        </div>

        {user ? (
          <button
            onClick={() => setShowNewDiscussionModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-xs transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Discussion</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-xs transition-all self-start md:self-auto"
          >
            <span>Sign In to Post</span>
          </Link>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('Discussions')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 ${
              activeTab === 'Discussions'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Discussions ({discussions.length})
          </button>
          <button
            onClick={() => setActiveTab('Solutions')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 ${
              activeTab === 'Solutions'
                ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Shared Solutions ({solutions.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search discussions & code..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>
      </div>

      {/* Discussions Feed */}
      {activeTab === 'Discussions' ? (
        filteredDiscussions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">No Discussions Yet</h3>
              <p className="text-xs text-neutral-500">Be the first registered developer on NimoCode to start a discussion thread!</p>
            </div>
            {user ? (
              <button
                onClick={() => setShowNewDiscussionModal(true)}
                className="px-5 py-2.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs shadow-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Discussion</span>
              </button>
            ) : (
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs shadow-xs inline-block"
              >
                Sign Up & Post Thread
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDiscussions.map(disc => (
              <div
                key={disc.id}
                className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={disc.authorAvatar} alt={disc.author} className="w-8 h-8 rounded-full object-cover shadow-xs" />
                    <div>
                      <div className="font-bold text-xs text-neutral-950 dark:text-white">@{disc.author}</div>
                      <div className="text-[10px] text-neutral-400">{disc.createdAt}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold border border-neutral-300 dark:border-neutral-700">
                    {disc.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-950 dark:text-white">{disc.title}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">{disc.content}</p>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-500">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => upvoteDiscussion(disc.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-bold transition-all"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
                      <span>{disc.upvotes}</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-neutral-400" />
                      <span>{disc.repliesCount} replies</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {disc.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-950 text-[10px] text-neutral-500 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        filteredSolutions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-neutral-950 dark:text-white">No Shared Solutions Yet</h3>
              <p className="text-xs text-neutral-500">Solve a problem in the Code Editor and share your solution with the community!</p>
            </div>
            <Link
              to="/problems"
              className="px-5 py-2.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs shadow-xs inline-block"
            >
              Go to Problems
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSolutions.map(sol => (
              <div
                key={sol.id}
                className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={sol.authorAvatar} alt={sol.author} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-xs text-neutral-950 dark:text-white">@{sol.author}</div>
                      <div className="text-[10px] text-neutral-400">{sol.problemTitle} • {sol.createdAt}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase">{sol.language}</span>
                </div>

                <h3 className="text-sm font-bold text-neutral-950 dark:text-white">{sol.title}</h3>

                <pre className="p-4 rounded-2xl bg-neutral-950 text-neutral-100 font-mono text-xs overflow-x-auto border border-neutral-800">
                  <code>{sol.code}</code>
                </pre>

                <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => upvoteSolution(sol.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-bold transition-all"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
                      <span>{sol.upvotes}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-neutral-400" />
                      {sol.views} views
                    </span>
                  </div>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{sol.runtimeMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* CREATE NEW DISCUSSION MODAL */}
      {showNewDiscussionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Start New Community Discussion</h3>
              <span className="text-xs font-mono text-neutral-400">Posting as @{user?.username}</span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePostDiscussion} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="text-neutral-700 dark:text-neutral-300">Discussion Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Why is unordered_map faster than map in C++?"
                  className="w-full mt-1 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-medium focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-700 dark:text-neutral-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full mt-1 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="Algorithmic Tips">Algorithmic Tips</option>
                    <option value="Interview Prep">Interview Prep</option>
                    <option value="General">General</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Career">Career</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-700 dark:text-neutral-300">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={newTagsStr}
                    onChange={e => setNewTagsStr(e.target.value)}
                    placeholder="C++, Optimization"
                    className="w-full mt-1 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-700 dark:text-neutral-300">Discussion Content *</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Elaborate your question, algorithmic breakdown, or competitive insights..."
                  className="w-full mt-1 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-medium focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-[11px] text-neutral-400 font-mono">Protected by WAF Threat Scanner</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewDiscussionModal(false)}
                    className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold shadow-md"
                  >
                    Post Discussion
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
