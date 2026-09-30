import React, { useState, useEffect } from 'react';
import { FileText, ShieldAlert, Clock, RefreshCw, Eye } from 'lucide-react';
import { AuditLog } from '../../types';

export const AdminAuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const getAuthToken = () => sessionStorage.getItem('falcon_admin_token') || '';

  const fetchLogs = () => {
    setLoading(true);
    const token = getAuthToken();
    fetch('/api/admin/audit-logs', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setLogs(data))
      .catch(e => console.error('Error fetching audit logs:', e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#154736]/60 pb-5">
        <div>
          <span className="text-xs font-mono text-[#f2a900] uppercase tracking-wider block">
            Security & Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf0]">
            Administrative Audit Trail
          </h1>
          <p className="text-xs text-[#a3b899] font-light pt-1">
            Immutable log of all catalogue modifications, lead status transitions, and setting adjustments.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="bg-[#05140f] hover:bg-[#0b2317] text-[#f2a900] border border-[#f2a900]/40 font-bold px-4 py-2 rounded-xl text-xs shadow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-[#05140f] rounded-2xl border border-[#154736]/70 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#a3b899]">
            <thead className="bg-[#030d0a] text-[#f2a900] font-mono uppercase tracking-wider border-b border-[#154736]/80">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Admin Officer</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Entity ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#154736]/40">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-[#a3b899]">
                    No administrative audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#0b2317]/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#fdfcf0]">
                      {log.createdAt ? log.createdAt.replace('T', ' ').substring(0, 19) : 'Just now'}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#fdfcf0]">
                      {log.adminEmail}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#030d0a] text-[#f2a900] border border-[#154736]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs uppercase text-[#a3b899]">
                      {log.entity}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-[#fdfcf0] truncate max-w-xs">
                      {log.entityId}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
