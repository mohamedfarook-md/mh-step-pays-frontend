// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import AdminSidebar from '../../components/AdminSidebar';
// import { Topbar, StatusBadge, Loading, StatusTimeline } from '../../components/index';
// import { getMerchant, approveMerchant, rejectMerchant, uploadQRCode, deployQR, recordTransaction, activateMerchant, getMerchantDocuments, verifyDocuments } from '../../services/api';
// import toast from 'react-hot-toast';

// export default function MerchantDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [merchant, setMerchant] = useState(null);
//   const [docs, setDocs] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState('');
//   const [modal, setModal] = useState(null);
//   const [rejectReason, setRejectReason] = useState('');
//   const [qrFile, setQrFile] = useState(null);
//   const [activeTab, setActiveTab] = useState('info');

//   const load = async () => {
//     try {
//       const [mRes] = await Promise.all([getMerchant(id)]);
//       setMerchant(mRes.data.data);
//       try { const dRes = await getMerchantDocuments(id); setDocs(dRes.data.data); } catch {}
//     } catch { toast.error('Failed to load merchant'); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, [id]);

//   const doAction = async (action, payload) => {
//     setActionLoading(action);
//     try {
//       let res;
//       if (action === 'approve') res = await approveMerchant(id);
//       else if (action === 'reject') res = await rejectMerchant(id, { reason: rejectReason });
//       else if (action === 'qr') {
//         if (!qrFile) { toast.error('Select QR image'); return; }
//         const fd = new FormData(); fd.append('qrImage', qrFile);
//         res = await uploadQRCode(id, fd);
//       }
//       else if (action === 'deploy') res = await deployQR(id);
//       else if (action === 'transaction') res = await recordTransaction(id);
//       else if (action === 'activate') res = await activateMerchant(id);
//       else if (action === 'verify_docs') res = await verifyDocuments(id, payload);
//       toast.success('Action completed');
//       setModal(null);
//       load();
//     } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
//     finally { setActionLoading(''); }
//   };

//   if (loading) return <div className="layout"><AdminSidebar /><div className="main-content"><Topbar title="Merchant Detail" /><div className="page-content"><Loading /></div></div></div>;
//   if (!merchant) return null;

//   const m = merchant;
//   const validationDays = m.validationEndDate ? Math.max(0, Math.ceil((new Date(m.validationEndDate) - new Date()) / 86400000)) : null;

//   const tabs = ['info', 'documents', 'timeline', 'qr'];

//   const docKeys = { aadhaarFront: 'Aadhaar Front', aadhaarBack: 'Aadhaar Back', panFront: 'PAN Front', panBack: 'PAN Back', utilityBill: 'Utility Bill', bankDocument: 'Bank Document', gstOrAgreement: 'GST / Service Agreement', shopPhoto: 'Shop Photo', shopBoardPhoto: 'Shop Board Photo' };

//   return (
//     <div className="layout">
//       <AdminSidebar />
//       <div className="main-content">
//         <Topbar title={m.merchantName} subtitle={`${m.shopName} · ${m.businessCategory}`} />
//         <div className="page-content">
//           {/* Header */}
//           <div className="card mb-16" style={{ padding: '16px 24px' }}>
//             <div className="flex-between flex-wrap" style={{ gap: 12 }}>
//               <div className="flex gap-12" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
//                 <StatusBadge status={m.status} />
//                 {m.commissionEligible && <span className="badge" style={{ background: '#fce7f3', color: '#9d174d' }}>💰 Commission Eligible</span>}
//                 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Agent: <strong>{m.assignedAgent?.fullName}</strong></span>
//               </div>
//               <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
//                 {m.status === 'submitted' || m.status === 'under_review' ? <>
//                   <button className="btn btn-success btn-sm" onClick={() => doAction('approve')} disabled={!!actionLoading}>✓ Approve</button>
//                   <button className="btn btn-danger btn-sm" onClick={() => setModal('reject')} disabled={!!actionLoading}>✗ Reject</button>
//                 </> : null}
//                 {m.status === 'approved' && (
//                   <div className="flex gap-8">
//                     <input type="file" accept="image/*" id="qr-upload" style={{ display: 'none' }} onChange={e => setQrFile(e.target.files[0])} />
//                     <label htmlFor="qr-upload" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>{qrFile ? `📎 ${qrFile.name.slice(0,15)}...` : '📱 Select QR'}</label>
//                     {qrFile && <button className="btn btn-primary btn-sm" onClick={() => doAction('qr')} disabled={!!actionLoading}>Upload QR</button>}
//                   </div>
//                 )}
//                 {m.status === 'qr_uploaded' && <button className="btn btn-primary btn-sm" onClick={() => doAction('deploy')} disabled={!!actionLoading}>Deploy QR</button>}
//                 {m.status === 'qr_deployed' && <button className="btn btn-success btn-sm" onClick={() => doAction('transaction')} disabled={!!actionLoading}>✓ Mark Transaction</button>}
//                 {m.status === 'transaction_verified' && (
//                   <div className="flex gap-8 align-center" style={{ alignItems: 'center' }}>
//                     {validationDays !== null && validationDays > 0 ? <span className="badge badge-warning">⏳ {validationDays} days remaining</span> : <button className="btn btn-success btn-sm" onClick={() => doAction('activate')} disabled={!!actionLoading}>🟢 Activate Merchant</button>}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '2px solid var(--border)' }}>
//             {tabs.map(t => (
//               <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '8px 16px', border: 'none', background: 'none', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: activeTab === t ? 700 : 500, color: activeTab === t ? 'var(--accent)' : 'var(--text-muted)', borderBottom: activeTab === t ? '2px solid var(--accent)' : '2px solid transparent', marginBottom: -2, cursor: 'pointer', textTransform: 'capitalize' }}>
//                 {t.replace('_', ' ')}
//               </button>
//             ))}
//           </div>

