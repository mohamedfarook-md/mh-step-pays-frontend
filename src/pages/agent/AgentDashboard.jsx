// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import AgentSidebar from '../../components/AgentSidebar';
// import { Topbar, Loading } from '../../components/index';
// import { getAgentStats, getMyMerchants } from '../../services/api';
// import { useAuth } from '../../context/AuthContext';

// const StatCard = ({ icon, label, value, color, to }) => (
//   <div className="stat-card">
//     <div className="stat-icon" style={{ background: `${color}15`, color }}>{icon}</div>
//     <div className="stat-value">{value ?? 0}</div>
//     <div className="stat-label">{label}</div>
//     {to && <Link to={to} style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: 4 }}>View →</Link>}
//   </div>
// );

// export default function AgentDashboard() {
//   const { user } = useAuth();
//   const [stats, setStats] = useState(null);
//   const [recentMerchants, setRecentMerchants] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([getAgentStats(), getMyMerchants({ limit: 5 })])
//       .then(([s, m]) => { setStats(s.data.data); setRecentMerchants(m.data.data); })
//       .finally(() => setLoading(false));
//   }, []);

//   const s = stats || {};

//   return (
//     <div className="layout">
//       <AgentSidebar />
//       <div className="main-content">
//         <Topbar title={`Welcome, ${user?.name?.split(' ')[0]}!`} subtitle="Your merchant acquisition overview" />
//         <div className="page-content">
//           {loading ? <Loading /> : <>
//             <div className="stats-grid">
//               <StatCard icon="🏪" label="Total Merchants" value={s.total} color="#4f8ef7" to="/agent/merchants" />
//               <StatCard icon="⏳" label="Pending Review" value={s.pending} color="#f59e0b" to="/agent/merchants?status=submitted" />
//               <StatCard icon="✅" label="Approved" value={s.approved} color="#10b981" />
//               <StatCard icon="🟢" label="Active Merchants" value={s.active} color="#059669" to="/agent/merchants?status=active" />
//               <StatCard icon="❌" label="Rejected" value={s.rejected} color="#ef4444" to="/agent/merchants?status=rejected" />
//               <StatCard icon="💰" label="Commission Eligible" value={s.commissionEligible} color="#ec4899" to="/agent/merchants?status=commission_eligible" />
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
//               <div className="card">
//                 <div className="card-header"><h3 className="card-title">Recent Merchants</h3><Link to="/agent/merchants" style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>View all</Link></div>
//                 {recentMerchants.length === 0 ? (
//                   <div className="empty-state" style={{ padding: 24 }}>
//                     <p>No merchants yet</p>
//                     <Link to="/agent/add-merchant" className="btn btn-primary btn-sm mt-16">Add First Merchant</Link>
//                   </div>
//                 ) : (
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//                     {recentMerchants.map(m => (
//                       <Link key={m._id} to={`/agent/merchants/${m._id}`} style={{ textDecoration: 'none', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <div>
//                           <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.merchantName}</div>
//                           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.shopName}</div>
//                         </div>
//                         <span className={`badge badge-${m.status}`}>{m.status.replace('_', ' ')}</span>
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="card">
//                 <div className="card-header"><h3 className="card-title">Quick Actions</h3></div>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//                   <Link to="/agent/add-merchant" className="btn btn-primary">+ Add New Merchant</Link>
//                   <Link to="/agent/merchants?status=draft" className="btn btn-outline">Continue Draft Merchants</Link>
//                   <Link to="/agent/merchants?status=rejected" className="btn btn-outline">View Rejected Merchants</Link>
//                   <Link to="/agent/notifications" className="btn btn-outline">Check Notifications</Link>
//                 </div>
//               </div>
//             </div>
//           </>}
//         </div>
//       </div>
//     </div>
//   );
// }




















