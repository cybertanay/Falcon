import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Package, MessageSquare, Settings, FileText, LogOut, ShieldCheck, ExternalLink, Menu, X } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const getAuthToken = () => sessionStorage.getItem('falcon_admin_token') || '';

  useEffect(() => {
    const token = getAuthToken();
    fetch('/api/admin/session', {
      credentials: 'include',
      headers: {
        'X-Falcon-Admin': '1',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Unauthorized');
      })
      .then(data => {
        setAdminUser(data.admin);
        setChecking(false);
      })
      .catch(() => {
        sessionStorage.removeItem('falcon_admin_token');
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-Falcon-Admin': '1' }
      });
    } catch (e) {}
    sessionStorage.removeItem('falcon_admin_token');
    navigate('/admin/login');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#030d0a] flex items-center justify-center text-center p-8">
        <div className="space-y-4">
          <div className="w-10 h-10 border-3 border-[#f2a900] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#a3b899] font-mono">Verifying Administrator Session...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/products', icon: Package, label: 'Products Catalogue' },
    { to: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries & Leads' },
    { to: '/admin/settings', icon: Settings, label: 'Company Settings' },
    { to: '/admin/audit-logs', icon: FileText, label: 'Audit Logs' },
  ];

  return (
    <div className="min-h-screen bg-[#030d0a] text-[#fdfcf0] font-sans flex flex-col md:flex-row text-left">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#05140f] p-4 border-b border-[#154736] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-lg text-[#fdfcf0]">FALCON</span>
          <span className="text-[10px] font-mono text-[#f2a900] uppercase tracking-wider">Staff Portal</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-[#a3b899] bg-[#0b2317] rounded-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`${
        sidebarOpen ? 'block' : 'hidden'
      } md:block w-full md:w-64 bg-[#05140f] border-r border-[#154736] p-6 flex flex-col justify-between shrink-0 z-30`}>
        <div className="space-y-8">
          
          {/* Brand Emblem */}
          <div className="space-y-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f2a900] to-[#b45309] p-0.5 flex items-center justify-center shadow">
                <div className="w-full h-full bg-[#030d0a] rounded-[6px] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#f2a900]" />
                </div>
              </div>
              <div>
                <span className="font-serif font-bold text-base text-[#fdfcf0] block leading-tight">
                  Falcon Traders
                </span>
                <span className="text-[10px] font-mono text-[#f2a900] uppercase tracking-widest block">
                  Export Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#a3b899]/60 px-3 block mb-2">
              Management
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#f2a900] text-[#030d0a] font-bold shadow-md'
                        : 'text-[#a3b899] hover:text-[#fdfcf0] hover:bg-[#0b2317]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

        </div>

        {/* User Info & Actions */}
        <div className="pt-6 border-t border-[#154736]/60 space-y-4">
          <div className="bg-[#030d0a] p-3 rounded-xl border border-[#154736]/60 space-y-1">
            <span className="text-[10px] font-mono text-[#f2a900] uppercase tracking-wider block">
              Active Session
            </span>
            <p className="text-xs text-[#fdfcf0] font-medium truncate" title={adminUser?.email}>
              {adminUser?.email || 'admin@falconspices.com'}
            </p>
            <span className="inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-[#f2a900] border border-amber-500/20">
              {adminUser?.role || 'Administrator'}
            </span>
          </div>

          <div className="space-y-2">
            <Link
              to="/"
              target="_blank"
              className="w-full flex items-center justify-between text-xs text-[#a3b899] hover:text-[#f2a900] px-2 py-1.5 rounded-lg transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full bg-[#0b2317] hover:bg-red-950/60 text-red-300 border border-red-900/50 hover:border-red-700 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>

    </div>
  );
};
