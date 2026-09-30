import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) {
          sessionStorage.setItem('falcon_admin_token', data.token);
        }
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(data.error || 'Invalid credentials or account inactive.');
      }
    } catch (err) {
      setErrorMsg('Network error connecting to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030d0a] text-[#fdfcf0] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Subtle Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#05140f] border border-[#154736] p-8 sm:p-10 rounded-3xl shadow-2xl space-y-7 relative z-10 text-left">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f2a900] to-[#b45309] p-0.5 mx-auto flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-[#030d0a] rounded-[10px] flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#f2a900]" />
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#fdfcf0]">
            Falcon Export Portal
          </h1>
          <p className="text-xs text-[#a3b899]">
            Authorized Staff & Commercial Lead Desk
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#f2a900] mb-1.5 uppercase">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#a3b899]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@falconspices.com"
                className="w-full bg-[#030d0a] text-[#fdfcf0] pl-10 pr-4 py-3 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#f2a900] mb-1.5 uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#a3b899]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#030d0a] text-[#fdfcf0] pl-10 pr-4 py-3 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#f2a900] to-[#d97706] hover:from-[#e09b00] hover:to-[#b45309] text-[#030d0a] font-bold py-3.5 rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#154736]/60 flex items-center justify-between text-xs text-[#a3b899]">
          <Link to="/" className="hover:text-[#f2a900] transition-colors">
            ← Back to Public Website
          </Link>
          <span className="font-mono text-[10px] text-[#f2a900]/70">
            Secure Session • TLS 1.3
          </span>
        </div>

      </div>
    </div>
  );
};
