// import React, { useState, useEffect } from 'react';
// import AgentSidebar from '../../components/AgentSidebar';
// import { Topbar, Loading } from '../../components/index';
// import { useAuth } from '../../context/AuthContext';
// import { getMe, getMyAttendance, getCommissions } from '../../services/api';
// import toast from 'react-hot-toast';

// const AgentProfile = () => {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [attendance, setAttendance] = useState([]);
//   const [commissions, setCommissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('profile');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [profileRes, attendanceRes, commissionRes] = await Promise.allSettled([
//         getMe(),
//         getMyAttendance(),
//         getCommissions(),
//       ]);
//       if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data.data);
//       if (attendanceRes.status === 'fulfilled') setAttendance(attendanceRes.value.data.data || []);
//       if (commissionRes.status === 'fulfilled') setCommissions(commissionRes.value.data.data || []);
//     } catch (err) {
//       toast.error('Failed to load profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDuration = (minutes) => {
//     if (!minutes) return '—';
//     const h = Math.floor(minutes / 60);
//     const m = minutes % 60;
//     return `${h}h ${m}m`;
//   };

//   const totalWorkingHours = attendance.reduce((acc, log) => acc + (log.sessionDuration || 0), 0);

//   if (loading) return (
//     <div className="layout">
//       <AgentSidebar />
//       <main className="main-content">
//         <Topbar title="My Profile" />
//         <Loading />
//       </main>
//     </div>
//   );

//   const data = profile || user;

//   return (
//     <div className="layout">
//       <AgentSidebar />
//       <main className="main-content">
//         <Topbar title="My Profile" />
//         <div className="page-content">

//           {/* Profile Header Card */}
//           <div className="card" style={{ marginBottom: '1.5rem' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
//               <div style={{
//                 width: '80px', height: '80px', borderRadius: '50%',
//                 background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 fontSize: '2rem', color: '#fff', fontWeight: 700, flexShrink: 0
//               }}>
//                 {(data?.fullName || data?.name || 'A')[0].toUpperCase()}
//               </div>
//               <div style={{ flex: 1 }}>
//                 <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>{data?.fullName || data?.name}</h2>
//                 <p style={{ color: 'var(--text-muted)', margin: '4px 0' }}>{data?.email}</p>
//                 <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
//                   <span style={{
//                     background: data?.status === 'approved' ? '#dcfce7' : '#fef9c3',
//                     color: data?.status === 'approved' ? '#15803d' : '#a16207',
//                     padding: '2px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600
//                   }}>
//                     {(data?.status || 'approved').toUpperCase()}
//                   </span>
//                   <span style={{
//                     background: '#eff6ff', color: '#1d4ed8',
//                     padding: '2px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600
//                   }}>
//                     {(data?.employmentType || 'full_time').replace('_', ' ').toUpperCase()}
//                   </span>
//                 </div>
//               </div>
//               <div style={{ textAlign: 'right' }}>
//                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Member since</div>
//                 <div style={{ fontWeight: 600 }}>
//                   {data?.createdAt ? new Date(data.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stats Row */}
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
//             {[
//               { label: 'Total Sessions', value: attendance.length, icon: '📅' },
//               { label: 'Total Hours', value: formatDuration(totalWorkingHours), icon: '⏱️' },
//               { label: 'Commissions', value: commissions.length, icon: '💰' },
//               { label: 'Avg Session', value: attendance.length ? formatDuration(Math.round(totalWorkingHours / attendance.length)) : '—', icon: '📊' },
//             ].map(stat => (
//               <div key={stat.label} className="stat-card" style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
//                 <div className="stat-value" style={{ fontSize: '1.1rem' }}>{stat.value}</div>
//                 <div className="stat-label">{stat.label}</div>
//               </div>
//             ))}
//           </div>

//           {/* Tabs */}
//           <div className="tabs" style={{ marginBottom: '1.5rem' }}>
//             {['profile', 'attendance', 'commissions'].map(tab => (
//               <button
//                 key={tab}
//                 className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab === 'profile' && '👤 '}
//                 {tab === 'attendance' && '📋 '}
//                 {tab === 'commissions' && '💰 '}
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>

