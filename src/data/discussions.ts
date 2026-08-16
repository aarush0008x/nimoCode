import type { DiscussionPost } from '../types';

export const MOCK_DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'disc-1',
    problemId: '1',
    problemTitle: 'Two Sum',
    title: 'Why is unordered_map faster than map in C++ for this problem?',
    author: 'cpp_master',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    category: 'Algorithmic Tips',
    upvotes: 128,
    repliesCount: 34,
    createdAt: '3 hours ago',
    tags: ['C++', 'Hash Map', 'Optimization'],
    content: '`std::map` is implemented as a Red-Black tree giving O(log N) lookups, whereas `std::unordered_map` uses hash tables providing average O(1) time complexity.'
  },
  {
    id: 'disc-2',
    title: 'How to transition from 1600 rating to Knight (1800+) in CodeArena contests?',
    author: 'coder_pro',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    category: 'Interview Prep',
    upvotes: 245,
    repliesCount: 89,
    createdAt: '1 day ago',
    tags: ['Contests', 'Rating', 'Strategy'],
    content: 'Focus heavily on Medium Dynamic Programming, Monotonic Stack, and Graph Traversal. Always aim to solve problem C within 35 minutes.'
  },
  {
    id: 'disc-3',
    title: 'Meta & Google Interview Preparation Plan 2026',
    author: 'sarah_tech',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    category: 'Career',
    upvotes: 512,
    repliesCount: 142,
    createdAt: '3 days ago',
    tags: ['FAANG', 'Interview', 'Guide'],
    content: 'A comprehensive study list of 75 essential problems categorised by pattern and company frequency.'
  }
];
