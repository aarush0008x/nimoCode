import React, { useState } from 'react';
import { Star, Heart, MessageSquarePlus, ShieldCheck, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { useDb } from '../../context/DbContext';
import { useAuth } from '../../context/AuthContext';
import { ScrollReveal } from '../common/ScrollReveal';
import confetti from 'canvas-confetti';

export const RealtimeReviewsSection: React.FC = () => {
  const { reviews, addReview, likeReview } = useDb();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState(user?.name || '');
  const [companyOrCollege, setCompanyOrCollege] = useState(user?.college || '');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '4.9';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    addReview({
      name: name.trim() || user?.name || user?.username || 'Anonymous Engineer',
      username: user?.username || 'developer',
      avatar: user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || 'coder')}`,
      companyOrCollege: companyOrCollege.trim() || (user?.college ? `🎓 ${user.college}` : 'Software Engineer'),
      rating,
      feedback: feedback.trim(),
      badge: (user as any)?.badge || 'Verified Coder'
    });


    setSubmitted(true);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setSubmitted(false);
      setShowModal(false);
      setFeedback('');
    }, 1500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Section Header */}
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>REAL-TIME COMMUNITY REVIEWS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
              Loved by FAANG Engineers & Students.
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl font-medium">
              Authentic real-time feedback and ratings from competitive programmers, university coders, and top engineers.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 flex-wrap">
            {/* Rating Pill */}
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <div className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                {avgRating} <span className="text-neutral-400 font-normal">({reviews?.length || 0} reviews)</span>
              </div>
            </div>

            {/* Write a review button */}
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 group"
            >
              <MessageSquarePlus className="w-4 h-4 text-amber-400 dark:text-amber-600 group-hover:scale-110 transition-transform" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(reviews || []).map((rev, idx) => (
          <ScrollReveal key={rev.id || idx} delayMs={idx * 60}>
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 h-full">
              <div className="space-y-3">
                {/* Rating & Timestamp */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">{rev.createdAt || 'Recent'}</span>
                </div>

                {/* Review Body */}
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                  "{rev.feedback}"
                </p>
              </div>

              {/* Author & Likes */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={rev.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(rev.username || 'coder')}`}
                    alt={rev.name}
                    className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-800 object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {rev.name}
                    </div>
                    {rev.companyOrCollege && (
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                        {rev.companyOrCollege}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => likeReview(rev.id)}
                  className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-rose-500 transition-colors shrink-0 p-1"
                  title="Helpful Review"
                >
                  <Heart className="w-3.5 h-3.5 hover:fill-rose-500" />
                  <span>{rev.likes || 1}</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Write a Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Share Your NimoCode Experience</span>
              </h3>
              <p className="text-xs text-neutral-400 font-medium">
                Your review will be verified and published live on the landing page in real time.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Review Published Live!</h4>
                <p className="text-xs text-emerald-300">Thank you for supporting the NimoCode developer community.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Rating selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Your Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`p-2 rounded-xl border transition-all ${
                          rating >= num
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-600'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${rating >= num ? 'fill-amber-400' : ''}`} />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-amber-400 ml-2">{rating} / 5 Stars</span>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* College / Company */}
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase">College / Company / Role</label>
                  <input
                    type="text"
                    value={companyOrCollege}
                    onChange={e => setCompanyOrCollege(e.target.value)}
                    placeholder="e.g. Stanford University ? SDE @ Meta"
                    className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Feedback */}
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-400 uppercase">Review Feedback</label>
                  <textarea
                    rows={4}
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="What do you love most about NimoCode? How did it help your interview prep or competitive programming skills?"
                    required
                    className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Post Live Review</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