//           {/* Profile Tab */}
//           {activeTab === 'profile' && (
//             <div className="card">
//               <h3 className="card-title">Personal Details</h3>
//               <div className="info-grid" style={{ maxWidth: '500px' }}>
//                 <div className="info-row">
//                   <span className="info-label">Full Name</span>
//                   <span className="info-value">{data?.fullName || data?.name}</span>
//                 </div>
//                 <div className="info-row">
//                   <span className="info-label">Email Address</span>
//                   <span className="info-value">{data?.email}</span>
//                 </div>
//                 <div className="info-row">
//                   <span className="info-label">Mobile Number</span>
//                   <span className="info-value">{data?.mobile || '—'}</span>
//                 </div>
//                 <div className="info-row">
//                   <span className="info-label">Employment Type</span>
//                   <span className="info-value" style={{ textTransform: 'capitalize' }}>
//                     {(data?.employmentType || '—').replace('_', ' ')}
//                   </span>
//                 </div>
//                 <div className="info-row">
//                   <span className="info-label">Account Status</span>
//                   <span className="info-value" style={{ textTransform: 'capitalize', color: 'var(--success)' }}>
//                     {data?.status || 'approved'}
//                   </span>
//                 </div>
//                 <div className="info-row">
//                   <span className="info-label">Terms Accepted</span>
//                   <span className="info-value">{data?.termsAccepted ? '✅ Yes' : '❌ No'}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Attendance Tab */}
//           {activeTab === 'attendance' && (
//             <div className="card">
//               <h3 className="card-title">Attendance Log</h3>
//               {attendance.length === 0 ? (
//                 <div className="empty-state" style={{ padding: '2rem' }}>
//                   <span className="empty-icon">📅</span>
//                   <p>No attendance records found.</p>
//                 </div>
//               ) : (
//                 <div style={{ overflowX: 'auto' }}>
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>Date</th>
//                         <th>Login Time</th>
//                         <th>Logout Time</th>
//                         <th>Duration</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {attendance.slice(0, 30).map((log, idx) => (
//                         <tr key={idx}>
//                           <td>{new Date(log.loginTime).toLocaleDateString('en-IN')}</td>
//                           <td>{new Date(log.loginTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
//                           <td>{log.logoutTime ? new Date(log.logoutTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active</span>}</td>
//                           <td>{formatDuration(log.sessionDuration)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Commissions Tab */}
//           {activeTab === 'commissions' && (
//             <div className="card">
//               <h3 className="card-title">Commission Records</h3>
//               {commissions.length === 0 ? (
//                 <div className="empty-state" style={{ padding: '2rem' }}>
//                   <span className="empty-icon">💰</span>
//                   <h4>No commissions yet</h4>
//                   <p>Commission becomes eligible after your merchants complete the full activation workflow.</p>
//                 </div>
//               ) : (
//                 <div style={{ overflowX: 'auto' }}>
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th>Merchant</th>
//                         <th>Amount</th>
//                         <th>Status</th>
//                         <th>Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {commissions.map((com, idx) => (
//                         <tr key={idx}>
//                           <td>{com.merchantId?.merchantName || '—'}</td>
//                           <td style={{ fontWeight: 600 }}>₹{com.amount?.toLocaleString('en-IN') || '—'}</td>
//                           <td>
//                             <span style={{
//                               padding: '2px 8px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600,
//                               background: com.status === 'paid' ? '#dcfce7' : '#fef9c3',
//                               color: com.status === 'paid' ? '#15803d' : '#a16207'
//                             }}>
//                               {(com.status || 'pending').toUpperCase()}
//                             </span>
//                           </td>
//                           <td>{com.createdAt ? new Date(com.createdAt).toLocaleDateString('en-IN') : '—'}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// };

// export default AgentProfile;






































// import React, { useState, useEffect } from 'react';
// import AgentSidebar from '../../components/AgentSidebar';
// import { Topbar, Loading } from '../../components/index';
// import { useAuth } from '../../context/AuthContext';
// import { getMe, getMyAttendance, getCommissions } from '../../services/api';
// import toast from 'react-hot-toast';

// const fmtDuration = (mins) => {
//   if (!mins) return '—';
//   return `${Math.floor(mins / 60)}h ${mins % 60}m`;
// };

// export default function AgentProfile() {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [attendance, setAttendance] = useState([]);
//   const [commissions, setCommissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('profile');

