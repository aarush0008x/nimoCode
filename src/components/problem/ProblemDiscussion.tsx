import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, Tag, Trash2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDb } from '../../context/DbContext';
import { useAuth } from '../../context/AuthContext';

interface ProblemDiscussionProps {
  problemId: string;
  problemTitle?: string;
}

export const ProblemDiscussion: React.FC<ProblemDiscussionProps> = ({ problemId, problemTitle = '' }) => {
  const { discussions, addDiscussion, upvoteDiscussion, deleteDiscussion } = useDb();
  const { user } = useAuth();
  const [newPost, setNewPost] = useState('');
  const [selectedTag, setSelectedTag] = useState('Optimization');

  // Filter real discussions for this specific problem
  const problemDiscussions = (discussions || []).filter(
    d => String(d.problemId) === String(problemId) &&
    d.author !== 'cpp_master' && d.author !== 'coder_pro' && d.author !== 'sarah_tech'
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;

    addDiscussion({
      problemId: String(problemId),
      problemTitle: problemTitle,
      title: newPost.slice(0, 80),
      author: user.username,
      authorAvatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.username)}`,
      category: 'Algorithmic Tips',
      tags: [selectedTag, 'DSA'],
      content: newPost
    });

    setNewPost('');
  };

  return (
    <div className="space-y-4">
      {/* Create Discussion Post */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>Problem Discussion & Community Notes</span>
          </h3>
          <span className="text-[11px] font-mono text-neutral-400">
            {problemDiscussions.length} Post{problemDiscussions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {user ? (
          <form onSubmit={handleCreatePost} className="space-y-3">
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="Ask a question, share edge case insights, time complexity analysis, or alternative approaches..."
              className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none h-20 placeholder-neutral-400"
            />
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <span className="text-[11px] font-mono">Tag:</span>
                {(['Optimization', 'Edge Cases', 'C++', 'Python', 'Help'] as const).map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      selectedTag === tag
                        ? 'bg-amber-500 text-neutral-950 shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!newPost.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs transition-all disabled:opacity-40 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center space-y-2">
            <p className="text-xs text-neutral-500">Sign in to participate in the problem discussions and share your approaches.</p>
            <Link
              to="/login"
              className="inline-block px-4 py-1.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs hover:bg-amber-600 transition-all"
            >
              Sign In to Post
            </Link>
          </div>
        )}
      </div>

      {/* Discussion List */}
      <div className="space-y-3">
        {problemDiscussions.length > 0 ? (
          problemDiscussions.map(disc => {
            const isAuthor = user && (user.username.toLowerCase() === disc.author.toLowerCase() || user.role === 'admin');

            return (
              <div
                key={disc.id}
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={disc.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(disc.author)}`}
                      alt={disc.author}
                      className="w-6 h-6 rounded-full object-cover border border-neutral-200 dark:border-neutral-800"
                    />
                    <span className="font-bold text-xs text-neutral-900 dark:text-white">@{disc.author}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">• {disc.createdAt || 'Recent'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">
                      {disc.category}
                    </span>
                    {isAuthor && (
                      <button
                        onClick={() => deleteDiscussion(disc.id)}
                        title="Delete Post"
                        className="p-1 text-neutral-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium whitespace-pre-wrap">
                  {disc.content}
                </p>

                <div className="flex items-center justify-between pt-2 text-xs text-neutral-500 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => upvoteDiscussion(disc.id)}
                      className="flex items-center gap-1.5 hover:text-amber-500 transition-colors font-bold text-xs"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{disc.upvotes || 1}</span>
                    </button>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400">
                      <MessageSquare className="w-3 h-3" />
                      <span>{disc.repliesCount || 0} replies</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-neutral-400" />
                    {(disc.tags || []).map(t => (
                      <span key={t} className="text-[10px] font-mono text-neutral-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-dashed border-neutral-200 dark:border-neutral-800 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-amber-500/60 mx-auto" />
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">No discussions posted yet</h4>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              Be the first to share an insight, testcase edge condition, or question for this problem.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

