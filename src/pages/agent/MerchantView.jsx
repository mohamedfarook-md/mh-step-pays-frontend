// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import AgentSidebar from '../../components/AgentSidebar';
// import { Topbar, StatusBadge, StatusTimeline, Loading } from '../../components/index';
// import { getMerchant } from '../../services/api';
// import toast from 'react-hot-toast';

// const MerchantView = () => {
//   const { id } = useParams();
//   const [merchant, setMerchant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('info');

//   useEffect(() => {
//     fetchMerchant();
//   }, [id]);

//   const fetchMerchant = async () => {
//     try {
//       setLoading(true);
//       const res = await getMerchant(id);
//       setMerchant(res.data.data);
//     } catch (err) {
//       toast.error('Failed to load merchant details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return (
//     <div className="layout">
//       <AgentSidebar />
//       <main className="main-content">
//         <Topbar title="Merchant Details" />
//         <Loading />
//       </main>
//     </div>
//   );

//   if (!merchant) return (
//     <div className="layout">
//       <AgentSidebar />
//       <main className="main-content">
//         <Topbar title="Merchant Details" />
//         <div className="page-content">
//           <div className="empty-state">
//             <span className="empty-icon">🏪</span>
//             <h3>Merchant not found</h3>
//             <Link to="/agent/merchants" className="btn btn-primary">Back to My Merchants</Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   );

//   const statusSteps = [
//     'draft', 'submitted', 'under_review', 'approved',
//     'qr_uploaded', 'qr_deployed', 'transaction_verified',
//     '7_day_validation', 'active', 'commission_eligible', 'completed'
//   ];

//   const currentStepIndex = statusSteps.indexOf(merchant.status);

//   return (
//     <div className="layout">
//       <AgentSidebar />
//       <main className="main-content">
//         <Topbar title="Merchant Details" />
//         <div className="page-content">

//           {/* Header */}
//           <div className="page-header" style={{ marginBottom: '1.5rem' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
//               <Link to="/agent/merchants" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
//                 ← Back
//               </Link>
//               <div>
//                 <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>{merchant.merchantName}</h1>
//                 <p style={{ color: 'var(--text-muted)', margin: '2px 0 0', fontSize: '0.9rem' }}>{merchant.shopName}</p>
//               </div>
//               <div style={{ marginLeft: 'auto' }}>
//                 <StatusBadge status={merchant.status} />
//               </div>
//             </div>
//           </div>

//           {/* Rejection Notice */}
//           {merchant.status === 'rejected' && merchant.rejectionReason && (
//             <div className="alert alert-danger" style={{
//               background: '#fff5f5', border: '1px solid #fecdd3',
//               borderRadius: '8px', padding: '1rem 1.25rem',
//               marginBottom: '1.5rem', color: '#be123c'
//             }}>
//               <strong>❌ Rejection Reason:</strong> {merchant.rejectionReason}
//             </div>
//           )}

//           {/* Progress Bar */}
//           {merchant.status !== 'rejected' && (
//             <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
//               <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
//                 Workflow Progress
//               </h3>
//               <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: '0.5rem', gap: 0 }}>
//                 {statusSteps.slice(0, -1).map((step, idx) => {
//                   const isDone = idx < currentStepIndex;
//                   const isCurrent = idx === currentStepIndex;
//                   const label = step.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
//                   return (
//                     <React.Fragment key={step}>
//                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px' }}>
//                         <div style={{
//                           width: '28px', height: '28px', borderRadius: '50%',
//                           background: isDone ? 'var(--success)' : isCurrent ? 'var(--accent)' : 'var(--border)',
//                           color: isDone || isCurrent ? '#fff' : 'var(--text-muted)',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center',
//                           fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
//                         }}>
//                           {isDone ? '✓' : idx + 1}
//                         </div>
//                         <span style={{
//                           fontSize: '0.6rem', textAlign: 'center', marginTop: '4px',
//                           color: isCurrent ? 'var(--accent)' : 'var(--text-muted)',
//                           fontWeight: isCurrent ? 700 : 400, lineHeight: 1.2
//                         }}>{label}</span>
//                       </div>
//                       {idx < statusSteps.length - 2 && (
//                         <div style={{
//                           flex: 1, height: '2px', minWidth: '12px',
//                           background: idx < currentStepIndex ? 'var(--success)' : 'var(--border)',
//                           marginBottom: '20px'
//                         }} />
//                       )}
//                     </React.Fragment>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Tabs */}
//           <div className="tabs" style={{ marginBottom: '1.5rem' }}>
//             {['info', 'documents', 'timeline'].map(tab => (
//               <button
//                 key={tab}
//                 className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab === 'info' && '📋 '}
//                 {tab === 'documents' && '📁 '}
//                 {tab === 'timeline' && '🕐 '}
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>

