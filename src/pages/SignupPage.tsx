import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { waf } from '../services/waf';

import { EmailVerificationModal } from '../components/auth/EmailVerificationModal';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState<string | undefined>(undefined);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleUsernameChange = async (val: string) => {
    const clean = val.toLowerCase().replace(/\s+/g, '_');
    setUsername(clean);
    setUsernameTaken(false);

    if (clean.length >= 3) {
      try {
        const apiBase = import.meta.env.VITE_API_URL || '/api';
        const res = await fetch(`${apiBase}/auth/check-username`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: clean })
        });
        if (res.ok) {
          const data = await res.json();
          if (!data.available) {
            setUsernameTaken(true);
            setErrorMsg(`⚠️ Username "@${clean}" is already taken. Please choose a different username.`);
          } else {
            setErrorMsg(prev => prev.includes('already taken') ? '' : prev);
          }
        }
      } catch {}
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // WAF Inspection
    const wafName = waf.inspectInput(name, '/api/auth/signup');
    const wafEmail = waf.inspectInput(email, '/api/auth/signup');
    const wafUser = waf.inspectInput(username, '/api/auth/signup');

    if (!wafName.safe || !wafEmail.safe || !wafUser.safe) {
      setErrorMsg('🛡️ Blocked by WAF: Suspicious input pattern detected.');
      return;
    }

    if (username.length < 3) {
      setErrorMsg('Username must be at least 3 characters long.');
      return;
    }

    if (usernameTaken) {
      setErrorMsg('Username is already taken. Please choose another username.');
      return;
    }

    setIsSendingOtp(true);

    // Trigger Google Email Verification
    try {
      const apiBase = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${apiBase}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        setDevOtpHint(data.devOtpHint);
      }
    } catch {
      setDevOtpHint('123456');
    } finally {
      setIsSendingOtp(false);
      setShowVerifyModal(true);
    }
  };

  const handleVerifiedComplete = () => {
    setShowVerifyModal(false);
    const success = signup(name, email, username, password);
    if (success) {
      navigate('/problems');
    } else {
      setErrorMsg('Failed to create account. Username or email may already be taken.');
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
            Create Real NimoCode Account
          </h1>
          <p className="text-xs text-neutral-500">Register your real developer profile on NimoCode AI.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-bold">
          <div className="space-y-1">
            <label className="text-neutral-800 dark:text-neutral-200">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sarah Connor"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-800 dark:text-neutral-200">Username *</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => handleUsernameChange(e.target.value)}
              placeholder="e.g. sarah_dev"
              className={`w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border ${
                usernameTaken ? 'border-rose-500 focus:ring-rose-500' : 'border-neutral-200 dark:border-neutral-800 focus:ring-neutral-400'
              } text-neutral-900 dark:text-white focus:outline-none focus:ring-2 font-medium font-mono`}
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-800 dark:text-neutral-200">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="sarah@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-800 dark:text-neutral-200">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={usernameTaken || isSendingOtp}
            className="w-full py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 pt-3 disabled:opacity-50"
          >
            <span>{isSendingOtp ? 'Sending Verification Code...' : 'Send Email Verification Code'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-neutral-950 dark:text-white font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      {showVerifyModal && (
        <EmailVerificationModal
          email={email}
          devOtpHint={devOtpHint}
          onVerified={handleVerifiedComplete}
          onCancel={() => setShowVerifyModal(false)}
        />
      )}
    </div>
  );
};
