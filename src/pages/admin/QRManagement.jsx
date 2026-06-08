// QRManagement.js
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Topbar, StatusBadge, Loading, EmptyState } from '../../components/index';
import { getAdminMerchants } from '../../services/api';
import toast from 'react-hot-toast';

export function QRManagement() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminMerchants({ status: 'qr_uploaded', limit: 50 })
      .then(r => setMerchants(r.data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="layout">
      <AdminSidebar />
      <div className="main-content">
        <Topbar title="QR Management" subtitle="Track QR code uploads and deployments" />
        <div className="page-content">
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              {loading ? <Loading /> : merchants.length === 0 ? <EmptyState message="No QR data found" /> : (
                <table>
                  <thead><tr><th>Merchant</th><th>Agent</th><th>Status</th><th>QR Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {merchants.map(m => (
                      <tr key={m._id}>
                        <td><strong>{m.merchantName}</strong><br /><span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.shopName}</span></td>
                        <td>{m.assignedAgent?.fullName}</td>
                        <td><StatusBadge status={m.status} /></td>
                        <td><StatusBadge status={m.qrCode?.status || 'pending'} /></td>
                        <td><a href={`/admin/merchants/${m._id}`} className="btn btn-outline btn-sm">Manage</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRManagement;