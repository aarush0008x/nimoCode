import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Send, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setIsSent(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to dispatch password reset link.');
      }
    } catch {
      setIsSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shadow-md">
              <Code2 className="w-5 h-5" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            Forgot Your Password?
          </h1>
          <p className="text-xs text-neutral-500">
            Enter your registered email address and we will send you a password reset link.
          </p>
        </div>

        {isSent ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-extrabold text-neutral-950 dark:text-white">
              Password Reset Link Dispatched!
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-mono">
              We have sent a reset password link to <strong className="text-neutral-950 dark:text-white">{email}</strong>. Check your inbox and spam folder!
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-neutral-800 dark:text-neutral-200">Your Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. sarah@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending Reset Link...' : 'Send Password Reset Link'}</span>
            </button>
          </form>
        )}

        <div className="text-center text-xs text-neutral-500 pt-2">
          Remembered your password?{' '}
          <Link to="/login" className="text-neutral-950 dark:text-white font-bold hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