//   useEffect(() => {
//     Promise.allSettled([getMe(), getMyAttendance(), getCommissions()])
//       .then(([p, a, c]) => {
//         if (p.status === 'fulfilled') setProfile(p.value.data.data);
//         if (a.status === 'fulfilled') setAttendance(a.value.data.data || []);
//         if (c.status === 'fulfilled') setCommissions(c.value.data.data || []);
//       })
//       .catch(() => toast.error('Failed to load profile'))
//       .finally(() => setLoading(false));
//   }, []);

//   const totalMins = attendance.reduce((s, l) => s + (l.sessionDuration || 0), 0);
//   const data = profile || user;

//   if (loading) return (
//     <div className="layout">
//       <AgentSidebar />
//       <div className="main-content">
//         <Topbar title="My Profile" />
//         <div className="page-content"><Loading /></div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="layout">
//       <AgentSidebar />
//       <div className="main-content">
//         <Topbar title="My Profile" />
//         <div className="page-content">

//           {/* Profile hero card */}
//           <div className="card" style={{ marginBottom: 20 }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
//               {/* Avatar */}
//               <div
//                 className="profile-header-avatar"
//                 style={{
//                   width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
//                   background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   fontSize: '1.7rem', color: '#fff', fontWeight: 700
//                 }}
//               >
//                 {(data?.fullName || data?.name || 'A')[0].toUpperCase()}
//               </div>
//               {/* Info */}
//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <h2
//                   className="profile-header-name"
//                   style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
//                 >
//                   {data?.fullName || data?.name}
//                 </h2>
//                 <p style={{ color: 'var(--text-muted)', margin: '2px 0 8px', fontSize: '0.82rem' }}>{data?.email}</p>
//                 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//                   <span style={{
//                     background: data?.status === 'approved' ? '#dcfce7' : '#fef9c3',
//                     color: data?.status === 'approved' ? '#15803d' : '#a16207',
//                     padding: '2px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700
//                   }}>
//                     {(data?.status || 'APPROVED').toUpperCase()}
//                   </span>
//                   <span style={{
//                     background: '#eff6ff', color: '#1d4ed8',
//                     padding: '2px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700
//                   }}>
//                     {(data?.employmentType || 'full_time').replace(/_/g, ' ').toUpperCase()}
//                   </span>
//                 </div>
//               </div>
//               {/* Since */}
//               <div style={{ textAlign: 'right', flexShrink: 0 }}>
//                 <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 2 }}>Member since</div>
//                 <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
//                   {data?.createdAt
//                     ? new Date(data.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
//                     : '—'}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Summary stats */}
//           <div className="agent-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
//             {[
//               { icon: '📅', label: 'Sessions',    value: attendance.length },
//               { icon: '⏱️', label: 'Total Hours', value: fmtDuration(totalMins) },
//               { icon: '💰', label: 'Commissions', value: commissions.length },
//               { icon: '📊', label: 'Avg Session', value: attendance.length ? fmtDuration(Math.round(totalMins / attendance.length)) : '—' },
//             ].map(s => (
//               <div key={s.label} className="stat-card" style={{ padding: '14px 12px', textAlign: 'center' }}>
//                 <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{s.icon}</div>
//                 <div className="stat-value" style={{ fontSize: '1rem' }}>{s.value}</div>
//                 <div className="stat-label" style={{ fontSize: '0.72rem' }}>{s.label}</div>
//               </div>
//             ))}
//           </div>

//           {/* Tabs */}
//           <div className="tabs" style={{ marginBottom: 20 }}>
//             {[
//               { id: 'profile',     label: '👤 Profile' },
//               { id: 'attendance',  label: '📋 Attendance' },
//               { id: 'commissions', label: '💰 Commissions' },
//             ].map(t => (
//               <button
//                 key={t.id}
//                 className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
//                 onClick={() => setActiveTab(t.id)}
//               >{t.label}</button>
//             ))}
//           </div>

