import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, Menu, X, ChevronRight, Zap, Trophy, BookOpen, Users, Compass, Plus, LogOut, Sparkles, ChevronDown, Layers, Bot, Award } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { scrollToSection } from '../../utils/smoothScroll';
import { useAuth } from '../../context/AuthContext';
import { useDb } from '../../context/DbContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const aiMenuRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { users } = useDb();

  const liveUserRecord = user ? users.find(u => u.username?.toLowerCase() === user.username?.toLowerCase()) : null;
  const currentRating = liveUserRecord?.rating ?? user?.rating ?? 1200;


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close AI dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aiMenuRef.current && !aiMenuRef.current.contains(e.target as Node)) {
        setAiMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (sectionId: string, route: string) => {
    setMobileMenuOpen(false);
    setAiMenuOpen(false);
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      navigate(route);
    }
  };

  const isAiActive = ['/interview', '/system-design', '/pair'].some(path => location.pathname.startsWith(path));

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 shadow-xs py-3'
          : 'bg-transparent py-4 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group font-semibold text-lg tracking-tight text-neutral-900 dark:text-white shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Code2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-neutral-950 dark:text-white">
              NimoCode
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200 rounded-md border border-neutral-300 dark:border-neutral-700">
              AI
            </span>
          </Link>

          {/* Desktop Navigation Capsule */}
          <nav className="hidden md:flex items-center gap-1 bg-white/90 dark:bg-neutral-900/80 p-1 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-xs backdrop-blur-md">
            <button
              onClick={() => handleNavClick('problems', '/problems')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                location.pathname.startsWith('/problems')
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Problems
            </button>

            <button
              onClick={() => handleNavClick('contests', '/contests')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                location.pathname.startsWith('/contests')
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Contests
            </button>

            <button
              onClick={() => handleNavClick('duels', '/duels')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                location.pathname.startsWith('/duels')
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              1v1 Duels
            </button>

            {/* AI Labs Dropdown */}
            <div className="relative" ref={aiMenuRef}>
              <button
                onClick={() => setAiMenuOpen(!aiMenuOpen)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isAiActive
                    ? 'bg-amber-500 text-neutral-950 font-extrabold shadow-xs'
                    : 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Labs</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${aiMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {aiMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-2 space-y-1 z-50 animate-fade-in">
                  <Link
                    to="/interview"
                    onClick={() => setAiMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-white transition-colors"
                  >
                    <Bot className="w-4 h-4 text-amber-500" />
                    <div>
                      <div>NVIDIA AI Interview</div>
                      <div className="text-[10px] text-neutral-400 font-normal font-mono">FAANG Audio & Text</div>
                    </div>
                  </Link>

                  <Link
                    to="/assessments"
                    onClick={() => setAiMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-white transition-colors"
                  >
                    <Award className="w-4 h-4 text-purple-500" />
                    <div>
                      <div>FAANG Assessments</div>
                      <div className="text-[10px] text-neutral-400 font-normal font-mono">Timed Interview Loops</div>
                    </div>
                  </Link>

                  <Link
                    to="/system-design"
                    onClick={() => setAiMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-white transition-colors"
                  >
                    <Layers className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div>System Design Canvas</div>
                      <div className="text-[10px] text-neutral-400 font-normal font-mono">Architecture Simulator</div>
                    </div>
                  </Link>

                  <Link
                    to="/pair"
                    onClick={() => setAiMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-white transition-colors"
                  >
                    <Users className="w-4 h-4 text-sky-500" />
                    <div>
                      <div>Pair Programming</div>
                      <div className="text-[10px] text-neutral-400 font-normal font-mono">Live Shared Room</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('leaderboard', '/leaderboard')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                location.pathname === '/leaderboard'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Leaderboard
            </button>

            <button
              onClick={() => handleNavClick('community', '/community')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                location.pathname === '/community'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Community
            </button>

            <button
              onClick={() => handleNavClick('contact', '/contact')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                location.pathname === '/contact'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <ThemeToggle />

            {/* Host Contest Button */}
            <Link
              to="/contests/create"
              className="p-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap"
              title="Host Custom Contest"
            >
              <Plus className="w-4 h-4 text-amber-500" />
              <span className="text-neutral-800 dark:text-neutral-200">Host Contest</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-xs font-bold shadow-xs whitespace-nowrap"
                >
                  <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-neutral-950 dark:text-white font-extrabold">{user.username}</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-extrabold border border-amber-500/20">
                    {currentRating}
                  </span>

                </Link>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4.5 py-2 rounded-xl text-xs font-extrabold bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-1.5 group whitespace-nowrap"
                >
                  Start Coding
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white/98 dark:bg-neutral-950/98 backdrop-blur-xl px-4 py-6 mt-3 space-y-4 animate-fade-in shadow-lg">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono px-4">Core Platform</span>
            <Link
              to="/problems"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-950 dark:text-neutral-100 text-xs font-bold"
            >
              <Compass className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              Problems Catalog
            </Link>
            <Link
              to="/contests"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-950 dark:text-neutral-100 text-xs font-bold"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              Live Contests
            </Link>
            <Link
              to="/duels"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-950 dark:text-neutral-100 text-xs font-bold"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              1v1 Duels
            </Link>
          </div>

          <div className="flex flex-col gap-1 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 font-mono px-4 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Labs
            </span>
            <Link
              to="/interview"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-950 dark:text-neutral-100 text-xs font-bold"
            >
              <Bot className="w-4 h-4 text-amber-500" />
              NVIDIA AI Technical Interview
            </Link>
            <Link
              to="/system-design"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-950 dark:text-neutral-100 text-xs font-bold"
            >
              <Layers className="w-4 h-4 text-emerald-500" />
              System Design Canvas
            </Link>
            <Link
              to="/pair"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-950 dark:text-neutral-100 text-xs font-bold"
            >
              <Users className="w-4 h-4 text-sky-500" />
              Pair Programming Room
            </Link>
          </div>

          <div className="flex flex-col gap-1 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <Link
              to="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-950 dark:text-neutral-100 text-xs font-bold"
            >
              <Trophy className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              Global Leaderboard
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-950 dark:text-neutral-100 text-xs font-bold"
            >
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Learn & Profile
            </Link>
            <Link
              to="/community"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-950 dark:text-neutral-100 text-xs font-bold"
            >
              <Users className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              Community
            </Link>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full text-center py-2.5 rounded-xl border border-rose-500/30 text-xs font-bold text-rose-500"
              >
                Sign Out (@{user.username})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-extrabold text-neutral-950 dark:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold shadow-md"
                >
                  Create Real Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
