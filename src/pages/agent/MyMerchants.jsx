// // MyMerchants.js
// import React, { useState, useEffect } from 'react';
// import { Link, useSearchParams } from 'react-router-dom';
// import AgentSidebar from '../../components/AgentSidebar';
// import { Topbar, StatusBadge, Pagination, Loading, EmptyState } from '../../components/index';
// import { getMyMerchants } from '../../services/api';
// import toast from 'react-hot-toast';

// export default function MyMerchants() {
//   const [merchants, setMerchants] = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, pages: 1 });
//   const [search, setSearch] = useState('');
//   const [searchParams] = useSearchParams();
//   const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
//   const [loading, setLoading] = useState(true);

//   const fetchMerchants = async (page = 1) => {
//     setLoading(true);
//     try {
//       const { data } = await getMyMerchants({ page, search, status: statusFilter });
//       setMerchants(data.data);
//       setPagination(data.pagination);
//     } catch { toast.error('Failed to load'); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchMerchants(1); }, [search, statusFilter]);

//   const statuses = ['draft', 'submitted', 'under_review', 'approved', 'qr_uploaded', 'qr_deployed', 'active', 'commission_eligible', 'rejected'];

//   return (
//     <div className="layout">
//       <AgentSidebar />
//       <div className="main-content">
//         <Topbar title="My Merchants" />
//         <div className="page-content">
//           <div className="search-bar">
//             <div className="search-input-wrap" style={{ flex: 2 }}>
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
//               <input className="form-control" placeholder="Search merchants..." value={search} onChange={e => setSearch(e.target.value)} />
//             </div>
//             <select className="form-control" style={{ width: 180 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
//               <option value="">All Statuses</option>
//               {statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
//             </select>
//             <Link to="/agent/add-merchant" className="btn btn-primary">+ Add Merchant</Link>
//           </div>

//           <div className="card" style={{ padding: 0 }}>
//             <div className="table-wrap">
//               {loading ? <Loading /> : merchants.length === 0 ? (
//                 <EmptyState message="No merchants found">
//                   <Link to="/agent/add-merchant" className="btn btn-primary btn-sm mt-16">Add First Merchant</Link>
//                 </EmptyState>
//               ) : (
//                 <table>
//                   <thead><tr><th>Merchant</th><th>Shop</th><th>Mobile</th><th>Status</th><th>Commission</th><th>Date</th><th></th></tr></thead>
//                   <tbody>
//                     {merchants.map(m => (
//                       <tr key={m._id}>
//                         <td><strong>{m.merchantName}</strong></td>
//                         <td>{m.shopName}<br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.businessCategory}</span></td>
//                         <td>{m.mobile}</td>
//                         <td><StatusBadge status={m.status} /></td>
//                         <td>{m.commissionEligible ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>💰 Eligible</span> : '—'}</td>
//                         <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(m.createdAt).toLocaleDateString()}</td>
//                         <td><Link to={`/agent/merchants/${m._id}`} className="btn btn-outline btn-sm">View</Link></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//           <Pagination page={pagination.page} pages={pagination.pages} onPageChange={p => fetchMerchants(p)} />
//         </div>
//       </div>
//     </div>
//   );
// }


























import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AgentSidebar from '../../components/AgentSidebar';
import { Topbar, StatusBadge, Pagination, Loading } from '../../components/index';
import { getMyMerchants } from '../../services/api';
import toast from 'react-hot-toast';

const STATUSES = [
  'draft','submitted','under_review','approved',
  'qr_uploaded','qr_deployed','active','commission_eligible','rejected'
];