//           {/* Profile details */}
//           {activeTab === 'profile' && (
//             <div className="card">
//               <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Personal Details</h3>
//               {[
//                 ['Full Name',        data?.fullName || data?.name],
//                 ['Email Address',    data?.email],
//                 ['Mobile Number',    data?.mobile],
//                 ['Employment Type',  (data?.employmentType || '—').replace(/_/g, ' ')],
//                 ['Account Status',   data?.status || 'approved'],
//                 ['Terms Accepted',   data?.termsAccepted ? '✅ Accepted' : '❌ Not accepted'],
//               ].map(([label, value]) => (
//                 <div key={label} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
//                   <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: 140, flexShrink: 0, paddingTop: 1 }}>{label}</span>
//                   <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', textTransform: label === 'Account Status' ? 'capitalize' : undefined }}>{value || '—'}</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Attendance */}
//           {activeTab === 'attendance' && (
//             <div className="card" style={{ padding: 0 }}>
//               <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
//                 <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>Attendance Log</h3>
//               </div>
//               {attendance.length === 0 ? (
//                 <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
//                   <div style={{ fontSize: '2rem', marginBottom: 8 }}>📅</div>
//                   <p>No attendance records yet.</p>
//                 </div>
//               ) : (
//                 <div style={{ overflowX: 'auto' }}>
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Date</th>
//                         <th>Login</th>
//                         <th>Logout</th>
//                         <th>Duration</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {attendance.slice(0, 30).map((log, i) => (
//                         <tr key={i}>
//                           <td>{new Date(log.loginTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
//                           <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
//                             {new Date(log.loginTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
//                           </td>
//                           <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
//                             {log.logoutTime
//                               ? new Date(log.logoutTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
//                               : <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active</span>}
//                           </td>
//                           <td style={{ fontWeight: 500 }}>{fmtDuration(log.sessionDuration)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Commissions */}
//           {activeTab === 'commissions' && (
//             <div className="card" style={{ padding: 0 }}>
//               <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
//                 <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>Commission Records</h3>
//               </div>
//               {commissions.length === 0 ? (
//                 <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
//                   <div style={{ fontSize: '2rem', marginBottom: 8 }}>💰</div>
//                   <p style={{ marginBottom: 6 }}>No commissions yet.</p>
//                   <p style={{ fontSize: '0.8rem' }}>Commission unlocks after merchants complete the full activation workflow.</p>
//                 </div>
//               ) : (
//                 <div style={{ overflowX: 'auto' }}>
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Merchant</th>
//                         <th>Amount</th>
//                         <th>Status</th>
//                         <th>Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {commissions.map((c, i) => (
//                         <tr key={i}>
//                           <td><strong>{c.merchantId?.merchantName || '—'}</strong></td>
//                           <td style={{ fontWeight: 700, color: 'var(--success)' }}>₹{c.amount?.toLocaleString('en-IN') || '—'}</td>
//                           <td>
//                             <span style={{
//                               padding: '2px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700,
//                               background: c.status === 'paid' ? '#dcfce7' : '#fef9c3',
//                               color: c.status === 'paid' ? '#15803d' : '#a16207'
//                             }}>
//                               {(c.status || 'PENDING').toUpperCase()}
//                             </span>
//                           </td>
//                           <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
//                             {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }





































import React, { useState, useEffect } from 'react';
import AgentSidebar from '../../components/AgentSidebar';
import { Topbar, Loading } from '../../components/index';
import { useAuth } from '../../context/AuthContext';
import { getMe, getMyAttendance, getCommissions } from '../../services/api';
import toast from 'react-hot-toast';

