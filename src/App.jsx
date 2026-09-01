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
import InvoiceManagement from './pages/admin/InvoiceManagement';
import Soundboxes from './pages/admin/Soundboxes';
import PendingApplications from './pages/admin/merchant-review/PendingApplications';
import MerchantReview from './pages/admin/merchant-review/MerchantReview';
import MerchantKYC from './pages/admin/merchant-review/MerchantKYC';
import MerchantDocuments from './pages/admin/merchant-review/MerchantDocuments';

// Agent Pages
import AgentDashboard from '../src/pages/agent/AgentDashboard';
import AddMerchant from '../src/pages/agent/AddMerchant';
import MyMerchants from '../src/pages/agent/MyMerchants';
import MerchantView from '../src/pages/agent/MerchantView';
import AgentProfile from '../src/pages/agent/AgentProfile';
import Invoices from '../src/pages/agent/Invoices';
import CreateMerchant from '../src/pages/agent/onboarding/steps/CreateMerchant';
import PanDob from '../src/pages/agent/onboarding/steps/PanDob';
import CKYC from '../src/pages/agent/onboarding/steps/CKYC';
import BankDetails from '../src/pages/agent/onboarding/steps/BankDetails';
import BusinessDetails from '../src/pages/agent/onboarding/steps/BusinessDetails';
import WebsiteDetails from '../src/pages/agent/onboarding/steps/WebsiteDetails';
import SigningAuthority from '../src/pages/agent/onboarding/steps/SigningAuthority';
import DigiLocker from '../src/pages/agent/onboarding/steps/DigiLocker';
import UBODetails from '../src/pages/agent/onboarding/steps/UBODetails';
import Documents from '../src/pages/agent/onboarding/steps/Documents';
import ShopVerification from '../src/pages/agent/onboarding/steps/ShopVerification';
import VKYC from '../src/pages/agent/onboarding/steps/VKYC';
import Agreement from "../src/pages/agent/onboarding/steps/Agreement";
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
          <Route
  path="/admin/invoices"
  element={
    <ProtectedRoute role="admin">
      <InvoiceManagement />
    </ProtectedRoute>
  }
/>

        <Route
  path="/admin/soundboxes"
  element={
    <ProtectedRoute role="admin">
      <Soundboxes />
    </ProtectedRoute>
  }
/>



          {/* Agent Routes */}
          <Route path="/agent/dashboard" element={<ProtectedRoute role="agent"><AgentDashboard /></ProtectedRoute>} />
          <Route path="/agent/add-merchant" element={<ProtectedRoute role="agent"><AddMerchant /></ProtectedRoute>} />
          <Route
  path="/agent/create-merchant"
  element={
    <ProtectedRoute role="agent">
      <CreateMerchant />
    </ProtectedRoute>
  }
/>
<Route
  path="/agent/merchant/:id/pan"
  element={
    <ProtectedRoute role="agent">
      <PanDob />
    </ProtectedRoute>
  }
/>
<Route
  path="/agent/merchant/:id/ckyc"
  element={
    <ProtectedRoute role="agent">
      <CKYC />
    </ProtectedRoute>
  }
/>
<Route
  path="/agent/merchant/:id/bank"
  element={
    <ProtectedRoute role="agent">
      <BankDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/agent/merchant/:id/business"
  element={
    <ProtectedRoute role="agent">
      <BusinessDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/agent/merchant/:id/website"
  element={
    <ProtectedRoute role="agent">
      <WebsiteDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/agent/merchant/:id/signing-authority"
  element={
    <ProtectedRoute role="agent">
      <SigningAuthority />
    </ProtectedRoute>
  }
/>
<Route
  path="/agent/merchant/:id/digilocker"
  element={
    <ProtectedRoute role="agent">
      <DigiLocker />
    </ProtectedRoute>
  }
/>
<Route
  path="/agent/merchant/:id/ubo"
  element={
    <ProtectedRoute role="agent">
      <UBODetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/agent/merchant/:id/documents"
  element={
    <ProtectedRoute role="agent">
      <Documents />
    </ProtectedRoute>
  }
/>

<Route
  path="/agent/merchant/:id/vkyc"
  element={
    <ProtectedRoute role="agent">
      <VKYC />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/merchant-review"
  element={
    <ProtectedRoute role="admin">
      <PendingApplications />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/merchant-review/:id"
  element={
    <ProtectedRoute role="admin">
      <MerchantReview />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/merchant-review/:id/kyc"
  element={
    <ProtectedRoute role="admin">
      <MerchantKYC />
    </ProtectedRoute>
  }
/>

<Route
  path="/agent/merchant/:id/shop-verification"
  element={
    <ProtectedRoute role="agent">
      <ShopVerification />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/merchant-review/:id/documents"
  element={
    <ProtectedRoute role="admin">
      <MerchantDocuments />
    </ProtectedRoute>
  }
/>
<Route
  path="/agent/merchant/:merchantId/agreement"
  element={<Agreement />}
/>
          <Route path="/agent/merchants" element={<ProtectedRoute role="agent"><MyMerchants /></ProtectedRoute>} />
          <Route path="/agent/merchants/:id" element={<ProtectedRoute role="agent"><MerchantView /></ProtectedRoute>} />
          <Route path="/agent/profile" element={<ProtectedRoute role="agent"><AgentProfile /></ProtectedRoute>} />
          <Route
  path="/agent/invoices"
  element={
    <ProtectedRoute role="agent">
      <Invoices />
    </ProtectedRoute>
  }
/>
          <Route path="/agent/notifications" element={<ProtectedRoute role="agent"><NotificationsPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;