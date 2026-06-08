import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { Topbar, StatusBadge, Pagination, Loading, EmptyState } from '../../components/index';
import { getAdminMerchants } from '../../services/api';
import toast from 'react-hot-toast';

export default function MerchantManagement() {
  const [merchants, setMerchants] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMerchants = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getAdminMerchants({ page, search, status: statusFilter });
      setMerchants(data.data);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load merchants'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMerchants(1); }, [search, statusFilter]);

  const statuses = ['submitted', 'under_review', 'approved', 'qr_uploaded', 'qr_deployed', 'transaction_verified', '7day_validation', 'active', 'commission_eligible', 'rejected'];

  return (
    <div className="layout">
      <AdminSidebar />
      <div className="main-content">
        <Topbar title="Merchant Management" subtitle="Review and manage merchant applications" />
        <div className="page-content">
          <div className="search-bar">
            <div className="search-input-wrap" style={{ flex: 2 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input className="form-control" placeholder="Search merchants..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-control" style={{ width: 200 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              {loading ? <Loading /> : merchants.length === 0 ? <EmptyState message="No merchants found" /> : (
                <table>
                  <thead>
                    <tr>
                      <th>Merchant</th>
                      <th>Shop</th>
                      <th>Mobile</th>
                      <th>Agent</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchants.map(m => (
                      <tr key={m._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{m.merchantName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.email}</div>
                        </td>
                        <td>
                          <div>{m.shopName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.businessCategory}</div>
                        </td>
                        <td>{m.mobile}</td>
                        <td style={{ fontSize: '0.85rem' }}>{m.assignedAgent?.fullName || '—'}</td>
                        <td><StatusBadge status={m.status} /></td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(m.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/admin/merchants/${m._id}`} className="btn btn-outline btn-sm">View Details</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <Pagination page={pagination.page} pages={pagination.pages} onPageChange={p => fetchMerchants(p)} />
        </div>
      </div>
    </div>
  );
}