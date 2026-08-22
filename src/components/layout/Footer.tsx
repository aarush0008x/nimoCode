import React from 'react';
import { Link } from 'react-router-dom';
import { Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800/80 transition-colors duration-200 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-semibold text-lg text-neutral-950 dark:text-white">
              <div className="w-7 h-7 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold text-xs">
                <Code2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">NimoCode</span>
            </Link>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-xs">
              AI-powered competitive programming platform. Turn every failed submission into real progress.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-950 dark:text-white uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 font-medium">
              <li><Link to="/problems" className="hover:text-neutral-950 dark:hover:text-white transition-colors">Problem Explorer</Link></li>
              <li><Link to="/contests" className="hover:text-neutral-950 dark:hover:text-white transition-colors">Live Contests</Link></li>
              <li><Link to="/contests/create" className="hover:text-neutral-950 dark:hover:text-white transition-colors">Host a Contest</Link></li>
              <li><Link to="/leaderboard" className="hover:text-neutral-950 dark:hover:text-white transition-colors">Global Leaderboard</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-950 dark:text-white uppercase tracking-wider text-[11px]">Community</h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 font-medium">
              <li><Link to="/community" className="hover:text-neutral-950 dark:hover:text-white transition-colors">Discussions</Link></li>
              <li><Link to="/profile" className="hover:text-neutral-950 dark:hover:text-white transition-colors">User Profile & XP</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-950 dark:text-white uppercase tracking-wider text-[11px]">Engine Status</h4>
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>NIMO AI ACTIVE</span>
              </div>
              <div className="text-neutral-500">Latency: 12ms</div>
              <div className="text-neutral-500 font-bold">WAF Shield Engaged</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-xs">
          <div>© 2026 NimoCode Inc. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/problems" className="hover:text-neutral-900 dark:hover:text-white">Privacy</Link>
            <Link to="/problems" className="hover:text-neutral-900 dark:hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
