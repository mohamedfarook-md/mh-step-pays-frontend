import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { Topbar, Loading } from '../../components/index';
import { getAdminDashboard } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const StatCard = ({ icon, label, value, color, link }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: `${color}15`, color }}>{icon}</div>
    <div className="stat-value">{value ?? '—'}</div>
    <div className="stat-label">{label}</div>
    {link && <Link to={link} style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: 4 }}>View all →</Link>}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard().then(r => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="layout">
      <AdminSidebar />
      <div className="main-content"><Topbar title="Dashboard" /><div className="page-content"><Loading /></div></div>
    </div>
  );

  const s = stats || {};

  const overviewCards = [
    { icon: '👥', label: 'Total Field Agents', value: s.totalAgents, color: '#4f8ef7', link: '/admin/agents' },
    { icon: '✅', label: 'Active Agents', value: s.activeAgents, color: '#10b981' },
    { icon: '⏳', label: 'Pending Agents', value: s.pendingAgents, color: '#f59e0b', link: '/admin/agents?status=pending' },
    { icon: '🏪', label: 'Total Merchants', value: s.totalMerchants, color: '#6366f1', link: '/admin/merchants' },
    { icon: '📋', label: 'Pending Merchants', value: s.pendingMerchants, color: '#f59e0b', link: '/admin/merchants?status=submitted' },
    { icon: '✔️', label: 'Approved Merchants', value: s.approvedMerchants, color: '#10b981' },
    { icon: '🟢', label: 'Active Merchants', value: s.activeMerchants, color: '#059669' },
    { icon: '📱', label: 'QR Uploaded', value: s.qrUploadedMerchants, color: '#8b5cf6', link: '/admin/qr' },
    { icon: '💰', label: 'Commission Eligible', value: s.commissionEligible, color: '#ec4899' },
  ];

  // Mock chart data
  const chartData = ['Jan','Feb','Mar','Apr','May','Jun'].map((m, i) => ({ month: m, merchants: Math.floor(Math.random()*30+10), agents: Math.floor(Math.random()*10+2) }));

  return (
    <div className="layout">
      <AdminSidebar />
      <div className="main-content">
        <Topbar title="Admin Dashboard" subtitle="MH Step Pays — Merchant Acquisition Platform" />
        <div className="page-content">
          <div className="stats-grid">
            {overviewCards.map((c, i) => <StatCard key={i} {...c} />)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="card">
              <div className="card-header"><h3 className="card-title">Merchant Growth</h3></div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="merchants" fill="var(--accent)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="card-header"><h3 className="card-title">Agent Registrations</h3></div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="agents" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/admin/agents?status=pending" className="btn btn-outline">Review Pending Agents ({s.pendingAgents || 0})</Link>
                <Link to="/admin/merchants?status=submitted" className="btn btn-outline">Review Merchant Submissions ({s.pendingMerchants || 0})</Link>
                <Link to="/admin/qr" className="btn btn-outline">Manage QR Codes</Link>
                <Link to="/admin/reports" className="btn btn-outline">View Reports</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h3 className="card-title">Workflow Summary</h3></div>
              <div style={{ fontSize: '0.85rem', lineHeight: 2 }}>
                {[
                  ['Pending Review', s.pendingMerchants, '#f59e0b'],
                  ['Approved', s.approvedMerchants, '#10b981'],
                  ['QR Uploaded', s.qrUploadedMerchants, '#8b5cf6'],
                  ['Active', s.activeMerchants, '#059669'],
                  ['Commission Eligible', s.commissionEligible, '#ec4899'],
                ].map(([label, val, color]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-light)' }}>{label}</span>
                    <strong style={{ color }}>{val ?? 0}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}