//           {activeTab === 'info' && (
//             <div className="form-grid">
//               {[
//                 ['Merchant Name', m.merchantName], ['Mobile', m.mobile], ['Email', m.email || '—'],
//                 ['Shop Name', m.shopName], ['Business Category', m.businessCategory],
//                 ['Activation Date', m.activationDate ? new Date(m.activationDate).toLocaleDateString() : '—'],
//                 ['Commission Eligible Date', m.commissionEligibleDate ? new Date(m.commissionEligibleDate).toLocaleDateString() : '—'],
//                 ['Transaction Count', m.transactionCount],
//                 ['First Transaction', m.firstTransactionDate ? new Date(m.firstTransactionDate).toLocaleDateString() : '—'],
//               ].map(([label, val]) => (
//                 <div key={label} className="card" style={{ padding: '14px 16px' }}>
//                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
//                   <div style={{ fontWeight: 600 }}>{val}</div>
//                 </div>
//               ))}
//               <div className="card" style={{ padding: '14px 16px', gridColumn: '1 / -1' }}>
//                 <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Address</div>
//                 <div style={{ fontWeight: 600 }}>{m.address}</div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'documents' && (
//             <div className="card">
//               <div className="card-header">
//                 <h3 className="card-title">Merchant Documents</h3>
//                 {docs && <div className="flex gap-8">
//                   <button className="btn btn-success btn-sm" onClick={() => doAction('verify_docs', { status: 'verified' })}>✓ Verify All</button>
//                   <button className="btn btn-danger btn-sm" onClick={() => doAction('verify_docs', { status: 'rejected', notes: 'Documents rejected' })}>✗ Reject</button>
//                 </div>}
//               </div>
//               {!docs ? <p className="text-muted">No documents uploaded yet</p> : (
//                 <div className="doc-upload-grid">
//                   {Object.entries(docKeys).map(([key, label]) => {
//                     const doc = docs.documents?.[key];
//                     return (
//                       <div key={key} style={{ border: `1px solid ${doc ? 'var(--success)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', padding: 12, background: doc ? 'rgba(16,185,129,0.04)' : 'white' }}>
//                         <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
//                         {doc ? (
//                           <div>
//                             <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>✓ Uploaded</div>
//                             {docs.signedDocuments?.[key]?.signedUrl && (
//                               <a href={docs.signedDocuments[key].signedUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm mt-8" style={{ fontSize: '0.75rem' }}>View</a>
//                             )}
//                           </div>
//                         ) : <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Not uploaded</div>}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === 'timeline' && (
//             <div className="card">
//               <div className="card-header"><h3 className="card-title">Status Timeline</h3></div>
//               <StatusTimeline timeline={m.statusTimeline} />
//             </div>
//           )}

