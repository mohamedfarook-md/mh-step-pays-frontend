import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AgentSidebar from '../../components/AgentSidebar';
import { Topbar, Loading } from '../../components/index';
import { getNotifications, markNotificationRead, markAllRead } from '../../services/api';
import toast from 'react-hot-toast';

const NOTIFICATION_ICONS = {
  merchant_approved: '✅',
  merchant_rejected: '❌',
  qr_uploaded: '📱',
  qr_deployed: '🚀',
  merchant_activated: '🎉',
  commission_eligible: '💰',
  agent_registered: '👤',
  new_merchant_submission: '📋',
  pending_verification: '🔍',
  commission_ready: '💸',
  default: '🔔',
};

const NOTIFICATION_COLORS = {
  merchant_approved: '#dcfce7',
  merchant_rejected: '#fee2e2',
  qr_uploaded: '#eff6ff',
  qr_deployed: '#f0fdf4',
  merchant_activated: '#fef3c7',
  commission_eligible: '#fef3c7',
  agent_registered: '#eff6ff',
  new_merchant_submission: '#f5f3ff',
  pending_verification: '#fff7ed',
  commission_ready: '#fef3c7',
  default: '#f8fafc',
};

const NotificationsPage = () => {
  const { isAdmin } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      setNotifications(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const filtered = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const Sidebar = isAdmin ? AdminSidebar : AgentSidebar;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title="Notifications" />
        <div className="page-content">

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Notifications</h1>
              {unreadCount > 0 && (
                <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: '0.9rem' }}>
                  You have <strong>{unreadCount}</strong> unread notification{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '3px' }}>
                {['all', 'unread'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                      background: filter === f ? 'var(--bg-primary)' : 'transparent',
                      color: filter === f ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: filter === f ? 600 : 400, fontSize: '0.85rem',
                      boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                    {f === 'unread' && unreadCount > 0 && (
                      <span style={{
                        marginLeft: '6px', background: 'var(--accent)', color: '#fff',
                        borderRadius: '10px', padding: '1px 7px', fontSize: '0.72rem'
                      }}>{unreadCount}</span>
                    )}
                  </button>
                ))}
              </div>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          {loading ? (
            <Loading />
          ) : filtered.length === 0 ? (
            <div className="card">
              <div className="empty-state" style={{ padding: '3rem' }}>
                <span className="empty-icon">🔔</span>
                <h3>{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>
                  {filter === 'unread'
                    ? 'All caught up! Switch to "All" to see past notifications.'
                    : 'Notifications about merchant updates, approvals, and activity will appear here.'}
                </p>
                {filter === 'unread' && (
                  <button className="btn btn-outline" onClick={() => setFilter('all')} style={{ marginTop: '0.75rem' }}>
                    View all
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filtered.map(notification => {
                const icon = NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS.default;
                const bg = NOTIFICATION_COLORS[notification.type] || NOTIFICATION_COLORS.default;
                return (
                  <div
                    key={notification._id}
                    style={{
                      background: notification.read ? 'var(--bg-primary)' : bg,
                      border: `1px solid ${notification.read ? 'var(--border)' : 'transparent'}`,
                      borderRadius: '10px', padding: '1rem 1.25rem',
                      display: 'flex', alignItems: 'flex-start', gap: '1rem',
                      cursor: notification.read ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                      boxShadow: notification.read ? 'none' : '0 1px 4px rgba(0,0,0,0.06)'
                    }}
                    onClick={() => !notification.read && handleMarkRead(notification._id)}
                  >
                    {/* Unread dot */}
                    {!notification.read && (
                      <div style={{
                        position: 'absolute', top: '12px', right: '14px',
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: 'var(--accent)'
                      }} />
                    )}

                    {/* Icon */}
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: notification.read ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.3rem', flexShrink: 0
                    }}>
                      {icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: notification.read ? 400 : 600,
                        fontSize: '0.92rem', marginBottom: '2px',
                        color: 'var(--text-primary)'
                      }}>
                        {notification.title || notification.message}
                      </div>
                      {notification.title && notification.message && (
                        <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          {notification.message}
                        </div>
                      )}
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {timeAgo(notification.createdAt)}
                      </div>
                    </div>

                    {/* Mark read action */}
                    {!notification.read && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkRead(notification._id); }}
                        style={{
                          padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)',
                          background: '#fff', color: 'var(--text-muted)', fontSize: '0.75rem',
                          cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap'
                        }}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer count */}
          {filtered.length > 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '1.5rem' }}>
              Showing {filtered.length} notification{filtered.length !== 1 ? 's' : ''}
            </p>
          )}

        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;