import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { agentLogin } from '../../services/api';
import toast from 'react-hot-toast';

export default function AgentLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await agentLogin(form);
      login(data.token, data.user);
      navigate('/agent/dashboard');
      toast.success(`Welcome, ${data.user.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>MH Step Pays</h1>
          <p>PARTNER PORTAL — Sign in</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email <span className="required">*</span></label>
            <input className="form-control" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password <span className="required">*</span></label>
            <input className="form-control" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</> : 'Sign In'}
          </button>
        </form>
        <div className="divider" />
        <p className="text-center" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}