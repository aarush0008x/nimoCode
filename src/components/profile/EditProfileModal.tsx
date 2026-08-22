import React, { useState } from 'react';
import { X, User, GraduationCap, Globe, Save, CheckCircle2, Building, BookOpen, Calendar } from 'lucide-react';
import { GitHubIcon, LinkedInIcon, TwitterIcon } from '../common/SocialIcons';
import type { UserProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';


interface EditProfileModalProps {
  user: UserProfile;
  onClose: () => void;
}

const POPULAR_COLLEGES = [
  'IIT Bombay',
  'IIT Delhi',
  'IIT Madras',
  'IIT Kanpur',
  'IIT Kharagpur',
  'BITS Pilani',
  'Stanford University',
  'MIT',
  'UC Berkeley',
  'Carnegie Mellon University',
  'Harvard University',
  'Delhi Technological University (DTU)',
  'NIT Trichy',
  'NIT Surathkal',
  'IIIT Hyderabad',
  'IIIT Bangalore',
  'University of Waterloo',
  'National University of Singapore (NUS)'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose }) => {
  const { updateUserProfile } = useAuth();

  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [college, setCollege] = useState(user.college || '');
  const [gradYear, setGradYear] = useState(user.gradYear ? String(user.gradYear) : '');
  const [major, setMajor] = useState(user.major || '');
  const [github, setGithub] = useState(user.socialLinks?.github || '');
  const [linkedin, setLinkedin] = useState(user.socialLinks?.linkedin || '');
  const [twitter, setTwitter] = useState(user.socialLinks?.twitter || '');
  const [website, setWebsite] = useState(user.socialLinks?.website || '');

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateUserProfile({
        name: name.trim(),
        bio: bio.trim(),
        college: college.trim(),
        gradYear: gradYear.trim() ? parseInt(gradYear.trim(), 10) || gradYear.trim() : '',
        major: major.trim(),
        socialLinks: {
          github: github.trim(),
          linkedin: linkedin.trim(),
          twitter: twitter.trim(),
          website: website.trim()
        }
      });
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 relative text-left my-8 max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-neutral-950 dark:text-white">Edit Profile & Campus Info</h2>
              <p className="text-xs text-neutral-500 font-medium">Update your bio, university details, and social links</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider font-mono">
              1. Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Aarush Singh"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Username (@handle)
                </label>
                <input
                  type="text"
                  value={`@${user.username}`}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs font-mono font-bold text-neutral-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                About / Bio
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                placeholder="Tell the community about yourself, your coding journey, target companies, or favorite DSA topics..."
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Education & Campus Info */}
          <div className="space-y-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                <span>2. Education & Campus Leaderboard</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Enables College Filter
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-neutral-400" />
                <span>College / University Name</span>
              </label>
              <input
                type="text"
                list="college-suggestions"
                value={college}
                onChange={e => setCollege(e.target.value)}
                placeholder="e.g. IIT Bombay, Stanford University, BITS Pilani, MIT..."
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <datalist id="college-suggestions">
                {POPULAR_COLLEGES.map(c => (
                  <option key={c} value={c} />
                ))}
              </datalist>

              {/* Quick college chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {POPULAR_COLLEGES.slice(0, 6).map(c => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCollege(c)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      college === c
                        ? 'bg-emerald-500 text-neutral-950 border-emerald-400'
                        : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-emerald-500/50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Degree & Major / Branch</span>
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={e => setMajor(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science & Eng"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Graduation Year</span>
                </label>
                <input
                  type="text"
                  value={gradYear}
                  onChange={e => setGradYear(e.target.value)}
                  placeholder="e.g. 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-bold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="space-y-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-sky-500" />
              <span>3. Social Profiles & Portfolios</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <GitHubIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>GitHub Profile URL</span>
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={e => setGithub(e.target.value)}
                  placeholder="https://github.com/yourhandle"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <LinkedInIcon className="w-3.5 h-3.5 text-sky-500" />
                  <span>LinkedIn Profile URL</span>
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={e => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourhandle"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <TwitterIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Twitter / X Profile URL</span>
                </label>
                <input
                  type="url"
                  value={twitter}
                  onChange={e => setTwitter(e.target.value)}
                  placeholder="https://x.com/yourhandle"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>


              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Personal Portfolio / Website</span>
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isSaved}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2 ${
                isSaved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-neutral-950'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Changes Saved!</span>
                </>
              ) : isSaving ? (
                <span>Saving Profile...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
