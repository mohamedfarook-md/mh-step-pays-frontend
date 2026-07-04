// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { logoutAPI } from '../services/api';
// import toast from 'react-hot-toast';

// const navItems = [
//   { to: '/agent/dashboard', label: 'Dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
//   { to: '/agent/add-merchant', label: 'Add Merchant', icon: 'M12 5v14M5 12h14' },
//   { to: '/agent/merchants', label: 'My Merchants', icon: 'M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z M3 9l9 6 9-6' },
//   { to: '/agent/notifications', label: 'Notifications', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0' },
//   { to: '/agent/profile', label: 'Profile', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
// ];

// export default function AgentSidebar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try { await logoutAPI(); } catch {}
//     logout();
//     navigate('/login');
//     toast.success('Logged out');
//   };

//   return (
//     <aside className="sidebar">
//       <div className="sidebar-logo">
//         <h1>MH Step Pays</h1>
//         <span>Field Agent</span>
//       </div>
//       <nav className="sidebar-nav">
//         {navItems.map(item => (
//           <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
//               <path d={item.icon} />
//             </svg>
//             {item.label}
//           </NavLink>
//         ))}
//       </nav>
//       <div className="sidebar-footer">
//         <div style={{ padding: '8px 14px', marginBottom: 8 }}>
//           <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Agent</div>
//           <div style={{ fontSize: '0.875rem', color: 'white', fontWeight: 600 }}>{user?.name}</div>
//         </div>
//         <button className="nav-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,100,100,0.8)' }} onClick={handleLogout}>
//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// }



import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutAPI } from '../services/api';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/agent/dashboard', label: 'Dashboard',     icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { to: '/agent/add-merchant', label: 'Add Merchant', icon: 'M12 5v14M5 12h14' },
  { to: '/agent/merchants', label: 'My Merchants',  icon: 'M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z M3 9l9 6 9-6' },
  { to: '/agent/invoices', label: 'Invoices', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6' },
  { to: '/agent/notifications', label: 'Notifications', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0' },
  { to: '/agent/profile', label: 'My Profile',     icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
];

export default function AgentSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Prevent body scroll when open on mobile
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleLogout = async () => {
    try { await logoutAPI(); } catch {}
    logout();
    navigate('/login');
    toast.success('Logged out');
  };

  // Current page title for mobile topbar
  const currentItem = navItems.find(n => location.pathname.startsWith(n.to));
  const pageTitle = currentItem?.label || 'Field Agent';

  return (
    <>
      {/* ── Mobile top-bar ── */}
      <div className="mobile-topbar">
        <div>
          <div className="mobile-topbar-title">MH Step Pays</div>
          <div className="mobile-topbar-sub">{pageTitle}</div>
        </div>
        <button
          className={`hamburger-btn${open ? ' open' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Overlay ── */}
      <div
        className={`sidebar-overlay${open ? ' visible' : ''}`}
        onClick={() => setOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <h1>MH Step Pays</h1>
          <span>Field Agent</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d={item.icon} />
              </svg>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ padding: '8px 14px', marginBottom: 8 }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>Logged in as</div>
            <div style={{ fontSize: '0.875rem', color: 'white', fontWeight: 600 }}>{user?.name || user?.fullName}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{user?.email}</div>
          </div>
          <button
            className="nav-item"
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,100,100,0.85)' }}
            onClick={handleLogout}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}