//           {/* Info Tab */}
//           {activeTab === 'info' && (
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
//               <div className="card">
//                 <h3 className="card-title">Personal Information</h3>
//                 <div className="info-grid">
//                   <div className="info-row"><span className="info-label">Merchant Name</span><span className="info-value">{merchant.merchantName}</span></div>
//                   <div className="info-row"><span className="info-label">Mobile</span><span className="info-value">{merchant.mobile}</span></div>
//                   <div className="info-row"><span className="info-label">Email</span><span className="info-value">{merchant.email || '—'}</span></div>
//                   <div className="info-row"><span className="info-label">Aadhaar</span><span className="info-value">{merchant.aadhaarNumber ? `XXXX-XXXX-${merchant.aadhaarNumber.slice(-4)}` : '—'}</span></div>
//                   <div className="info-row"><span className="info-label">PAN</span><span className="info-value">{merchant.panNumber || '—'}</span></div>
//                 </div>
//               </div>

//               <div className="card">
//                 <h3 className="card-title">Business Information</h3>
//                 <div className="info-grid">
//                   <div className="info-row"><span className="info-label">Shop Name</span><span className="info-value">{merchant.shopName}</span></div>
//                   <div className="info-row"><span className="info-label">Category</span><span className="info-value">{merchant.businessCategory}</span></div>
//                   <div className="info-row"><span className="info-label">Address</span><span className="info-value">{merchant.address}</span></div>
//                   <div className="info-row"><span className="info-label">City</span><span className="info-value">{merchant.city || '—'}</span></div>
//                   <div className="info-row"><span className="info-label">State</span><span className="info-value">{merchant.state || '—'}</span></div>
//                   <div className="info-row"><span className="info-label">Pincode</span><span className="info-value">{merchant.pincode || '—'}</span></div>
//                 </div>
//               </div>

//               {merchant.transactionVerified && (
//                 <div className="card">
//                   <h3 className="card-title">Transaction Info</h3>
//                   <div className="info-grid">
//                     <div className="info-row"><span className="info-label">First Transaction</span><span className="info-value">{merchant.firstTransactionDate ? new Date(merchant.firstTransactionDate).toLocaleDateString() : '—'}</span></div>
//                     <div className="info-row"><span className="info-label">Transaction Count</span><span className="info-value">{merchant.transactionCount || 0}</span></div>
//                     <div className="info-row"><span className="info-label">Verified</span><span className="info-value" style={{ color: 'var(--success)' }}>✓ Yes</span></div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Documents Tab */}
//           {activeTab === 'documents' && (
//             <div className="card">
//               <h3 className="card-title">Uploaded Documents</h3>
//               {merchant.documents ? (
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
//                   {[
//                     { key: 'aadhaarFront', label: 'Aadhaar Front' },
//                     { key: 'aadhaarBack', label: 'Aadhaar Back' },
//                     { key: 'panFront', label: 'PAN Front' },
//                     { key: 'panBack', label: 'PAN Back' },
//                     { key: 'utilityBill', label: 'Utility Bill' },
//                     { key: 'bankDocument', label: 'Bank Document' },
//                     { key: 'gstOrAgreement', label: 'GST / Agreement' },
//                     { key: 'shopPhoto', label: 'Shop Photo' },
//                     { key: 'shopBoardPhoto', label: 'Shop Board' },
//                   ].map(({ key, label }) => {
//                     const uploaded = merchant.documents[key]?.uploadedAt;
//                     return (
//                       <div key={key} style={{
//                         padding: '1rem', borderRadius: '8px',
//                         border: `1px solid ${uploaded ? 'var(--success)' : 'var(--border)'}`,
//                         background: uploaded ? '#f0fdf4' : '#fafafa'
//                       }}>
//                         <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{uploaded ? '✅' : '📄'}</div>
//                         <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{label}</div>
//                         <div style={{ fontSize: '0.75rem', color: uploaded ? 'var(--success)' : 'var(--text-muted)', marginTop: '4px' }}>
//                           {uploaded ? `Uploaded ${new Date(uploaded).toLocaleDateString()}` : 'Not uploaded'}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <p style={{ color: 'var(--text-muted)' }}>No document information available.</p>
//               )}
//               <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
//                 🔒 Document previews are restricted to administrators only.
//               </p>
//             </div>
//           )}

