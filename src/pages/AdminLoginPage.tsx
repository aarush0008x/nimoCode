import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { setCookie } from '../utils/cookies';
import { waf } from '../services/waf';

const API_BASE_URL = 'http://localhost:5000/api';

export const AdminLoginPage: React.FC = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [wafBlocked, setWafBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setWafBlocked(false);

    // 1. Inspect with WAF Firewall
    const idWaf = waf.inspectInput(loginId, '/api/auth/admin-login');
    const passWaf = waf.inspectInput(password, '/api/auth/admin-login');

    if (!idWaf.safe || !passWaf.safe) {
      setWafBlocked(true);
      setErrorMsg('🛡️ Blocked by NimoCode WAF: Potential XSS/SQLi threat detected.');
      return;
    }

    // 2. Rate Limiting Check
    if (!waf.checkRateLimit('admin_auth_client')) {
      setErrorMsg('⚠️ Too many login attempts. Rate limit exceeded. Try again in 60 seconds.');
      return;
    }

    setIsLoading(true);

    try {
      // 3. Realtime MongoDB Admin Authentication
      const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password })
      });

      const data = await res.json();

      if (res.ok && data.authenticated) {
        setCookie('nimocode_admin_auth', 'true', 30);
        setCookie('nimocode_admin_username', data.user?.username || loginId, 30);
        sessionStorage.setItem('nimocode_admin_auth', 'true');
        sessionStorage.setItem('nimocode_admin_username', data.user?.username || loginId);
        sessionStorage.setItem('nimocode_admin_session_ts', Date.now().toString());

        // Sync local storage user role
        try {
          const storedUsers = JSON.parse(localStorage.getItem('nimocode_users_db') || '[]');
          const idx = storedUsers.findIndex((u: any) => u.username?.toLowerCase() === (data.user?.username || loginId).toLowerCase());
          if (idx !== -1) {
            storedUsers[idx].role = 'admin';
            localStorage.setItem('nimocode_users_db', JSON.stringify(storedUsers));
          }
        } catch {}

        navigate('/admin');
      } else {
        waf.logThreat('RateLimit', 'MEDIUM', '/api/auth/admin-login', `Failed admin authentication: ${loginId}`);
        setErrorMsg(data.error || 'Access Denied: Requires registered Admin credentials in MongoDB.');
      }
    } catch {
      // Offline fallback: check local storage users
      try {
        const storedUsers = JSON.parse(localStorage.getItem('nimocode_users_db') || '[]');
        const target = loginId.trim().toLowerCase();
        const found = storedUsers.find((u: any) =>
          (u.username?.toLowerCase() === target || u.email?.toLowerCase() === target) &&
          u.password === password &&
          u.role === 'admin'
        );

        if (found) {
          sessionStorage.setItem('nimocode_admin_auth', 'true');
          sessionStorage.setItem('nimocode_admin_username', found.username);
          navigate('/admin');
        } else {
          setErrorMsg('Access Denied: No Admin user matching credentials in MongoDB.');
        }
      } catch {
        setErrorMsg('Access Denied: Admin authentication failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-neutral-950 text-white">
      <div className="w-full max-w-md p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Realtime Admin Portal</h1>
          <p className="text-xs text-neutral-400 font-mono">Restricted Access • MongoDB Guard Active</p>
        </div>

        {errorMsg && (
          <div className={`p-3.5 rounded-2xl text-xs font-bold border flex items-center gap-2 ${
            wafBlocked ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs font-bold">
          <div>
            <label className="text-neutral-300">Admin Username or Email *</label>
            <input
              type="text"
              required
              value={loginId}
              onChange={e => setLoginId(e.target.value)}
              placeholder="e.g. admin_username"
              className="w-full mt-1.5 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-neutral-300">Admin Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full mt-1.5 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-neutral-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>{isLoading ? 'Authenticating MongoDB...' : 'Authenticate Admin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-neutral-800/80 text-center">
          <Link to="/" className="text-xs text-neutral-500 hover:text-white transition-colors">
            ← Return to NimoCode Public Platform
          </Link>
        </div>
      </div>
    </div>
  );
};
