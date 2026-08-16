import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, Tag } from 'lucide-react';
import { MOCK_DISCUSSIONS } from '../../data/discussions';

interface ProblemDiscussionProps {
  problemId: string;
}

export const ProblemDiscussion: React.FC<ProblemDiscussionProps> = ({ problemId }) => {
  const [discussions, setDiscussions] = useState(
    MOCK_DISCUSSIONS.filter(d => d.problemId === problemId || problemId === '1')
  );
  const [newPost, setNewPost] = useState('');

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: `disc-${Date.now()}`,
      problemId,
      title: newPost,
      author: 'aarush_dev',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      category: 'General' as const,
      upvotes: 1,
      repliesCount: 0,
      createdAt: 'Just now',
      tags: ['Discussion'],
      content: newPost
    };
    setDiscussions([post, ...discussions]);
    setNewPost('');
  };

  return (
    <div className="space-y-4">
      {/* Create Discussion Post */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
        <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
          Ask a Question / Post Discussion
        </h3>
        <textarea
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="Discuss edge cases, time complexity questions, or alternative approaches..."
          className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none h-20"
        />
        <div className="flex justify-end">
          <button
            onClick={handleCreatePost}
            disabled={!newPost.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            Post
          </button>
        </div>
      </div>

      {/* Discussion List */}
      <div className="space-y-3">
        {discussions.map(disc => (
          <div
            key={disc.id}
            className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={disc.authorAvatar} alt={disc.author} className="w-6 h-6 rounded-full object-cover" />
                <span className="font-semibold text-xs text-neutral-900 dark:text-white">{disc.author}</span>
                <span className="text-[10px] text-neutral-400">• {disc.createdAt}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-bold">
                {disc.category}
              </span>
            </div>

            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{disc.title}</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{disc.content}</p>

            <div className="flex items-center justify-between pt-2 text-xs text-neutral-500 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 hover:text-violet-600 transition-colors font-medium">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{disc.upvotes}</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{disc.repliesCount} replies</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-neutral-400" />
                {disc.tags.map(t => (
                  <span key={t} className="text-[10px] text-neutral-400">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