const getResumeRoute = (merchant) => {
  switch (merchant.currentSection) {
    case 'entity':
      return `/agent/merchant/${merchant._id}/pan`;

    case 'ckyc':
      return `/agent/merchant/${merchant._id}/ckyc`;

    case 'bank_verification':
      return `/agent/merchant/${merchant._id}/bank`;

    case 'signatory':
      return `/agent/merchant/${merchant._id}/signing-authority`;

    case 'digilocker':
      return `/agent/merchant/${merchant._id}/digilocker`;

    case 'business_members':
      return `/agent/merchant/${merchant._id}/ubo`;

    case 'documents':
      return `/agent/merchant/${merchant._id}/documents`;

    case 'vkyc':
      return `/agent/merchant/${merchant._id}/vkyc`;

    default:
      return `/agent/merchant/${merchant._id}/pan`;
  }
};

export default function MyMerchants() {
  const [merchants, setMerchants] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [loading, setLoading] = useState(true);

  const fetchMerchants = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getMyMerchants({ page, search, status: statusFilter });
      setMerchants(data.data || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch { toast.error('Failed to load merchants'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMerchants(1); }, [search, statusFilter]);

  return (
    <div className="layout">
      <AgentSidebar />
      <div className="main-content">
        <Topbar title="My Merchants" />
        <div className="page-content">

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>My Merchants</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '2px 0 0' }}>
                {pagination.total ?? merchants.length} merchants total
              </p>
            </div>
            <Link to="/agent/add-merchant" className="btn btn-primary">+ Add Merchant</Link>
          </div>

          {/* Filters */}
          <div className="search-bar" style={{ marginBottom: 16 }}>
            <div className="search-input-wrap" style={{ flex: 2, minWidth: 200 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                className="form-control"
                placeholder="Search by name, shop, mobile…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-control"
              style={{ minWidth: 160, width: 'auto' }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUSES.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
              ))}
            </select>
          </div>

          {loading ? <Loading /> : merchants.length === 0 ? (
            <div className="card">
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏪</div>
                <h3 style={{ marginBottom: 8 }}>No merchants found</h3>
                <p style={{ marginBottom: 16, fontSize: '0.875rem' }}>
                  {statusFilter || search ? 'Try adjusting your filters.' : 'Start by adding your first merchant.'}
                </p>
                {!statusFilter && !search && (
                  <Link to="/agent/add-merchant" className="btn btn-primary">Add First Merchant</Link>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="card" style={{ padding: 0, display: 'block' }} id="merchant-table-desktop">
                <div className="table-wrap" style={{ display: window.innerWidth <= 768 ? 'none' : 'block' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Merchant</th>
                        <th>Shop</th>
                        <th>Mobile</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Commission</th>
                        <th>Added</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {merchants.map(m => (
                        <tr key={m._id}>
                          <td><strong>{m.merchantName}</strong></td>
                          <td>{m.shopName}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{m.mobile}</td>
                          <td><span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.businessCategory}</span></td>
                          <td><StatusBadge status={m.status} /></td>
                          <td>{m.commissionEligible ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>💰 Eligible</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(m.createdAt).toLocaleDateString('en-IN')}</td>
                         <td style={{ display: 'flex', gap: 6 }}>
  {m.status === 'draft' && (
    <Link
     to={getResumeRoute(m)}
      className="btn btn-primary btn-sm"
    >
      Continue
    </Link>
  )}

  <Link
    to={`/agent/merchants/${m._id}`}
    className="btn btn-outline btn-sm"
  >
    View
  </Link>
</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile card list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="merchant-card-list-mobile">
                {merchants.map(m => (
                  <Link
                    key={`mob-${m._id}`}
                    to={`/agent/merchants/${m._id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="merchant-card" style={{
                      background: 'var(--card)', borderRadius: 'var(--radius)',
                      padding: '14px 16px', border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>{m.merchantName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{m.shopName} · {m.businessCategory}</div>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                      <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📱 {m.mobile}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📅 {new Date(m.createdAt).toLocaleDateString('en-IN')}</span>
                        {m.commissionEligible && <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>💰 Commission Eligible</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <Pagination page={pagination.page} pages={pagination.pages} onPageChange={p => fetchMerchants(p)} />

        </div>
      </div>
    </div>
  );
}