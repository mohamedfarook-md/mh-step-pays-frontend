import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Topbar, StatusBadge, Loading, EmptyState } from '../../components/index';
import { getReports } from '../../services/api';
import toast from 'react-hot-toast';

export default function Reports() {
  const [activeReport, setActiveReport] = useState('merchant-acquisition');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await getReports(activeReport);
      setData(res.data.data);
    } catch { toast.error('Failed to load report'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReport(); }, [activeReport]);

  const reports = [
    { key: 'merchant-acquisition', label: 'Merchant Acquisition' },
    { key: 'agent-performance', label: 'Agent Performance' },
  ];

  return (
    <div className="layout">
      <AdminSidebar />
      <div className="main-content">
        <Topbar title="Reports" subtitle="Business intelligence and performance reports" />
        <div className="page-content">
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {reports.map(r => (
              <button key={r.key} className={`btn ${activeReport === r.key ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveReport(r.key)}>{r.label}</button>
            ))}
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              {loading ? <Loading /> : data.length === 0 ? <EmptyState message="No data available" /> : (
                activeReport === 'merchant-acquisition' ? (
                  <table>
                    <thead><tr><th>Merchant</th><th>Shop</th><th>Status</th><th>Agent</th><th>Registered</th><th>Commission</th></tr></thead>
                    <tbody>
                      {data.map(m => (
                        <tr key={m._id}>
                          <td><strong>{m.merchantName}</strong></td>
                          <td>{m.shopName}</td>
                          <td><StatusBadge status={m.status} /></td>
                          <td>{m.assignedAgent?.fullName || '—'}</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(m.createdAt).toLocaleDateString()}</td>
                          <td>{m.commissionEligible ? <span className="badge" style={{ background: '#fce7f3', color: '#9d174d' }}>Eligible</span> : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table>
                    <thead><tr><th>Agent</th><th>Employment</th><th>Submitted</th><th>Approved</th><th>Active</th><th>Commission Eligible</th></tr></thead>
                    <tbody>
                      {data.map(row => (
                        <tr key={row.agent._id}>
                          <td><strong>{row.agent.fullName}</strong><br /><span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{row.agent.email}</span></td>
                          <td><StatusBadge status={row.agent.employmentType} /></td>
                          <td>{row.submitted}</td>
                          <td>{row.approved}</td>
                          <td>{row.active}</td>
                          <td>{row.eligible}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}