//           {/* Timeline Tab */}
//           {activeTab === 'timeline' && (
//             <div className="card">
//               <h3 className="card-title">Status Timeline</h3>
//               {merchant.statusTimeline && merchant.statusTimeline.length > 0 ? (
//                 <StatusTimeline timeline={merchant.statusTimeline} />
//               ) : (
//                 <p style={{ color: 'var(--text-muted)' }}>No timeline events yet.</p>
//               )}
//             </div>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// };

// export default MerchantView;











































// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import AgentSidebar from '../../components/AgentSidebar';
// import { Topbar, StatusBadge, StatusTimeline, Loading } from '../../components/index';
// import { getMerchant } from '../../services/api';
// import toast from 'react-hot-toast';

// const STATUS_STEPS = [
//   'draft','submitted','under_review','approved',
//   'qr_uploaded','qr_deployed','transaction_verified',
//   '7_day_validation','active','commission_eligible'
// ];

// const InfoRow = ({ label, value }) => (
//   <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
//     <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: 130, paddingTop: 2, flexShrink: 0 }}>{label}</span>
//     <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 500, wordBreak: 'break-word' }}>{value || '—'}</span>
//   </div>
// );

// export default function MerchantView() {
//   const { id } = useParams();
//   const [merchant, setMerchant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('info');

