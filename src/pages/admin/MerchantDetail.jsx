import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { Topbar, StatusBadge, Loading, StatusTimeline } from '../../components/index';
import { getMerchant, approveMerchant, rejectMerchant, uploadQRCode, deployQR, recordTransaction, activateMerchant, getMerchantDocuments, verifyDocuments } from '../../services/api';
import toast from 'react-hot-toast';

export default function MerchantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState(null);
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [modal, setModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [qrFile, setQrFile] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  const load = async () => {
    try {
      const [mRes] = await Promise.all([getMerchant(id)]);
      setMerchant(mRes.data.data);
      try { const dRes = await getMerchantDocuments(id); setDocs(dRes.data.data); } catch {}
    } catch { toast.error('Failed to load merchant'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const doAction = async (action, payload) => {
    setActionLoading(action);
    try {
      let res;
      if (action === 'approve') res = await approveMerchant(id);
      else if (action === 'reject') res = await rejectMerchant(id, { reason: rejectReason });
      else if (action === 'qr') {
        if (!qrFile) { toast.error('Select QR image'); return; }
        const fd = new FormData(); fd.append('qrImage', qrFile);
        res = await uploadQRCode(id, fd);
      }
      else if (action === 'deploy') res = await deployQR(id);
      else if (action === 'transaction') res = await recordTransaction(id);
      else if (action === 'activate') res = await activateMerchant(id);
      else if (action === 'verify_docs') res = await verifyDocuments(id, payload);
      toast.success('Action completed');
      setModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
    finally { setActionLoading(''); }
  };

  if (loading) return <div className="layout"><AdminSidebar /><div className="main-content"><Topbar title="Merchant Detail" /><div className="page-content"><Loading /></div></div></div>;
  if (!merchant) return null;

  const m = merchant;
  const validationDays = m.validationEndDate ? Math.max(0, Math.ceil((new Date(m.validationEndDate) - new Date()) / 86400000)) : null;

  const tabs = ['info', 'documents', 'timeline', 'qr'];

  const docKeys = { aadhaarFront: 'Aadhaar Front', aadhaarBack: 'Aadhaar Back', panFront: 'PAN Front', panBack: 'PAN Back', utilityBill: 'Utility Bill', bankDocument: 'Bank Document', gstOrAgreement: 'GST / Service Agreement', shopPhoto: 'Shop Photo', shopBoardPhoto: 'Shop Board Photo' };

  return (
    <div className="layout">
      <AdminSidebar />
      <div className="main-content">
        <Topbar title={m.merchantName} subtitle={`${m.shopName} · ${m.businessCategory}`} />
        <div className="page-content">
          {/* Header */}
          <div className="card mb-16" style={{ padding: '16px 24px' }}>
            <div className="flex-between flex-wrap" style={{ gap: 12 }}>
              <div className="flex gap-12" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <StatusBadge status={m.status} />
                {m.commissionEligible && <span className="badge" style={{ background: '#fce7f3', color: '#9d174d' }}>💰 Commission Eligible</span>}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Agent: <strong>{m.assignedAgent?.fullName}</strong></span>
              </div>
              <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
                {m.status === 'submitted' || m.status === 'under_review' ? <>
                  <button className="btn btn-success btn-sm" onClick={() => doAction('approve')} disabled={!!actionLoading}>✓ Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setModal('reject')} disabled={!!actionLoading}>✗ Reject</button>
                </> : null}
                {m.status === 'approved' && (
                  <div className="flex gap-8">
                    <input type="file" accept="image/*" id="qr-upload" style={{ display: 'none' }} onChange={e => setQrFile(e.target.files[0])} />
                    <label htmlFor="qr-upload" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>{qrFile ? `📎 ${qrFile.name.slice(0,15)}...` : '📱 Select QR'}</label>
                    {qrFile && <button className="btn btn-primary btn-sm" onClick={() => doAction('qr')} disabled={!!actionLoading}>Upload QR</button>}
                  </div>
                )}
                {m.status === 'qr_uploaded' && <button className="btn btn-primary btn-sm" onClick={() => doAction('deploy')} disabled={!!actionLoading}>Deploy QR</button>}
                {m.status === 'qr_deployed' && <button className="btn btn-success btn-sm" onClick={() => doAction('transaction')} disabled={!!actionLoading}>✓ Mark Transaction</button>}
                {m.status === 'transaction_verified' && (
                  <div className="flex gap-8 align-center" style={{ alignItems: 'center' }}>
                    {validationDays !== null && validationDays > 0 ? <span className="badge badge-warning">⏳ {validationDays} days remaining</span> : <button className="btn btn-success btn-sm" onClick={() => doAction('activate')} disabled={!!actionLoading}>🟢 Activate Merchant</button>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '2px solid var(--border)' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '8px 16px', border: 'none', background: 'none', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: activeTab === t ? 700 : 500, color: activeTab === t ? 'var(--accent)' : 'var(--text-muted)', borderBottom: activeTab === t ? '2px solid var(--accent)' : '2px solid transparent', marginBottom: -2, cursor: 'pointer', textTransform: 'capitalize' }}>
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>

          {activeTab === 'info' && (
            <div className="form-grid">
              {[
                ['Merchant Name', m.merchantName], ['Mobile', m.mobile], ['Email', m.email || '—'],
                ['Shop Name', m.shopName], ['Business Category', m.businessCategory],
                ['Activation Date', m.activationDate ? new Date(m.activationDate).toLocaleDateString() : '—'],
                ['Commission Eligible Date', m.commissionEligibleDate ? new Date(m.commissionEligibleDate).toLocaleDateString() : '—'],
                ['Transaction Count', m.transactionCount],
                ['First Transaction', m.firstTransactionDate ? new Date(m.firstTransactionDate).toLocaleDateString() : '—'],
              ].map(([label, val]) => (
                <div key={label} className="card" style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontWeight: 600 }}>{val}</div>
                </div>
              ))}
              <div className="card" style={{ padding: '14px 16px', gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Address</div>
                <div style={{ fontWeight: 600 }}>{m.address}</div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Merchant Documents</h3>
                {docs && <div className="flex gap-8">
                  <button className="btn btn-success btn-sm" onClick={() => doAction('verify_docs', { status: 'verified' })}>✓ Verify All</button>
                  <button className="btn btn-danger btn-sm" onClick={() => doAction('verify_docs', { status: 'rejected', notes: 'Documents rejected' })}>✗ Reject</button>
                </div>}
              </div>
              {!docs ? <p className="text-muted">No documents uploaded yet</p> : (
                <div className="doc-upload-grid">
                  {Object.entries(docKeys).map(([key, label]) => {
                    const doc = docs.documents?.[key];
                    return (
                      <div key={key} style={{ border: `1px solid ${doc ? 'var(--success)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', padding: 12, background: doc ? 'rgba(16,185,129,0.04)' : 'white' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
                        {doc ? (
                          <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>✓ Uploaded</div>
                            {docs.signedDocuments?.[key]?.signedUrl && (
                              <a href={docs.signedDocuments[key].signedUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm mt-8" style={{ fontSize: '0.75rem' }}>View</a>
                            )}
                          </div>
                        ) : <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Not uploaded</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="card">
              <div className="card-header"><h3 className="card-title">Status Timeline</h3></div>
              <StatusTimeline timeline={m.statusTimeline} />
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="card">
              <div className="card-header"><h3 className="card-title">QR Code Details</h3></div>
              {m.qrCode ? (
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  {m.qrCode.url && <img src={m.qrCode.url} alt="QR Code" style={{ width: 160, height: 160, border: '1px solid var(--border)', borderRadius: 8 }} />}
                  <div style={{ fontSize: '0.875rem', lineHeight: 2.2 }}>
                    <div><strong>Status:</strong> <StatusBadge status={m.qrCode.status} /></div>
                    <div><strong>Uploaded:</strong> {m.qrCode.uploadedAt ? new Date(m.qrCode.uploadedAt).toLocaleString() : '—'}</div>
                    <div><strong>Deployed:</strong> {m.qrCode.deployedAt ? new Date(m.qrCode.deployedAt).toLocaleString() : '—'}</div>
                    <div><strong>Activated:</strong> {m.qrCode.activatedAt ? new Date(m.qrCode.activatedAt).toLocaleString() : '—'}</div>
                  </div>
                </div>
              ) : <p className="text-muted">No QR code uploaded yet</p>}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {modal === 'reject' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header"><h3 style={{ fontSize: '1rem' }}>Reject Merchant</h3><button className="btn btn-ghost btn-icon btn-sm" onClick={() => setModal(null)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Rejection Reason <span className="required">*</span></label>
                <textarea className="form-control" rows={3} placeholder="Explain rejection reason..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => doAction('reject')} disabled={!!actionLoading || !rejectReason.trim()}>Reject Merchant</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}