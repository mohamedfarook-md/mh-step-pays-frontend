import React from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Topbar ────────────────────────────────────────────────────────────────
export function Topbar({ title, subtitle }) {
  return (
    <div className="topbar">
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  return <span className={`badge badge-${status?.replace(' ', '_')}`}>{status?.replace('_', ' ')}</span>;
}

// ─── Pagination ────────────────────────────────────────────────────────────
export function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  return (
    <div className="pagination">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>← Prev</button>
      {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
        <button key={p} className={page === p ? 'active' : ''} onClick={() => onPageChange(p)}>{p}</button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page === pages}>Next →</button>
    </div>
  );
}

// ─── Confirmation Modal ────────────────────────────────────────────────────
export function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = 'Confirm', confirmClass = 'btn-danger', loading }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3 style={{ fontSize: '1rem' }}>{title}</h3>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onCancel}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className={`btn ${confirmClass}`} onClick={onConfirm} disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Working...</> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Loading ───────────────────────────────────────────────────────────────
export function Loading({ text = 'Loading...' }) {
  return <div className="loading"><div className="spinner" /> {text}</div>;
}

// ─── Empty State ───────────────────────────────────────────────────────────
export function EmptyState({ message = 'No data found', icon }) {
  return (
    <div className="empty-state">
      {icon || <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8" /></svg>}
      <p>{message}</p>
    </div>
  );
}

// ─── Status Timeline ───────────────────────────────────────────────────────
export function StatusTimeline({ timeline }) {
  if (!timeline?.length) return null;
  return (
    <div className="timeline">
      {[...timeline].reverse().map((item, i) => (
        <div key={i} className="timeline-item">
          <div className="timeline-status">{item.status?.replace('_', ' ')}</div>
          <div className="timeline-time">{new Date(item.timestamp).toLocaleString()}</div>
          {item.note && <div className="timeline-note">{item.note}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────
export function FormInput({ label, required, error, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}{required && <span className="required">*</span>}</label>}
      <input className={`form-control${error ? ' error' : ''}`} {...props} />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export function FormSelect({ label, required, error, children, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}{required && <span className="required">*</span>}</label>}
      <select className={`form-control${error ? ' error' : ''}`} {...props}>{children}</select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}