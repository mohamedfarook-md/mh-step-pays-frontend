import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Topbar, StatusBadge, Pagination, Loading, EmptyState, ConfirmModal } from '../../components/index';
import { getAgents, updateAgentStatus } from '../../services/api';
import toast from 'react-hot-toast';

export default function AgentManagement() {
  const [agents, setAgents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { agent, action, reason }
  const [actionLoading, setActionLoading] = useState(false);
  const [reason, setReason] = useState('');

  const fetchAgents = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getAgents({ page, search, status: statusFilter });
      setAgents(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to load agents');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAgents(1); }, [search, statusFilter]);

  const handleAction = async () => {
    if ((modal.action === 'rejected' || modal.action === 'suspended') && !reason.trim()) {
      toast.error('Please provide a reason'); return;
    }
    setActionLoading(true);
    try {
      await updateAgentStatus(modal.agent._id, { status: modal.action, reason });
      toast.success(`Agent ${modal.action} successfully`);
      setModal(null); setReason('');
      fetchAgents(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally { setActionLoading(false); }
  };

  const actionConfig = {
    approved: { label: 'Approve Agent', confirmClass: 'btn-success', confirmLabel: 'Approve' },
    rejected: { label: 'Reject Agent', confirmClass: 'btn-danger', confirmLabel: 'Reject' },
    suspended: { label: 'Suspend Agent', confirmClass: 'btn-warning', confirmLabel: 'Suspend' },
  };

  return (
    <div className="layout">
      <AdminSidebar />
      <div className="main-content">
        <Topbar title="Field Agent Management" subtitle="Manage agent registrations and approvals" />
        <div className="page-content">
          <div className="search-bar">
            <div className="search-input-wrap" style={{ flex: 2 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input className="form-control" placeholder="Search by name, email, mobile..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-control" style={{ width: 180 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              {loading ? <Loading /> : agents.length === 0 ? <EmptyState message="No agents found" /> : (
                <table>
                  <thead>
                    <tr>
                      <th>Agent</th>
                      <th>Mobile</th>
                      <th>Employment</th>
                      <th>Status</th>
                      <th>Merchants</th>
                      <th>Registered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map(agent => (
                      <tr key={agent._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{agent.fullName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{agent.email}</div>
                        </td>
                        <td>{agent.mobile}</td>
                        <td><StatusBadge status={agent.employmentType} /></td>
                        <td><StatusBadge status={agent.status} /></td>
                        <td>
                          <div style={{ fontSize: '0.8rem' }}>
                            <span title="Submitted">📋 {agent.stats?.submitted || 0}</span>
                            {' · '}
                            <span title="Active">🟢 {agent.stats?.active || 0}</span>
                            {' · '}
                            <span title="Commission">💰 {agent.stats?.eligible || 0}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(agent.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {agent.status === 'pending' && <>
                              <button className="btn btn-success btn-sm" onClick={() => { setModal({ agent, action: 'approved' }); setReason(''); }}>Approve</button>
                              <button className="btn btn-danger btn-sm" onClick={() => { setModal({ agent, action: 'rejected' }); setReason(''); }}>Reject</button>
                            </>}
                            {agent.status === 'approved' && <button className="btn btn-warning btn-sm" onClick={() => { setModal({ agent, action: 'suspended' }); setReason(''); }}>Suspend</button>}
                            {(agent.status === 'suspended' || agent.status === 'rejected') && <button className="btn btn-outline btn-sm" onClick={() => { setModal({ agent, action: 'approved' }); setReason(''); }}>Reactivate</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <Pagination page={pagination.page} pages={pagination.pages} onPageChange={p => fetchAgents(p)} />
        </div>
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 style={{ fontSize: '1rem' }}>{actionConfig[modal.action]?.label}: {modal.agent.fullName}</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: 16 }}>
                Are you sure you want to {modal.action} this agent?
              </p>
              {(modal.action === 'rejected' || modal.action === 'suspended') && (
                <div className="form-group">
                  <label className="form-label">Reason <span className="required">*</span></label>
                  <textarea className="form-control" rows={3} placeholder="Provide reason..." value={reason} onChange={e => setReason(e.target.value)} />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className={`btn ${actionConfig[modal.action]?.confirmClass}`} onClick={handleAction} disabled={actionLoading}>
                {actionLoading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Processing...</> : actionConfig[modal.action]?.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}