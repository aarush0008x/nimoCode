import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { waf } from '../services/waf';
import { GoogleLogin } from '@react-oauth/google';

export const LoginPage: React.FC = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const wafCheck = waf.inspectInput(loginId, '/api/auth/login');
    if (!wafCheck.safe) {
      setErrorMsg(`🛡️ Blocked by WAF: Invalid payload character.`);
      return;
    }
    const success = login(loginId, password);
    if (success) {
      navigate('/problems');
    } else {
      setErrorMsg('Invalid username/email or password. If you do not have an account, please Sign Up.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsGoogleLoading(true);
    setErrorMsg('');
    const token = credentialResponse?.credential;
    if (!token) { setErrorMsg('Google sign-in failed. Please try again.'); setIsGoogleLoading(false); return; }
    const ok = await loginWithGoogle(token);
    setIsGoogleLoading(false);
    if (ok) navigate('/problems');
    else setErrorMsg('Google sign-in failed. Please try again or use email/password.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shadow-md font-bold">
              <Code2 className="w-5 h-5" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-neutral-950 dark:text-white tracking-tight">Sign In to NimoCode AI</h1>
          <p className="text-xs text-neutral-500">Enter your credentials to access your real account.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <div className="space-y-3">
          <div className="flex justify-center">
            {isGoogleLoading ? (
              <div className="w-full py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-center text-neutral-500 animate-pulse">
                Signing in with Google...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setErrorMsg('Google sign-in failed. Please try again.')}
                theme="outline"
                size="large"
                width="368"
                text="signin_with"
                shape="rectangular"
              />
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <div className="flex-1 border-t border-neutral-200 dark:border-neutral-800" />
            <span>or continue with email</span>
            <div className="flex-1 border-t border-neutral-200 dark:border-neutral-800" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
          <div className="space-y-1">
            <label className="text-neutral-800 dark:text-neutral-200">Username or Email</label>
            <input type="text" required value={loginId} onChange={e => setLoginId(e.target.value)}
              placeholder="e.g. tourist or email@domain.com"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 font-medium" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-neutral-800 dark:text-neutral-200">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-amber-600 dark:text-amber-400 font-bold hover:underline">Forgot password?</Link>
            </div>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 font-medium" />
          </div>
          <button type="submit"
            className="w-full py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5">
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 pt-2">
          Don't have an account?{' '}
          <Link to="/signup" className="text-neutral-950 dark:text-white font-bold hover:underline">Sign Up Real Account</Link>
        </p>
      </div>
    </div>
  );
};
