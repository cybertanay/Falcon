import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, AlertCircle, Building, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { CompanySettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'Falcon International Traders',
    tagline: 'Indian Agro-Commodities & Spice Export Trading Desk',
    positioning: '',
    email: 'export@falconspices.com',
    whatsapp: '+91 98765 43210',
    phone: '+91 98765 43210',
    address: 'Navi Mumbai / Cochin Port Hub, India',
    websiteUrl: 'https://falconinternationaltraders.com',
    socials: {}
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const getAuthToken = () => sessionStorage.getItem('falcon_admin_token') || '';

  useEffect(() => {
    fetch('/api/company-settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(e => console.error('Error fetching settings:', e))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const token = getAuthToken();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Falcon-Admin': '1',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        setSuccessMsg('Verified company settings updated successfully across the website.');
      } else {
        setErrorMsg('Failed to update settings.');
      }
    } catch (err) {
      setErrorMsg('Network error while saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-[#a3b899] font-mono">
        Loading Company Settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-[#154736]/60 pb-5">
        <span className="text-xs font-mono text-[#f2a900] uppercase tracking-wider block">
          Central Brand Repository
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf0]">
          Verified Company Information & Settings
        </h1>
        <p className="text-xs text-[#a3b899] font-light pt-1">
          Maintain single-source-of-truth company contact channels, statutory registration details, and export desk coordinates.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#05140f] border border-[#154736]/70 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#f2a900] font-mono mb-1">Company Trading Name</label>
            <input
              type="text"
              required
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full bg-[#030d0a] text-[#fdfcf0] p-3 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#f2a900] font-mono mb-1">Official Website URL</label>
            <input
              type="url"
              required
              value={settings.websiteUrl}
              onChange={(e) => setSettings({ ...settings, websiteUrl: e.target.value })}
              className="w-full bg-[#030d0a] text-[#fdfcf0] p-3 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#f2a900] font-mono mb-1">Brand Tagline</label>
          <input
            type="text"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            className="w-full bg-[#030d0a] text-[#fdfcf0] p-3 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[#f2a900] font-mono mb-1">Official Positioning Statement</label>
          <textarea
            rows={3}
            value={settings.positioning}
            onChange={(e) => setSettings({ ...settings, positioning: e.target.value })}
            className="w-full bg-[#030d0a] text-[#fdfcf0] p-3 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[#f2a900] font-mono mb-1">Commercial Email</label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full bg-[#030d0a] text-[#fdfcf0] p-3 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#f2a900] font-mono mb-1">Official WhatsApp Desk</label>
            <input
              type="text"
              required
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full bg-[#030d0a] text-[#fdfcf0] p-3 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#f2a900] font-mono mb-1">Phone Number</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full bg-[#030d0a] text-[#fdfcf0] p-3 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#f2a900] font-mono mb-1">Physical Trading Hub & Port Address</label>
          <input
            type="text"
            required
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full bg-[#030d0a] text-[#fdfcf0] p-3 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-[#154736] flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#f2a900] hover:bg-[#d97706] text-[#030d0a] font-bold px-6 py-3 rounded-xl text-xs shadow flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Company Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
