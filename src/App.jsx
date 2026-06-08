import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Auth Pages
import AdminLogin from '../src/pages/auth/AdminLogin';
import AgentLogin from '../src/pages/auth/AgentLogin';
import AgentRegister from '../src/pages/auth/AgentRegister';

// Admin Pages
import AdminDashboard from '../src/pages/admin/AdminDashboard';
import AgentManagement from '../src/pages/admin/AgentManagement';
import MerchantManagement from '../src/pages/admin/MerchantManagement';
import MerchantDetail from '../src/pages/admin/MerchantDetail';
import QRManagement from '../src/pages/admin/QRManagement';
import AuditLogs from '../src/pages/admin/AuditLogs';
import Reports from '../src/pages/admin/Reports';

// Agent Pages
import AgentDashboard from '../src/pages/agent/AgentDashboard';
import AddMerchant from '../src/pages/agent/AddMerchant';
import MyMerchants from '../src/pages/agent/MyMerchants';
import MerchantView from '../src/pages/agent/MerchantView';
import AgentProfile from '../src/pages/agent/AgentProfile';

// Common
import NotificationsPage from '../src/pages/common/NotificationsPage';

// const ProtectedRoute = ({ children, role }) => {
//   const { user, loading } = useAuth();
//   if (loading) return <div className="loading"><div className="spinner" /></div>;
//   if (!user) return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
//   if (role && user.role !== role) return <Navigate to="/" replace />;
//   return children;
// };

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );

  if (!user)
    return (
      <Navigate
        to={role === 'admin' ? '/admin/login' : '/login'}
        replace
      />
    );

  if (role && user.role !== role) {

    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === 'agent') {
      return <Navigate to="/agent/dashboard" replace />;
    }

  }

  return children;
};

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/agent/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { borderRadius: '10px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem' } }} />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          {/* Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login" element={<AgentLogin />} />
          <Route path="/register" element={<AgentRegister />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        
          <Route path="/admin/agents" element={<ProtectedRoute role="admin"><AgentManagement /></ProtectedRoute>} />
          <Route path="/admin/merchants" element={<ProtectedRoute role="admin"><MerchantManagement /></ProtectedRoute>} />
          <Route path="/admin/merchants/:id" element={<ProtectedRoute role="admin"><MerchantDetail /></ProtectedRoute>} />
          <Route path="/admin/qr" element={<ProtectedRoute role="admin"><QRManagement /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute role="admin"><AuditLogs /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute role="admin"><Reports /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute role="admin"><NotificationsPage /></ProtectedRoute>} />

          {/* Agent Routes */}
          <Route path="/agent/dashboard" element={<ProtectedRoute role="agent"><AgentDashboard /></ProtectedRoute>} />
          <Route path="/agent/add-merchant" element={<ProtectedRoute role="agent"><AddMerchant /></ProtectedRoute>} />
          <Route path="/agent/merchants" element={<ProtectedRoute role="agent"><MyMerchants /></ProtectedRoute>} />
          <Route path="/agent/merchants/:id" element={<ProtectedRoute role="agent"><MerchantView /></ProtectedRoute>} />
          <Route path="/agent/profile" element={<ProtectedRoute role="agent"><AgentProfile /></ProtectedRoute>} />
          <Route path="/agent/notifications" element={<ProtectedRoute role="agent"><NotificationsPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;