//           {activeTab === 'qr' && (
//             <div className="card">
//               <div className="card-header"><h3 className="card-title">QR Code Details</h3></div>
//               {m.qrCode ? (
//                 <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
//                   {m.qrCode.url && <img src={m.qrCode.url} alt="QR Code" style={{ width: 160, height: 160, border: '1px solid var(--border)', borderRadius: 8 }} />}
//                   <div style={{ fontSize: '0.875rem', lineHeight: 2.2 }}>
//                     <div><strong>Status:</strong> <StatusBadge status={m.qrCode.status} /></div>
//                     <div><strong>Uploaded:</strong> {m.qrCode.uploadedAt ? new Date(m.qrCode.uploadedAt).toLocaleString() : '—'}</div>
//                     <div><strong>Deployed:</strong> {m.qrCode.deployedAt ? new Date(m.qrCode.deployedAt).toLocaleString() : '—'}</div>
//                     <div><strong>Activated:</strong> {m.qrCode.activatedAt ? new Date(m.qrCode.activatedAt).toLocaleString() : '—'}</div>
//                   </div>
//                 </div>
//               ) : <p className="text-muted">No QR code uploaded yet</p>}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Reject Modal */}
//       {modal === 'reject' && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <div className="modal-header"><h3 style={{ fontSize: '1rem' }}>Reject Merchant</h3><button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(null)}>✕</button></div>
//             <div className="modal-body">
//               <div className="form-group">
//                 <label className="form-label">Rejection Reason <span className="required">*</span></label>
//                 <textarea className="form-control" rows={3} placeholder="Explain rejection reason..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
//               <button className="btn btn-danger" onClick={() => doAction('reject')} disabled={!!actionLoading || !rejectReason.trim()}>Reject Merchant</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








































import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import AdminSidebar from "../../components/AdminSidebar";
import {
    Topbar,
    StatusBadge,
    Loading,
} from "../../components/index";

import { getAdminOnboarding } from "../../services/adminApi";
import toast from "react-hot-toast";


// ======================================================
// HELPERS
// ======================================================

const displayValue = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (value instanceof Date) {
        return value.toLocaleString();
    }

    return String(value);
};


const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleString();
};


const formatObject = (value) => {
    if (!value) return "—";

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
};


// ======================================================
// INFO SECTION
// ======================================================

const InfoSection = ({ title, children }) => {
    return (
        <div className="card" style={{ marginBottom: 16 }}>
            <div
                className="card-header"
                style={{
                    borderBottom: "1px solid var(--border)",
                }}
            >
                <h3 className="card-title">{title}</h3>
            </div>

            <div
                style={{
                    padding: 16,
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 14,
                }}
            >
                {children}
            </div>
        </div>
    );
};


// ======================================================
// INFO ITEM
// ======================================================

const InfoItem = ({ label, value }) => {
    return (
        <div
            style={{
                padding: "12px 14px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                background: "var(--card-bg, white)",
            }}
        >
            <div
                style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginBottom: 5,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontWeight: 600,
                    wordBreak: "break-word",
                }}
            >
                {displayValue(value)}
            </div>
        </div>
    );
};


// ======================================================
// PAGE
// ======================================================

export default function MerchantDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