const fmtDuration = (mins) => {
  if (!mins) return '—';
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

export default function AgentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    Promise.allSettled([getMe(), getMyAttendance(), getCommissions()])
      .then(([p, a, c]) => {
        if (p.status === 'fulfilled') setProfile(p.value.data.data);
        if (a.status === 'fulfilled') setAttendance(a.value.data.data || []);
        if (c.status === 'fulfilled') setCommissions(c.value.data.data || []);
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const totalMins = attendance.reduce((s, l) => s + (l.sessionDuration || 0), 0);
  const data = profile || user;

  if (loading) return (
    <div className="layout">
      <AgentSidebar />
      <div className="main-content">
        <Topbar title="My Profile" />
        <div className="page-content"><Loading /></div>
      </div>
    </div>
  );

  return (
    <div className="layout">
      <AgentSidebar />
      <div className="main-content">
        <Topbar title="My Profile" />
        <div className="page-content">

          {/* Profile hero card */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div
                className="profile-header-avatar"
                style={{
                  width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', color: '#fff', fontWeight: 700
                }}
              >
                {(data?.fullName || data?.name || 'A')[0].toUpperCase()}
              </div>
              {/* Info — takes remaining width, never pushes off screen */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  className="profile-header-name"
                  style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {data?.fullName || data?.name}
                </h2>
                <p style={{ color: 'var(--text-muted)', margin: '2px 0 6px', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data?.email}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{
                    background: data?.status === 'approved' ? '#dcfce7' : '#fef9c3',
                    color: data?.status === 'approved' ? '#15803d' : '#a16207',
                    padding: '2px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700
                  }}>
                    {(data?.status || 'APPROVED').toUpperCase()}
                  </span>
                  <span style={{
                    background: '#eff6ff', color: '#1d4ed8',
                    padding: '2px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700
                  }}>
                    {(data?.employmentType || 'full_time').replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Member since{' '}
                  <strong style={{ color: 'var(--text)' }}>
                    {data?.createdAt
                      ? new Date(data.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                      : '—'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Summary stats */}
          <div className="agent-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 20 }}>
            {[
              { icon: '📅', label: 'Sessions',    value: attendance.length },
              { icon: '⏱️', label: 'Total Hours', value: fmtDuration(totalMins) },
              { icon: '💰', label: 'Commissions', value: commissions.length },
              { icon: '📊', label: 'Avg Session', value: attendance.length ? fmtDuration(Math.round(totalMins / attendance.length)) : '—' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ padding: '14px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{s.icon}</div>
                <div className="stat-value" style={{ fontSize: '1rem' }}>{s.value}</div>
                <div className="stat-label" style={{ fontSize: '0.72rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            {[
              { id: 'profile',     label: '👤 Profile' },
              { id: 'attendance',  label: '📋 Attendance' },
              { id: 'commissions', label: '💰 Commissions' },
            ].map(t => (
              <button
                key={t.id}
                className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >{t.label}</button>
            ))}
          </div>

          {/* Profile details */}
          {activeTab === 'profile' && (
            <div className="card">
              <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Personal Details</h3>
              {[
                ['Full Name',        data?.fullName || data?.name],
                ['Email Address',    data?.email],
                ['Mobile Number',    data?.mobile],
                ['Employment Type',  (data?.employmentType || '—').replace(/_/g, ' ')],
                ['Account Status',   data?.status || 'approved'],
                ['Terms Accepted',   data?.termsAccepted ? '✅ Accepted' : '❌ Not accepted'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '40%', maxWidth: 130, flexShrink: 0, paddingTop: 1, lineHeight: 1.4 }}>{label}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)', textTransform: label === 'Account Status' ? 'capitalize' : undefined }}>{value || '—'}</span>
                </div>
              ))}
            </div>
          )}

          {/* Attendance */}
          {activeTab === 'attendance' && (
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>Attendance Log</h3>
              </div>
              {attendance.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>📅</div>
                  <p>No attendance records yet.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table style={{ minWidth: 380 }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Login</th>
                        <th>Logout</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.slice(0, 30).map((log, i) => (
                        <tr key={i}>
                          <td>{new Date(log.loginTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                            {new Date(log.loginTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                            {log.logoutTime
                              ? new Date(log.logoutTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                              : <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active</span>}
                          </td>
                          <td style={{ fontWeight: 500 }}>{fmtDuration(log.sessionDuration)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Commissions */}
          {activeTab === 'commissions' && (
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>Commission Records</h3>
              </div>
              {commissions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>💰</div>
                  <p style={{ marginBottom: 6 }}>No commissions yet.</p>
                  <p style={{ fontSize: '0.8rem' }}>Commission unlocks after merchants complete the full activation workflow.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table style={{ minWidth: 360 }}>
                    <thead>
                      <tr>
                        <th>Merchant</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissions.map((c, i) => (
                        <tr key={i}>
                          <td><strong>{c.merchantId?.merchantName || '—'}</strong></td>
                          <td style={{ fontWeight: 700, color: 'var(--success)' }}>₹{c.amount?.toLocaleString('en-IN') || '—'}</td>
                          <td>
                            <span style={{
                              padding: '2px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700,
                              background: c.status === 'paid' ? '#dcfce7' : '#fef9c3',
                              color: c.status === 'paid' ? '#15803d' : '#a16207'
                            }}>
                              {(c.status || 'PENDING').toUpperCase()}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}