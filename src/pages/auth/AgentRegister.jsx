import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { agentRegister } from '../../services/api';
import toast from 'react-hot-toast';

export default function AgentRegister() {
  const [form, setForm] = useState({ fullName: '', email: '', mobile: '', employmentType: 'full_time', password: '', confirmPassword: '', termsAccepted: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = 'Enter valid 10-digit mobile number';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.termsAccepted) e.terms = 'You must accept Terms & Conditions';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await agentRegister(form);
      toast.success('Registration submitted! Awaiting admin approval.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const f = (field) => ({ value: form[field], onChange: e => setForm(p => ({ ...p, [field]: e.target.value })) });

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: 40 }}>
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-logo">
          <h1>MH Step Pays</h1>
          <p>Field Agent Registration</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input className={`form-control${errors.fullName ? ' error' : ''}`} placeholder="John Doe" {...f('fullName')} />
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number <span className="required">*</span></label>
              <input className={`form-control${errors.mobile ? ' error' : ''}`} placeholder="9876543210" maxLength={10} {...f('mobile')} />
              {errors.mobile && <span className="form-error">{errors.mobile}</span>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address <span className="required">*</span></label>
            <input className={`form-control${errors.email ? ' error' : ''}`} type="email" placeholder="agent@email.com" {...f('email')} />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Employment Type <span className="required">*</span></label>
            <select className="form-control" value={form.employmentType} onChange={e => setForm(p => ({ ...p, employmentType: e.target.value }))}>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
            </select>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Password <span className="required">*</span></label>
              <input className={`form-control${errors.password ? ' error' : ''}`} type="password" placeholder="Min 8 characters" {...f('password')} />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password <span className="required">*</span></label>
              <input className={`form-control${errors.confirmPassword ? ' error' : ''}`} type="password" placeholder="Confirm password" {...f('confirmPassword')} />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.termsAccepted} onChange={e => setForm(p => ({ ...p, termsAccepted: e.target.checked }))} style={{ marginTop: 3 }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text)' }}>I accept the Terms & Conditions and Privacy Policy of MH Step Pays</span>
            </label>
            {errors.terms && <span className="form-error">{errors.terms}</span>}
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Submitting...</> : 'Register as Field Agent'}
          </button>
        </form>
        <div className="divider" />
        <p className="text-center" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
}