import React, { useState } from 'react';
import { X, Trophy, CheckCircle2, Lock } from 'lucide-react';

interface SkillNode {
  id: string;
  name: string;
  category: string;
  tier: number;
  xpRequired: number;
  solvedRequired: number;
  unlocked: boolean;
  icon: string;
  description: string;
  badgeTitle: string;
}

interface SkillTreeModalProps {
  onClose: () => void;
  userSolvedCount: number;
  userXP: number;
}

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({ onClose, userSolvedCount, userXP }) => {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

  const skills: SkillNode[] = [
    {
      id: 'arrays',
      name: 'Arrays & Two Pointers',
      category: 'Foundation',
      tier: 1,
      xpRequired: 100,
      solvedRequired: 5,
      unlocked: true,
      icon: '⚡',
      description: 'Master in-place manipulation, prefix sums, and two-pointer sliding windows.',
      badgeTitle: 'Array Architect'
    },
    {
      id: 'hashmap',
      name: 'Hash Tables & Sets',
      category: 'Foundation',
      tier: 1,
      xpRequired: 250,
      solvedRequired: 10,
      unlocked: true,
      icon: '🗂️',
      description: 'O(1) average lookup, frequency counters, and collision resolution techniques.',
      badgeTitle: 'Lookup Master'
    },
    {
      id: 'trees',
      name: 'Binary Trees & BSTs',
      category: 'Intermediate',
      tier: 2,
      xpRequired: 500,
      solvedRequired: 20,
      unlocked: userSolvedCount >= 15 || userXP >= 400,
      icon: '🌳',
      description: 'Pre/In/Post order traversals, Lowest Common Ancestor, and balanced tree validations.',
      badgeTitle: 'Tree Ninja'
    },
    {
      id: 'graphs',
      name: 'Graph Theory (BFS/DFS/Dijkstra)',
      category: 'Intermediate',
      tier: 2,
      xpRequired: 800,
      solvedRequired: 30,
      unlocked: userSolvedCount >= 25,
      icon: '🕸️',
      description: 'Topological sort, shortest paths, bipartite matching, and connected components.',
      badgeTitle: 'Graph Grandmaster'
    },
    {
      id: 'dp',
      name: 'Dynamic Programming & Memoization',
      category: 'Advanced',
      tier: 3,
      xpRequired: 1200,
      solvedRequired: 50,
      unlocked: userSolvedCount >= 40,
      icon: '🧩',
      description: 'State transitions, 0/1 Knapsack, Longest Common Subsequence, and interval DP.',
      badgeTitle: 'DP Wizard'
    },
    {
      id: 'system_design',
      name: 'Distributed Systems & FAANG Ready',
      category: 'Mastery',
      tier: 4,
      xpRequired: 2000,
      solvedRequired: 75,
      unlocked: userSolvedCount >= 60,
      icon: '👑',
      description: 'Consistent hashing, CAP theorem, sharding, caching, and FAANG hiring loop mastery.',
      badgeTitle: 'FAANG Principal'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in text-left">
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-4xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Algorithmic RPG Skill Tree</h3>
              <p className="text-xs text-neutral-400 font-mono">Unlock Specialization Nodes & FAANG Badges</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => setSelectedNode(skill)}
              className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-48 group ${
                skill.unlocked
                  ? 'bg-neutral-900 border-amber-500/40 hover:border-amber-400 shadow-md hover:scale-102'
                  : 'bg-neutral-950/60 border-neutral-800/80 opacity-60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{skill.icon}</span>
                  {skill.unlocked ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      LOCKED
                    </span>
                  )}
                </div>

                <div className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                  {skill.name}
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{skill.description}</p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-800/60">
                <span>Tier {skill.tier} • {skill.category}</span>
                <span className="text-amber-400 font-bold">{skill.badgeTitle}</span>
              </div>
            </button>
          ))}
        </div>

        {selectedNode && (
          <div className="p-5 rounded-2xl bg-neutral-900 border border-amber-500/30 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <span className="text-xl">{selectedNode.icon}</span>
                <span>{selectedNode.name} Specialization</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">Badge: {selectedNode.badgeTitle}</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">{selectedNode.description}</p>
            <div className="text-[11px] font-mono text-neutral-400 pt-1">
              Requirements: {selectedNode.solvedRequired} Solved Problems • {selectedNode.xpRequired} XP
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs border border-neutral-800 transition-all"
          >
            Close Tree
          </button>
        </div>
      </div>
    </div>
  );
};