import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AgentSidebar from '../../components/AgentSidebar';
import { Topbar, Loading, StatusBadge } from '../../components/index';
import { getAgentStats, getMyMerchants } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, label, value, color, to }) => (
  <div className="stat-card" style={{ cursor: to ? 'pointer' : 'default' }}>
    {to ? (
      <Link to={to} style={{ textDecoration: 'none', display: 'contents' }}>
        <div className="stat-icon" style={{ background: `${color}18`, color }}>{icon}</div>
        <div className="stat-value" style={{ color: 'var(--text)' }}>{value ?? 0}</div>
        <div className="stat-label">{label}</div>
        <div style={{ fontSize: '0.72rem', color, marginTop: 4, fontWeight: 600 }}>View all →</div>
      </Link>
    ) : (
      <>
        <div className="stat-icon" style={{ background: `${color}18`, color }}>{icon}</div>
        <div className="stat-value">{value ?? 0}</div>
        <div className="stat-label">{label}</div>
      </>
    )}
  </div>
);

export default function AgentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentMerchants, setRecentMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAgentStats(), getMyMerchants({ limit: 5 })])
      .then(([s, m]) => {
        setStats(s.data.data);
        setRecentMerchants(m.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const s = stats || {};
  const firstName = (user?.name || user?.fullName || 'Agent').split(' ')[0];

  if (loading) return (
    <div className="layout">
      <AgentSidebar />
      <div className="main-content">
        <Topbar title="Dashboard" />
        <div className="page-content"><Loading /></div>
      </div>
    </div>
  );

  return (
    <div className="layout">
      <AgentSidebar />
      <div className="main-content">
        <Topbar title={`Welcome, ${firstName}!`} subtitle="Your merchant acquisition overview" />
        <div className="page-content">

          {/* Welcome banner */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #2d3875 100%)',
            borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12, color: '#fff'
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Good day, {firstName}! 👋</h2>
              <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>
                Here's your merchant acquisition summary
              </p>
            </div>
            <Link to="/agent/add-merchant" className="btn btn-primary" style={{
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff', backdropFilter: 'blur(4px)'
            }}>
              + Add Merchant
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', marginBottom: 24 }}>
            <StatCard icon="🏪" label="Total Merchants"     value={s.total}             color="#4f8ef7" to="/agent/merchants" />
            <StatCard icon="⏳" label="Pending Review"      value={s.pending}           color="#f59e0b" to="/agent/merchants?status=submitted" />
            <StatCard icon="✅" label="Approved"            value={s.approved}          color="#10b981" />
            <StatCard icon="🟢" label="Active"              value={s.active}            color="#059669" to="/agent/merchants?status=active" />
            <StatCard icon="❌" label="Rejected"            value={s.rejected}          color="#ef4444" to="/agent/merchants?status=rejected" />
            <StatCard icon="💰" label="Commission Eligible" value={s.commissionEligible} color="#ec4899" to="/agent/merchants?status=commission_eligible" />
          </div>

          {/* Bottom two-panel */}
          <div className="agent-dash-bottom" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Recent merchants */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title" style={{ marginBottom: 0 }}>Recent Merchants</h3>
                <Link to="/agent/merchants" style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600 }}>View all →</Link>
              </div>
              {recentMerchants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>🏪</div>
                  <p style={{ marginBottom: 12, fontSize: '0.88rem' }}>No merchants yet</p>
                  <Link to="/agent/add-merchant" className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
                    Add First Merchant
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {recentMerchants.map(m => (
                    <Link
                      key={m._id}
                      to={`/agent/merchants/${m._id}`}
                      style={{
                        textDecoration: 'none', padding: '10px 12px',
                        border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        gap: 8, transition: 'background 0.15s'
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.merchantName}</div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: 1 }}>{m.shopName}</div>
                      </div>
                      <StatusBadge status={m.status} />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title" style={{ marginBottom: 0 }}>Quick Actions</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/agent/add-merchant" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  🏪 Add New Merchant
                </Link>
                <Link to="/agent/merchants?status=draft" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                  📝 Continue Draft Merchants
                </Link>
                <Link to="/agent/merchants?status=rejected" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                  🔄 View Rejected Merchants
                </Link>
                <Link to="/agent/notifications" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                  🔔 Check Notifications
                </Link>
                <Link to="/agent/profile" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                  👤 My Profile
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}