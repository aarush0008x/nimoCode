import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Zap,
  UserCheck,
  ArrowRight,
  Award,
  Edit3,
  GraduationCap,
  Globe,
  Users
} from 'lucide-react';
import { GitHubIcon, LinkedInIcon, TwitterIcon } from '../components/common/SocialIcons';
import { useAuth } from '../context/AuthContext';

import { ContributionHeatmap } from '../components/profile/ContributionHeatmap';
import { SkillRadar } from '../components/profile/SkillRadar';
import { AchievementCard } from '../components/profile/AchievementCard';
import { GitHubSyncCard } from '../components/profile/GitHubSyncCard';
import { CertificateModal } from '../components/profile/CertificateModal';
import { DailyQuestsModal } from '../components/profile/DailyQuestsModal';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { FriendsSection } from '../components/profile/FriendsSection';
import { getRankDivision } from '../utils/ranks';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'friends'>('overview');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);


  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 pt-36 pb-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mx-auto text-neutral-800 dark:text-neutral-200">
          <UserCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-neutral-950 dark:text-white">Sign In to Access Your Profile</h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Create a real account or sign in to track your solved problems, gain XP, earn achievements, and view your 365-day submission heatmap.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <span>Create Real Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const xpPercent = Math.min(100, Math.floor((user.currentXP / user.nextLevelXP) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white dark:border-neutral-800 shadow-lg"
              />
              <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-white text-xs border-2 border-white dark:border-neutral-900" title="Online" />
            </div>

            <div className="space-y-2 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                  {user.name}
                </h1>
                {(() => {
                  const div = getRankDivision(user.rating);
                  return (
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold font-mono border flex items-center gap-1.5 ${div.bgColor} ${div.color} ${div.borderColor}`}>
                      <span>{div.icon}</span>
                      <span>{div.name} Division</span>
                    </span>
                  );
                })()}

                <button
                  onClick={() => setShowEditProfileModal(true)}
                  className="px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                  title="Edit Profile & College Info"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-500">
                <span className="text-neutral-400">@{user.username}</span>
                {user.email && <span>• {user.email}</span>}
                {user.college && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 font-sans">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{user.college}</span>
                    {user.gradYear && <span className="font-mono">'{String(user.gradYear).slice(-2)}</span>}
                  </span>
                )}
                {user.major && (
                  <span className="text-neutral-400 font-sans">({user.major})</span>
                )}
              </div>

              {/* Bio snippet */}
              {user.bio ? (
                <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed pt-1">
                  {user.bio}
                </p>
              ) : (
                <p className="text-xs text-neutral-400 italic pt-1 cursor-pointer hover:text-amber-500 transition-colors" onClick={() => setShowEditProfileModal(true)}>
                  + Add bio, university, and social links to customize your profile...
                </p>
              )}

              {/* Social Links */}
              {user.socialLinks && Object.values(user.socialLinks).some(Boolean) && (
                <div className="flex items-center gap-2 pt-1">
                  {user.socialLinks?.github && (
                    <a
                      href={user.socialLinks.github.startsWith('http') ? user.socialLinks.github : `https://github.com/${user.socialLinks.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="GitHub Profile"
                    >
                      <GitHubIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {user.socialLinks?.linkedin && (
                    <a
                      href={user.socialLinks.linkedin.startsWith('http') ? user.socialLinks.linkedin : `https://linkedin.com/in/${user.socialLinks.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-sky-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="LinkedIn Profile"
                    >
                      <LinkedInIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {user.socialLinks?.twitter && (
                    <a
                      href={user.socialLinks.twitter.startsWith('http') ? user.socialLinks.twitter : `https://x.com/${user.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-sky-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Twitter / X"
                    >
                      <TwitterIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {user.socialLinks.website && (
                    <a
                      href={user.socialLinks.website.startsWith('http') ? user.socialLinks.website : `https://${user.socialLinks.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-emerald-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Personal Website"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>


          {/* Gamification Level & XP bar */}
          <div className="flex flex-col gap-3">
            <div className="w-full sm:w-72 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-neutral-900 dark:text-white flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Level {user.level}
                </span>
                <span className="font-mono text-neutral-500 text-[11px]">
                  {user.currentXP} / {user.nextLevelXP} XP
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                <div
                  style={{ width: `${xpPercent}%` }}
                  className="h-full bg-neutral-950 dark:bg-white rounded-full transition-all duration-1000"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowCertificateModal(true)}
                className="w-full py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>FAANG Certificate</span>
              </button>

              <button
                onClick={() => setShowQuestsModal(true)}
                className="w-full py-2.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs border border-neutral-800 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Daily Quests (+XP)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center">
            <div className="text-[11px] text-neutral-400 font-medium uppercase font-sans">Rating</div>
            <div className="text-xl font-extrabold text-neutral-950 dark:text-white font-mono mt-0.5">
              {user.rating}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center">
            <div className="text-[11px] text-neutral-400 font-medium uppercase font-sans">Global Rank</div>
            <div className="text-xl font-extrabold text-neutral-950 dark:text-white font-mono mt-0.5">
              #{user.globalRank}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center">
            <div className="text-[11px] text-neutral-400 font-medium uppercase font-sans">Total Solved</div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              {user.totalSolved}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center">
            <div className="text-[11px] text-neutral-400 font-medium uppercase font-sans">Current Streak</div>
            <div className="text-xl font-extrabold text-amber-500 font-mono mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 fill-amber-500 inline" /> {user.streakDays}d
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all duration-200 ${
            activeTab === 'overview'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab('friends')}
          className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'friends'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Friends ({user.friends?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-xl transition-all duration-200 ${
            activeTab === 'achievements'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
          }`}
        >
          Achievements ({user.achievements.length})
        </button>
      </div>


      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 365 Day Heatmap */}
          <ContributionHeatmap heatmapData={user.submissionHeatmap} />

          {/* Grid: Skill Radar + Solved Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SkillRadar
              skillBreakdown={user.skillBreakdown}
              weakArea={user.weakArea}
              recommendedTopic={user.recommendedTopic}
            />

            {/* Solved Stats Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Difficulty Breakdown</h3>
                <span className="text-xs font-mono font-bold text-neutral-400">
                  {user.totalSolved} Solved
                </span>
              </div>

              <div className="space-y-4">
                {/* Easy */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-emerald-600 dark:text-emerald-400">Easy</span>
                    <span className="font-mono text-neutral-500">{user.solvedStats.easy} / {user.solvedStats.easyTotal}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      style={{ width: `${(user.solvedStats.easy / user.solvedStats.easyTotal) * 100}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Medium */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-amber-600 dark:text-amber-400">Medium</span>
                    <span className="font-mono text-neutral-500">{user.solvedStats.medium} / {user.solvedStats.mediumTotal}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      style={{ width: `${(user.solvedStats.medium / user.solvedStats.mediumTotal) * 100}%` }}
                      className="h-full bg-amber-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Hard */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-rose-600 dark:text-rose-400">Hard</span>
                    <span className="font-mono text-neutral-500">{user.solvedStats.hard} / {user.solvedStats.hardTotal}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      style={{ width: `${(user.solvedStats.hard / user.solvedStats.hardTotal) * 100}%` }}
                      className="h-full bg-rose-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub Solution Sync */}
            <GitHubSyncCard />
          </div>
        </div>
      )}

      {/* Friends Tab Content */}
      {activeTab === 'friends' && (
        <FriendsSection
          user={user}
          onOpenEditProfile={() => setShowEditProfileModal(true)}
        />
      )}

      {/* Achievements Tab Content */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {user.achievements.map(ach => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      )}

      {/* Modals */}
      {showEditProfileModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfileModal(false)}
        />
      )}

      {showCertificateModal && (
        <CertificateModal
          user={user}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {showQuestsModal && (
        <DailyQuestsModal
          user={user}
          onClose={() => setShowQuestsModal(false)}
        />
      )}
    </div>
  );
};