const [merchant, setMerchant] = useState(null);
const [payuDocuments, setPayuDocuments] = useState(null);
const [loading, setLoading] = useState(true);

    // ==================================================
    // LOAD COMPLETE MERCHANT DETAILS
    // ==================================================

    const loadMerchant = async () => {
        try {
            setLoading(true);

            const response = await getAdminOnboarding(id);

            if (!response?.success || !response?.data) {
                throw new Error(
                    "Merchant details not available"
                );
            }

            setMerchant(response.data.merchant);
setPayuDocuments(response.data.payuDocuments);
        } catch (error) {
            console.error(
                "Merchant details error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Failed to load merchant details"
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (id) {
            loadMerchant();
        }
    }, [id]);


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {
        return (
            <div className="layout">
                <AdminSidebar />

                <div className="main-content">
                    <Topbar
                        title="Merchant Details"
                        subtitle="Complete merchant onboarding information"
                    />

                    <div className="page-content">
                        <Loading />
                    </div>
                </div>
            </div>
        );
    }


    // ==================================================
    // NOT FOUND
    // ==================================================

    if (!merchant) {
        return (
            <div className="layout">
                <AdminSidebar />

                <div className="main-content">
                    <Topbar
                        title="Merchant Details"
                        subtitle="Merchant information"
                    />

                    <div className="page-content">
                        <div className="card">
                            <div
                                style={{
                                    padding: 30,
                                    textAlign: "center",
                                }}
                            >
                                Merchant details not found.
                            </div>

                            <div
                                style={{
                                    padding: "0 30px 30px",
                                    textAlign: "center",
                                }}
                            >
                                <button
                                    className="btn btn-outline"
                                    onClick={() =>
                                        navigate(
                                            "/admin/merchants"
                                        )
                                    }
                                >
                                    ← Back to Merchants
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    const m = merchant;


    // ==================================================
    // RENDER
    // ==================================================

    return (
        <div className="layout">
            <AdminSidebar />

            <div className="main-content">

                {/* ======================================
                    TOPBAR
                ====================================== */}

                <Topbar
                    title={
                        m.merchantName ||
                        m.shopName ||
                        "Merchant Details"
                    }
                    subtitle="Complete merchant onboarding information"
                />


                <div className="page-content">

                    {/* ==================================
                        BACK BUTTON
                    ================================== */}

                    <div
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() =>
                                navigate(
                                    "/admin/merchants"
                                )
                            }
                        >
                            ← Back to Merchant Management
                        </button>
                    </div>


                    {/* ==================================
                        MERCHANT HEADER
                    ================================== */}

                    <div
                        className="card"
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        <div
                            style={{
                                padding: 20,
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",
                                gap: 16,
                                flexWrap: "wrap",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize:
                                            "1.25rem",
                                        fontWeight: 700,
                                        marginBottom: 6,
                                    }}
                                >
                                    {m.merchantName ||
                                        "Merchant"}
                                </div>

                                <div
                                    style={{
                                        color:
                                            "var(--text-muted)",
                                        marginBottom: 8,
                                    }}
                                >
                                    {m.shopName ||
                                        "—"}
                                </div>

                                <div
                                    style={{
                                        fontSize:
                                            "0.8rem",
                                        color:
                                            "var(--text-muted)",
                                    }}
                                >
                                    Merchant ID:{" "}
                                    {m._id || "—"}
                                </div>
                            </div>


                            <div
                                style={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: 10,
                                    flexWrap:
                                        "wrap",
                                }}
                            >
                                {m.status && (
                                    <StatusBadge
                                        status={
                                            m.status
                                        }
                                    />
                                )}

                                {m.payuStatus && (
                                    <span
                                        className="badge"
                                    >
                                        PayU:{" "}
                                        {
                                            m.payuStatus
                                        }
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* ==================================
                        PAYU DETAILS
                    ================================== */}

                    <InfoSection title="PayU Merchant Details">

                        <InfoItem
                            label="PayU Merchant ID"
                            value={
                                m.payuMerchantId
                            }
                        />

                        <InfoItem
                            label="PayU Merchant UUID"
                            value={
                                m.payuMerchantUUID
                            }
                        />

                        <InfoItem
                            label="PayU Product UUID"
                            value={
                                m.payuProductUUID
                            }
                        />

                        <InfoItem
                            label="PayU Status"
                            value={
                                m.payuStatus
                            }
                        />

                        <InfoItem
                            label="PayU Sync Date"
                            value={formatDate(
                                m.payuSyncAt
                            )}
                        />

                        <InfoItem
                            label="Submitted to PayU"
                            value={
                                m.submittedToPayU
                            }
                        />

                        <InfoItem
                            label="Submitted to PayU At"
                            value={formatDate(
                                m.submittedToPayUAt
                            )}
                        />

                    </InfoSection>


                    {/* ==================================
                        BASIC DETAILS
                    ================================== */}

                    <InfoSection title="Merchant Basic Details">

                        <InfoItem
                            label="Merchant Name"
                            value={
                                m.merchantName
                            }
                        />

                        <InfoItem
                            label="Mobile"
                            value={m.mobile}
                        />

                        <InfoItem
                            label="Email"
                            value={m.email}
                        />

                        <InfoItem
                            label="Shop Name"
                            value={m.shopName}
                        />

                        <InfoItem
                            label="Trade Name"
                            value={m.tradeName}
                        />

                        <InfoItem
                            label="Entity Type"
                            value={m.entityType}
                        />

                        <InfoItem
                            label="Merchant Type"
                            value={
                                m.merchantType
                            }
                        />

                        <InfoItem
                            label="Business Category"
                            value={
                                m.businessCategory
                            }
                        />

                        <InfoItem
                            label="Business Sub Category"
                            value={
                                m.businessSubCategory
                            }
                        />

                        <InfoItem
                            label="Application Status"
                            value={m.status}
                        />

                    </InfoSection>


                    {/* ==================================
                        PAN & DOB
                    ================================== */}

                    <InfoSection title="PAN & Date of Birth">

                        <InfoItem
                            label="PAN Number"
                            value={
                                m.panNumber
                            }
                        />

                        <InfoItem
                            label="PAN Name"
                            value={
                                m.panName
                            }
                        />

                        <InfoItem
                            label="Date of Birth"
                            value={
                                m.dob
                            }
                        />

                        <InfoItem
                            label="PAN Verified"
                            value={
                                m.panVerified
                            }
                        />

                    </InfoSection>


                    {/* ==================================
                        ADDRESS
                    ================================== */}

                    <InfoSection title="Address">

                        <InfoItem
                            label="Address"
                            value={m.address}
                        />

                        <InfoItem
                            label="Address Line 1"
                            value={
                                m.businessInformation
                                    ?.addressLine1
                            }
                        />

                        <InfoItem
                            label="Address Line 2"
                            value={
                                m.businessInformation
                                    ?.addressLine2
                            }
                        />

                        <InfoItem
                            label="City"
                            value={
                                m.businessInformation
                                    ?.city
                            }
                        />

                        <InfoItem
                            label="State"
                            value={
                                m.businessInformation
                                    ?.state
                            }
                        />

                        <InfoItem
                            label="Pincode"
                            value={
                                m.businessInformation
                                    ?.pincode
                            }
                        />

                    </InfoSection>


                    {/* ==================================
                        CKYC
                    ================================== */}

                    <InfoSection title="CKYC Details">

                        <InfoItem
                            label="CKYC Status"
                            value={
                                m.ckyc?.status
                            }
                        />

                        <InfoItem
                            label="CKYC Reference ID"
                            value={
                                m.ckyc
                                    ?.referenceId
                            }
                        />

                        <InfoItem
                            label="CKYC Transaction ID"
                            value={
                                m.ckyc
                                    ?.transactionId
                            }
                        />

                        <InfoItem
                            label="CKYC Verified At"
                            value={formatDate(
                                m.ckyc
                                    ?.verifiedAt
                            )}
                        />

                        <InfoItem
                            label="CKYC Verified"
                            value={
                                m.ckycVerified
                            }
                        />

                    </InfoSection>


                    {/* ==================================
                        BANK DETAILS
                    ================================== */}

                    <InfoSection title="Bank Details">

                        <InfoItem
                            label="Account Holder Name"
                            value={
                                m.bank
                                    ?.accountHolderName
                            }
                        />

                        <InfoItem
                            label="Account Number"
                            value={
                                m.bank
                                    ?.accountNumber
                            }
                        />

                        <InfoItem
                            label="IFSC"
                            value={
                                m.bank?.ifsc
                            }
                        />

                        <InfoItem
                            label="Bank Name"
                            value={
                                m.bank?.bankName
                            }
                        />

                        <InfoItem
                            label="Branch Name"
                            value={
                                m.bank?.branchName
                            }
                        />

                        <InfoItem
                            label="Bank Verification Status"
                            value={
                                m.bank
                                    ?.verificationStatus
                            }
                        />

                        <InfoItem
                            label="Bank Verified"
                            value={
                                m.bankVerified
                            }
                        />

                        <InfoItem
                            label="Bank Verified At"
                            value={formatDate(
                                m.bank
                                    ?.verifiedAt
                            )}
                        />

                    </InfoSection>


                    {/* ==================================
                        BUSINESS INFORMATION
                    ================================== */}

                    <InfoSection title="Business Information">

                        <InfoItem
                            label="Business Category"
                            value={
                                m.businessInformation
                                    ?.businessCategory
                            }
                        />

                        <InfoItem
                            label="Business Sub Category"
                            value={
                                m.businessInformation
                                    ?.businessSubCategory
                            }
                        />

                        <InfoItem
                            label="GSTIN"
                            value={
                                m.businessInformation
                                    ?.gstin
                            }
                        />

                        <InfoItem
                            label="CIN"
                            value={
                                m.businessInformation
                                    ?.cin
                            }
                        />

                        <InfoItem
                            label="LLPIN"
                            value={
                                m.businessInformation
                                    ?.llpin
                            }
                        />

                        <InfoItem
                            label="Expected Monthly Sales"
                            value={
                                m.businessInformation
                                    ?.expectedMonthlySales
                            }
                        />

                    </InfoSection>


                    {/* ==================================
                        WEBSITE
                    ================================== */}

                    <InfoSection title="Website / Integration">

                        <InfoItem
                            label="Website URL"
                            value={
                                m.website
                                    ?.websiteUrl
                            }
                        />

                        <InfoItem
                            label="Android URL"
                            value={
                                m.website
                                    ?.androidUrl
                            }
                        />

                        <InfoItem
                            label="iOS URL"
                            value={
                                m.website
                                    ?.iosUrl
                            }
                        />

                        <InfoItem
                            label="Website Skipped"
                            value={
                                m.website?.skipped
                            }
                        />

                    </InfoSection>


                    {/* ==================================
                        SIGNING AUTHORITY
                    ================================== */}

                    <InfoSection title="Signing Authority">

                        <InfoItem
                            label="Name"
                            value={
                                m.authorizedSignatory
                                    ?.name
                            }
                        />

                        <InfoItem
                            label="Email"
                            value={
                                m.authorizedSignatory
                                    ?.email
                            }
                        />

                        <InfoItem
                            label="PAN Number"
                            value={
                                m.authorizedSignatory
                                    ?.panNumber
                            }
                        />

                        <InfoItem
                            label="Contact Detail Type"
                            value={
                                m.authorizedSignatory
                                    ?.contactDetailType
                            }
                        />

                        <InfoItem
                            label="Authorised Signatory"
                            value={
                                m.authorizedSignatory
                                    ?.authorisedSignatory
                            }
                        />

                        <InfoItem
                            label="PAN Verified"
                            value={
                                m.authorizedSignatory
                                    ?.panVerified
                            }
                        />

                        <InfoItem
                            label="DigiLocker Verified"
                            value={
                                m.authorizedSignatory
                                    ?.digilockerVerified
                            }
                        />

                        <InfoItem
                            label="Aadhaar Verified"
                            value={
                                m.authorizedSignatory
                                    ?.aadhaarVerified
                            }
                        />

                    </InfoSection>


                    {/* ==================================
                        DIGILOCKER
                    ================================== */}

                    <InfoSection title="DigiLocker">

                        <InfoItem
                            label="Status"
                            value={
                                m.digilocker
                                    ?.status
                            }
                        />

                        <InfoItem
                            label="Capture Link"
                            value={
                                m.digilocker
                                    ?.captureLink
                            }
                        />

                        <InfoItem
                            label="Generated At"
                            value={formatDate(
                                m.digilocker
                                    ?.generatedAt
                            )}
                        />

                        <InfoItem
                            label="Verified At"
                            value={formatDate(
                                m.digilocker
                                    ?.verifiedAt
                            )}
                        />

                    </InfoSection>


                    {/* ==================================
                        UBO
                    ================================== */}

                    <InfoSection title="UBO & Business Members">

                        <InfoItem
                            label="UBO Required"
                            value={
                                m.ubo?.required
                            }
                        />

                        <InfoItem
                            label="UBO Submitted"
                            value={
                                m.ubo?.submitted
                            }
                        />

                        <InfoItem
                            label="Submitted At"
                            value={formatDate(
                                m.ubo
                                    ?.submittedAt
                            )}
                        />

                        <InfoItem
                            label="Beneficiaries"
                            value={
                                m.ubo
                                    ?.beneficiaries
                                    ? JSON.stringify(
                                          m.ubo
                                              .beneficiaries
                                      )
                                    : "—"
                            }
                        />

                    </InfoSection>


                    {/* ==================================
                        DOCUMENT STATUS
                    ================================== */}

                   {/* ==================================
    PAYU DOCUMENTS
================================== */}

<InfoSection title="Documents">

    <InfoItem
        label="Documents Verified"
        value={m.documentVerified}
    />

    {payuDocuments?.document_categories?.length > 0 ? (
        <div
            style={{
                gridColumn: "1 / -1",
                display: "flex",
                flexDirection: "column",
                gap: 12,
            }}
        >
            {payuDocuments.document_categories.map(
                (category, index) => {

                    const document = category.kyc_document;

                    return (
                        <div
                            key={
                                category.id ||
                                category.name ||
                                index
                            }
                            style={{
                                padding: 14,
                                border: "1px solid var(--border)",
                                borderRadius:
                                    "var(--radius-sm)",
                                background:
                                    "var(--card-bg, white)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                    gap: 12,
                                    flexWrap: "wrap",
                                    marginBottom: 8,
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 700,
                                    }}
                                >
                                    {displayValue(
                                        category.name
                                    )}
                                </div>

                                <span className="badge">
                                    {displayValue(
                                        category.kyc_document_status
                                    )}
                                </span>
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap: 10,
                                }}
                            >
                                <InfoItem
                                    label="Frontend Name"
                                    value={
                                        category.name_on_frontend
                                    }
                                />

                                <InfoItem
                                    label="Required"
                                    value={
                                        category.kyc_document_status ===
                                        "required"
                                    }
                                />

                                <InfoItem
                                    label="Uploaded"
                                    value={
                                        document?.status ===
                                        "DOCUMENT_SUBMITTED"
                                    }
                                />

                                <InfoItem
                                    label="Document Status"
                                    value={
                                        document?.status
                                    }
                                />

                                <InfoItem
                                    label="Document ID"
                                    value={
                                        document?.id
                                    }
                                />

                                <InfoItem
                                    label="Document Type"
                                    value={
                                        document?.document_type
                                    }
                                />
                            </div>

                            {Array.isArray(
                                category.document_types
                            ) &&
                                category.document_types.length >
                                    0 && (
                                    <div
                                        style={{
                                            marginTop: 12,
                                            fontSize:
                                                "0.85rem",
                                            color:
                                                "var(--text-muted)",
                                        }}
                                    >
                                        <strong>
                                            Available Document Types:
                                        </strong>{" "}
                                        {category.document_types
                                            .map(
                                                (type) =>
                                                    type.name ||
                                                    type.document_type_name ||
                                                    type.documentTypeName
                                            )
                                            .filter(Boolean)
                                            .join(", ") || "—"}
                                    </div>
                                )}
                        </div>
                    );
                }
            )}
        </div>
    ) : (
        <InfoItem
            label="PayU Documents"
            value="No document information available"
        />
    )}

</InfoSection>



{/* ==================================
    SHOP VERIFICATION
================================== */}

<InfoSection title="Shop Verification">

    <InfoItem
        label="Verification Status"
        value={m.shopVerification?.status}
    />

    <InfoItem
        label="Latitude"
        value={m.shopVerification?.latitude}
    />

    <InfoItem
        label="Longitude"
        value={m.shopVerification?.longitude}
    />

    <InfoItem
        label="Verified At"
        value={formatDate(
            m.shopVerification?.verifiedAt
        )}
    />

    {Array.isArray(m.shopVerification?.photos) &&
        m.shopVerification.photos.length > 0 && (
            <div
                style={{
                    gridColumn: "1 / -1",
                    marginTop: 4,
                }}
            >
                <div
                    style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginBottom: 10,
                    }}
                >
                    Shop Verification Photos
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 12,
                    }}
                >
                    {m.shopVerification.photos.map(
                        (photo, index) => (
                            <div
                                key={
                                    photo._id ||
                                    index
                                }
                                style={{
                                    padding: 12,
                                    border:
                                        "1px solid var(--border)",
                                    borderRadius:
                                        "var(--radius-sm)",
                                }}
                            >
                                <InfoItem
                                    label="File Name"
                                    value={
                                        photo.fileName
                                    }
                                />

                                <div
                                    style={{
                                        marginTop: 10,
                                        fontSize:
                                            "0.8rem",
                                        color:
                                            "var(--text-muted)",
                                        wordBreak:
                                            "break-word",
                                    }}
                                >
                                    Path:{" "}
                                    {displayValue(
                                        photo.path
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        )}

</InfoSection>


                    {/* ==================================
                        VKYC
                    ================================== */}

                    <InfoSection title="Video KYC">

                        <InfoItem
                            label="VKYC Status"
                            value={
                                m.vkyc?.status
                            }
                        />

                        <InfoItem
                            label="VKYC Capture Link"
                            value={
                                m.vkyc
                                    ?.captureLink
                            }
                        />

                        <InfoItem
                            label="Profile Created At"
                            value={formatDate(
                                m.vkyc
                                    ?.profileCreatedAt
                            )}
                        />

                        <InfoItem
                            label="Completed At"
                            value={formatDate(
                                m.vkyc
                                    ?.completedAt
                            )}
                        />

                    </InfoSection>


                    {/* ==================================
                        AGENT DETAILS
                    ================================== */}

                    <InfoSection title="Assigned Agent">

                        <InfoItem
                            label="Agent Name"
                            value={
                                m.assignedAgent
                                    ?.fullName
                            }
                        />

                        <InfoItem
                            label="Agent Email"
                            value={
                                m.assignedAgent
                                    ?.email
                            }
                        />

                        <InfoItem
                            label="Agent Mobile"
                            value={
                                m.assignedAgent
                                    ?.mobile
                            }
                        />

                    </InfoSection>


                    {/* ==================================
                        ONBOARDING STATUS
                    ================================== */}

                    <InfoSection title="Onboarding Status">

                      <InfoItem
    label="Onboarding Step"
    value={
        m.onboardingStep
            ? `${m.onboardingStep} - ${
                  {
                      1: "Create Merchant",
                      2: "PAN & DOB",
                      3: "CKYC",
                      4: "Bank Details",
                      5: "Business Details",
                      6: "Website / Integration",
                      7: "Signing Authority",
                      8: "DigiLocker",
                      9: "UBO & Business Members",
                      10: "Documents",
                      11: "Video KYC",
                      12: "Agreement",
                  }[m.onboardingStep] || "Unknown Step"
              }`
            : "—"
    }
/>

                        <InfoItem
                            label="Current Section"
                            value={
                                m.currentSection
                            }
                        />

                        <InfoItem
                            label="Basic Details Completed"
                            value={
                                m.basicDetailsCompleted
                            }
                        />

                        <InfoItem
                            label="Submitted To Admin"
                            value={
                                m.submittedToAdmin
                            }
                        />

                        <InfoItem
                            label="Submitted To Admin At"
                            value={formatDate(
                                m.submittedToAdminAt
                            )}
                        />

                        <InfoItem
                            label="Agreement Accepted"
                            value={
                                m.agreementAccepted
                            }
                        />

                    </InfoSection>


                    {/* ==================================
                        QR DETAILS
                    ================================== */}

                    {m.qrCode && (
                        <InfoSection title="QR Code">

                            <InfoItem
                                label="QR Status"
                                value={
                                    m.qrCode
                                        ?.status
                                }
                            />

                            <InfoItem
                                label="QR URL"
                                value={
                                    m.qrCode?.url
                                }
                            />

                            <InfoItem
                                label="Uploaded At"
                                value={formatDate(
                                    m.qrCode
                                        ?.uploadedAt
                                )}
                            />

                            <InfoItem
                                label="Deployed At"
                                value={formatDate(
                                    m.qrCode
                                        ?.deployedAt
                                )}
                            />

                            <InfoItem
                                label="Activated At"
                                value={formatDate(
                                    m.qrCode
                                        ?.activatedAt
                                )}
                            />

                        </InfoSection>
                    )}


                    {/* ==================================
                        TIMELINE
                    ================================== */}

                    {Array.isArray(
                        m.statusTimeline
                    ) &&
                        m.statusTimeline.length >
                            0 && (
                            <div
                                className="card"
                                style={{
                                    marginBottom: 16,
                                }}
                            >
                                <div className="card-header">
                                    <h3 className="card-title">
                                        Status Timeline
                                    </h3>
                                </div>

                                <div
                                    style={{
                                        padding: 16,
                                    }}
                                >
                                    {m.statusTimeline.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                style={{
                                                    padding:
                                                        "12px 0",
                                                    borderBottom:
                                                        index <
                                                        m
                                                            .statusTimeline
                                                            .length -
                                                            1
                                                            ? "1px solid var(--border)"
                                                            : "none",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        gap: 12,
                                                        flexWrap:
                                                            "wrap",
                                                    }}
                                                >
                                                    <strong>
                                                        {displayValue(
                                                            item.status
                                                        )}
                                                    </strong>

                                                    <span
                                                        style={{
                                                            fontSize:
                                                                "0.8rem",
                                                            color:
                                                                "var(--text-muted)",
                                                        }}
                                                    >
                                                        {formatDate(
                                                            item.createdAt ||
                                                                item.date
                                                        )}
                                                    </span>
                                                </div>

                                                {item.note && (
                                                    <div
                                                        style={{
                                                            marginTop: 5,
                                                            color:
                                                                "var(--text-muted)",
                                                            fontSize:
                                                                "0.85rem",
                                                        }}
                                                    >
                                                        {
                                                            item.note
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}


                    {/* ==================================
                        CREATED / UPDATED
                    ================================== */}

                    <InfoSection title="System Information">

                        <InfoItem
                            label="Created At"
                            value={formatDate(
                                m.createdAt
                            )}
                        />

                        <InfoItem
                            label="Updated At"
                            value={formatDate(
                                m.updatedAt
                            )}
                        />

                        <InfoItem
                            label="Merchant Database ID"
                            value={m._id}
                        />

                    </InfoSection>

                </div>
            </div>
        </div>
    );
}