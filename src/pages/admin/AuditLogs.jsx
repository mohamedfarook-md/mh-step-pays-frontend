import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Topbar, Pagination, Loading, EmptyState } from '../../components/index';
import { getAuditLogs } from '../../services/api';
import toast from 'react-hot-toast';

const actionColor = { AGENT_APPROVAL: '#10b981', AGENT_REJECTION: '#ef4444', AGENT_SUSPENSION: '#f59e0b', MERCHANT_APPROVAL: '#10b981', MERCHANT_REJECTION: '#ef4444', QR_UPLOAD: '#8b5cf6', QR_DEPLOYMENT: '#6366f1', MERCHANT_ACTIVATION: '#059669', COMMISSION_ELIGIBILITY: '#ec4899', USER_LOGIN: '#4f8ef7', USER_LOGOUT: '#64748b' };

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ entityType: '', action: '' });

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getAuditLogs({ page, ...filter, limit: 25 });
      setLogs(data.data);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load audit logs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(1); }, [filter]);

  return (
    <div className="layout">
      <AdminSidebar />
      <div className="main-content">
        <Topbar title="Audit Logs" subtitle="System activity and security trail" />
        <div className="page-content">
          <div className="search-bar">
            <select className="form-control" style={{ width: 180 }} value={filter.entityType} onChange={e => setFilter(f => ({ ...f, entityType: e.target.value }))}>
              <option value="">All Entities</option>
              <option value="FieldAgent">Field Agent</option>
              <option value="Merchant">Merchant</option>
              <option value="Admin">Admin</option>
              <option value="MerchantDocument">Document</option>
            </select>
            <input className="form-control" style={{ width: 220 }} placeholder="Filter by action..." value={filter.action} onChange={e => setFilter(f => ({ ...f, action: e.target.value }))} />
          </div>
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              {loading ? <Loading /> : logs.length === 0 ? <EmptyState message="No audit logs found" /> : (
                <table>
                  <thead><tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Entity</th><th>Changes</th></tr></thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log._id}>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(log.timestamp).toLocaleString()}</td>
                        <td style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{log.userId?.toString().slice(-6)}</td>
                        <td><span className="badge badge-submitted">{log.userRole}</span></td>
                        <td><span style={{ fontSize: '0.78rem', fontWeight: 700, color: actionColor[log.action] || 'var(--text)' }}>{log.action}</span></td>
                        <td style={{ fontSize: '0.8rem' }}>{log.entityType}</td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 200 }}>
                          {log.newValue ? JSON.stringify(log.newValue).slice(0, 60) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <Pagination page={pagination.page} pages={pagination.pages} onPageChange={p => fetchLogs(p)} />
        </div>
      </div>
    </div>
  );
}