//   useEffect(() => {
//     getMerchant(id)
//       .then(res => setMerchant(res.data.data))
//       .catch(() => toast.error('Failed to load merchant'))
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) return (
//     <div className="layout">
//       <AgentSidebar />
//       <div className="main-content">
//         <Topbar title="Merchant Details" />
//         <div className="page-content"><Loading /></div>
//       </div>
//     </div>
//   );

//   if (!merchant) return (
//     <div className="layout">
//       <AgentSidebar />
//       <div className="main-content">
//         <Topbar title="Merchant Details" />
//         <div className="page-content">
//           <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
//             <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏪</div>
//             <h3>Merchant not found</h3>
//             <Link to="/agent/merchants" className="btn btn-primary" style={{ marginTop: 16 }}>← Back</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const currentStep = STATUS_STEPS.indexOf(merchant.status);

//   return (
//     <div className="layout">
//       <AgentSidebar />
//       <div className="main-content">
//         <Topbar title="Merchant Details" />
//         <div className="page-content">

//           {/* Back + Header */}
//           <div style={{ marginBottom: 20 }}>
//             <Link to="/agent/merchants" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
//               ← Back to My Merchants
//             </Link>
//             <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
//               <div>
//                 <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>{merchant.merchantName}</h2>
//                 <p style={{ color: 'var(--text-muted)', margin: '2px 0 0', fontSize: '0.85rem' }}>{merchant.shopName} · {merchant.businessCategory}</p>
//               </div>
//               <StatusBadge status={merchant.status} />
//             </div>
//           </div>

//           {/* Rejection notice */}
//           {merchant.status === 'rejected' && merchant.rejectionReason && (
//             <div style={{ padding: '12px 16px', background: '#fff5f5', border: '1px solid #fecdd3', borderRadius: 'var(--radius-sm)', marginBottom: 20, color: '#be123c', fontSize: '0.875rem' }}>
//               <strong>❌ Rejection reason:</strong> {merchant.rejectionReason}
//             </div>
//           )}

//           {/* Progress steps */}
//           {merchant.status !== 'rejected' && (
//             <div className="card" style={{ marginBottom: 20, padding: '16px 18px' }}>
//               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>
//                 Workflow Progress
//               </div>
//               <div style={{ display: 'flex', alignItems: 'flex-end', overflowX: 'auto', paddingBottom: 4, gap: 0 }}>
//                 {STATUS_STEPS.map((s, i) => {
//                   const done = i < currentStep;
//                   const current = i === currentStep;
//                   const label = s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
//                   return (
//                     <React.Fragment key={s}>
//                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 52 }}>
//                         <div style={{
//                           width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
//                           background: done ? 'var(--success)' : current ? 'var(--accent)' : 'var(--border)',
//                           color: done || current ? '#fff' : 'var(--text-muted)',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center',
//                           fontSize: '0.68rem', fontWeight: 700
//                         }}>
//                           {done ? '✓' : i + 1}
//                         </div>
//                         <div style={{
//                           fontSize: '0.58rem', textAlign: 'center', marginTop: 5,
//                           color: current ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text-muted)',
//                           fontWeight: current ? 700 : 400, lineHeight: 1.2, maxWidth: 52
//                         }}>
//                           {label}
//                         </div>
//                       </div>
//                       {i < STATUS_STEPS.length - 1 && (
//                         <div style={{
//                           flex: 1, height: 2, minWidth: 8,
//                           background: done ? 'var(--success)' : 'var(--border)',
//                           marginBottom: 22, transition: 'background 0.2s'
//                         }} />
//                       )}
//                     </React.Fragment>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Tabs */}
//           <div className="tabs" style={{ marginBottom: 20 }}>
//             {[
//               { id: 'info',      label: '📋 Info' },
//               { id: 'documents', label: '📁 Documents' },
//               { id: 'timeline',  label: '🕐 Timeline' },
//             ].map(t => (
//               <button
//                 key={t.id}
//                 className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
//                 onClick={() => setActiveTab(t.id)}
//               >{t.label}</button>
//             ))}
//           </div>

//           {/* Info */}
//           {activeTab === 'info' && (
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
//               <div className="card">
//                 <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 4, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Personal</h3>
//                 <InfoRow label="Full Name"   value={merchant.merchantName} />
//                 <InfoRow label="Mobile"      value={merchant.mobile} />
//                 <InfoRow label="Email"       value={merchant.email} />
//                 <InfoRow label="Aadhaar"     value={merchant.aadhaarNumber ? `XXXX-XXXX-${merchant.aadhaarNumber.slice(-4)}` : null} />
//                 <InfoRow label="PAN"         value={merchant.panNumber} />
//               </div>
//               <div className="card">
//                 <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 4, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business</h3>
//                 <InfoRow label="Shop Name"   value={merchant.shopName} />
//                 <InfoRow label="Category"    value={merchant.businessCategory} />
//                 <InfoRow label="Address"     value={merchant.address} />
//                 <InfoRow label="City"        value={merchant.city} />
//                 <InfoRow label="State"       value={merchant.state} />
//                 <InfoRow label="Pincode"     value={merchant.pincode} />
//               </div>
//               {merchant.transactionVerified && (
//                 <div className="card">
//                   <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 4, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transaction</h3>
//                   <InfoRow label="First Txn Date"  value={merchant.firstTransactionDate ? new Date(merchant.firstTransactionDate).toLocaleDateString('en-IN') : null} />
//                   <InfoRow label="Txn Count"       value={merchant.transactionCount} />
//                   <InfoRow label="Verified"        value="✅ Yes" />
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Documents */}
//           {activeTab === 'documents' && (
//             <div className="card">
//               <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 16, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Uploaded Documents</h3>
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 12 }}>
//                 {[
//                   { key: 'aadhaarFront',   label: 'Aadhaar Front' },
//                   { key: 'aadhaarBack',    label: 'Aadhaar Back' },
//                   { key: 'panFront',       label: 'PAN Front' },
//                   { key: 'panBack',        label: 'PAN Back' },
//                   { key: 'utilityBill',    label: 'Utility Bill' },
//                   { key: 'bankDocument',   label: 'Bank Doc' },
//                   { key: 'gstOrAgreement', label: 'GST / Agreement' },
//                   { key: 'shopPhoto',      label: 'Shop Photo' },
//                   { key: 'shopBoardPhoto', label: 'Shop Board' },
//                 ].map(({ key, label }) => {
//                   const uploaded = merchant.documents?.[key]?.uploadedAt;
//                   return (
//                     <div key={key} style={{
//                       padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center',
//                       border: `1px solid ${uploaded ? '#bbf7d0' : 'var(--border)'}`,
//                       background: uploaded ? '#f0fdf4' : '#fafafa'
//                     }}>
//                       <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{uploaded ? '✅' : '📄'}</div>
//                       <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>{label}</div>
//                       <div style={{ fontSize: '0.67rem', color: uploaded ? 'var(--success)' : 'var(--text-muted)', marginTop: 3 }}>
//                         {uploaded ? new Date(uploaded).toLocaleDateString('en-IN') : 'Not uploaded'}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//               <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 14 }}>
//                 🔒 Document previews are restricted to administrators.
//               </p>
//             </div>
//           )}

//           {/* Timeline */}
//           {activeTab === 'timeline' && (
//             <div className="card">
//               <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 16, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status Timeline</h3>
//               {merchant.statusTimeline?.length > 0
//                 ? <StatusTimeline timeline={merchant.statusTimeline} />
//                 : <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No timeline events yet.</p>
//               }
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }









































import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AgentSidebar from '../../components/AgentSidebar';
import { Topbar, StatusBadge, StatusTimeline, Loading } from '../../components/index';
import { getMerchant } from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_STEPS = [
  'draft','submitted','under_review','approved'
];

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: '38%', maxWidth: 110, flexShrink: 0, paddingTop: 2, lineHeight: 1.4 }}>{label}</span>
    <span style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 500, wordBreak: 'break-word', flex: 1 }}>{value || '—'}</span>
  </div>
);

export default function MerchantView() {
  const { id } = useParams();
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    getMerchant(id)
      .then(res => setMerchant(res.data.data))
      .catch(() => toast.error('Failed to load merchant'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="layout">
      <AgentSidebar />
      <div className="main-content">
        <Topbar title="Merchant Details" />
        <div className="page-content"><Loading /></div>
      </div>
    </div>
  );

  if (!merchant) return (
    <div className="layout">
      <AgentSidebar />
      <div className="main-content">
        <Topbar title="Merchant Details" />
        <div className="page-content">
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏪</div>
            <h3>Merchant not found</h3>
            <Link to="/agent/merchants" className="btn btn-primary" style={{ marginTop: 16 }}>← Back</Link>
          </div>
        </div>
      </div>
    </div>
  );

  const currentStep = STATUS_STEPS.indexOf(merchant.status);

  return (
    <div className="layout">
      <AgentSidebar />
      <div className="main-content">
        <Topbar title="Merchant Details" />
        <div className="page-content">

          {/* Back + Header */}
          <div style={{ marginBottom: 20 }}>
            <Link to="/agent/merchants" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
              ← Back to My Merchants
            </Link>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{merchant.merchantName}</h2>
                <p style={{ color: 'var(--text-muted)', margin: '2px 0 0', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{merchant.shopName} · {merchant.businessCategory}</p>
              </div>
              <StatusBadge status={merchant.status} />
            </div>
          </div>

          {/* Rejection notice */}
          {merchant.status === 'rejected' && merchant.rejectionReason && (
            <div style={{ padding: '12px 16px', background: '#fff5f5', border: '1px solid #fecdd3', borderRadius: 'var(--radius-sm)', marginBottom: 20, color: '#be123c', fontSize: '0.875rem' }}>
              <strong>❌ Rejection reason:</strong> {merchant.rejectionReason}
            </div>
          )}

          {/* Progress steps */}
          {merchant.status !== 'rejected' && (
            <div className="card" style={{ marginBottom: 20, padding: '16px 18px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>
                Workflow Progress
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 6, WebkitOverflowScrolling: 'touch' }}>
                {STATUS_STEPS.map((s, i) => {
                  const done = i < currentStep;
                  const current = i === currentStep;
                  const label = s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                  return (
                    <React.Fragment key={s}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 56, flexShrink: 0 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                          background: done ? 'var(--success)' : current ? 'var(--accent)' : 'var(--border)',
                          color: done || current ? '#fff' : 'var(--text-muted)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', fontWeight: 700
                        }}>
                          {done ? '✓' : i + 1}
                        </div>
                        <div style={{
                          fontSize: '0.55rem', textAlign: 'center', marginTop: 5,
                          color: current ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text-muted)',
                          fontWeight: current ? 700 : 400, lineHeight: 1.3,
                          width: 54, wordBreak: 'break-word', hyphens: 'auto'
                        }}>
                          {label}
                        </div>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div style={{
                          width: 12, height: 2, flexShrink: 0, marginTop: 13,
                          background: done ? 'var(--success)' : 'var(--border)'
                        }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: 20 }}>
            {[
              { id: 'info',      label: '📋 Info' },
              { id: 'documents', label: '📁 Documents' },
              { id: 'timeline',  label: '🕐 Timeline' },
            ].map(t => (
              <button
                key={t.id}
                className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >{t.label}</button>
            ))}
          </div>

          {/* Info */}
          {activeTab === 'info' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16 }}>
              <div className="card">
                <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 4, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Personal</h3>
                <InfoRow label="Full Name"   value={merchant.merchantName} />
                <InfoRow label="Mobile"      value={merchant.mobile} />
                <InfoRow label="Email"       value={merchant.email} />
                <InfoRow label="Aadhaar"     value={merchant.aadhaarNumber ? `XXXX-XXXX-${merchant.aadhaarNumber.slice(-4)}` : null} />
                <InfoRow label="PAN"         value={merchant.panNumber} />
              </div>
              <div className="card">
                <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 4, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business</h3>
                <InfoRow label="Shop Name"   value={merchant.shopName} />
                <InfoRow label="Category"    value={merchant.businessCategory} />
                <InfoRow label="Address"     value={merchant.address} />
                <InfoRow label="City"        value={merchant.city} />
                <InfoRow label="State"       value={merchant.state} />
                <InfoRow label="Pincode"     value={merchant.pincode} />
              </div>
              {merchant.transactionVerified && (
                <div className="card">
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 4, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transaction</h3>
                  <InfoRow label="First Txn Date"  value={merchant.firstTransactionDate ? new Date(merchant.firstTransactionDate).toLocaleDateString('en-IN') : null} />
                  <InfoRow label="Txn Count"       value={merchant.transactionCount} />
                  <InfoRow label="Verified"        value="✅ Yes" />
                </div>
              )}
            </div>
          )}

          {/* Documents */}
          {activeTab === 'documents' && (
            <div className="card">
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 16, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Uploaded Documents</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 12 }}>
                {[
                  { key: 'aadhaarFront',   label: 'Aadhaar Front' },
                  { key: 'aadhaarBack',    label: 'Aadhaar Back' },
                  { key: 'panFront',       label: 'PAN Front' },
                  { key: 'panBack',        label: 'PAN Back' },
                  { key: 'utilityBill',    label: 'Utility Bill' },
                  { key: 'bankDocument',   label: 'Bank Doc' },
                  { key: 'gstOrAgreement', label: 'GST / Agreement' },
                  { key: 'shopPhoto',      label: 'Shop Photo' },
                  { key: 'shopBoardPhoto', label: 'Shop Board' },
                ].map(({ key, label }) => {
                  const uploaded = merchant.documents?.[key]?.uploadedAt;
                  return (
                    <div key={key} style={{
                      padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center',
                      border: `1px solid ${uploaded ? '#bbf7d0' : 'var(--border)'}`,
                      background: uploaded ? '#f0fdf4' : '#fafafa'
                    }}>
                      <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{uploaded ? '✅' : '📄'}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>{label}</div>
                      <div style={{ fontSize: '0.67rem', color: uploaded ? 'var(--success)' : 'var(--text-muted)', marginTop: 3 }}>
                        {uploaded ? new Date(uploaded).toLocaleDateString('en-IN') : 'Not uploaded'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 14 }}>
                🔒 Document previews are restricted to administrators.
              </p>
            </div>
          )}

          {/* Timeline */}
          {activeTab === 'timeline' && (
            <div className="card">
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 16, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status Timeline</h3>
              {merchant.statusTimeline?.length > 0
                ? <StatusTimeline timeline={merchant.statusTimeline} />
                : <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No timeline events yet.</p>
              }
            </div>
          )}

        </div>
      </div>
    </div>
  );
}