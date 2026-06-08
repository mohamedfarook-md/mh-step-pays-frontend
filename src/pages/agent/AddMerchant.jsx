// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AgentSidebar from '../../components/AgentSidebar';
// import { Topbar } from '../../components/index';
// import { createMerchant, uploadDocuments, submitMerchant } from '../../services/api';
// import toast from 'react-hot-toast';

// const businessCategories = ['Retail', 'Restaurant / Food', 'Grocery', 'Pharmacy', 'Electronics', 'Clothing / Fashion', 'Service', 'Healthcare', 'Education', 'Transport', 'Other'];

// const docConfig = [
//   { key: 'aadhaarFront', label: 'Aadhaar Front', required: true },
//   { key: 'aadhaarBack', label: 'Aadhaar Back', required: true },
//   { key: 'panFront', label: 'PAN Card Front', required: true },
//   { key: 'panBack', label: 'PAN Card Back', required: false },
//   { key: 'utilityBill', label: 'Utility Bill', required: true },
//   { key: 'bankDocument', label: 'Bank Passbook / Cheque', required: true },
//   { key: 'gstOrAgreement', label: 'GST Cert / Service Agreement', required: true },
//   { key: 'shopPhoto', label: 'Shop Photo', required: true },
//   { key: 'shopBoardPhoto', label: 'Shop Board Photo', required: true },
// ];

// export default function AddMerchant() {
//   const [step, setStep] = useState(1); // 1=info, 2=docs, 3=review
//   const [merchantId, setMerchantId] = useState(null);
//   const [form, setForm] = useState({ merchantName: '', mobile: '', email: '', shopName: '', businessCategory: '', address: '', aadhaarNumber: '', panNumber: '' });
//   const [files, setFiles] = useState({});
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const navigate = useNavigate();

//   const validateStep1 = () => {
//     const e = {};
//     if (!form.merchantName.trim()) e.merchantName = 'Required';
//     if (!/^\d{10}$/.test(form.mobile)) e.mobile = '10-digit mobile required';
//     if (!form.shopName.trim()) e.shopName = 'Required';
//     if (!form.businessCategory) e.businessCategory = 'Select category';
//     if (!form.address.trim()) e.address = 'Required';
//     setErrors(e);
//     return !Object.keys(e).length;
//   };

//   const handleSaveMerchant = async () => {
//     if (!validateStep1()) return;
//     setLoading(true);
//     try {
//       const { data } = await createMerchant(form);
//       setMerchantId(data.data._id);
//       setStep(2);
//       toast.success('Merchant info saved! Now upload documents.');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to save merchant');
//     } finally { setLoading(false); }
//   };

//   const handleUploadDocs = async () => {
//     const required = docConfig.filter(d => d.required);
//     const missing = required.filter(d => !files[d.key]);
//     if (missing.length) {
//       toast.error(`Required: ${missing.map(d => d.label).join(', ')}`); return;
//     }
//     setUploading(true);
//     try {
//       const fd = new FormData();
//       Object.entries(files).forEach(([k, f]) => fd.append(k, f));
//       await uploadDocuments(merchantId, fd);
//       setStep(3);
//       toast.success('Documents uploaded!');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Upload failed');
//     } finally { setUploading(false); }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await submitMerchant(merchantId);
//       toast.success('Merchant submitted for review!');
//       navigate('/agent/merchants');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Submit failed');
//     } finally { setLoading(false); }
//   };

//   const f = (field) => ({ value: form[field], onChange: e => setForm(p => ({ ...p, [field]: e.target.value })) });

//   return (
//     <div className="layout">
//       <AgentSidebar />
//       <div className="main-content">
//         <Topbar title="Add New Merchant" subtitle="Onboard a merchant through the workflow" />
//         <div className="page-content">
//           {/* Steps indicator */}
//           <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, gap: 0 }}>
//             {[{ n: 1, label: 'Merchant Info' }, { n: 2, label: 'Documents' }, { n: 3, label: 'Submit' }].map((s, i) => (
//               <React.Fragment key={s.n}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= s.n ? 'var(--accent)' : 'var(--border)', color: step >= s.n ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', transition: 'all 0.2s' }}>{step > s.n ? '✓' : s.n}</div>
//                   <span style={{ fontSize: '0.85rem', fontWeight: 600, color: step >= s.n ? 'var(--text)' : 'var(--text-muted)' }}>{s.label}</span>
//                 </div>
//                 {i < 2 && <div style={{ flex: 1, height: 2, background: step > s.n ? 'var(--accent)' : 'var(--border)', margin: '0 12px', minWidth: 20 }} />}
//               </React.Fragment>
//             ))}
//           </div>

//           {step === 1 && (
//             <div className="card">
//               <div className="card-header"><h3 className="card-title">Merchant Information</h3></div>
//               <div className="form-grid">
//                 <div className="form-group">
//                   <label className="form-label">Merchant Name <span className="required">*</span></label>
//                   <input className={`form-control${errors.merchantName ? ' error' : ''}`} placeholder="Full merchant name" {...f('merchantName')} />
//                   {errors.merchantName && <span className="form-error">{errors.merchantName}</span>}
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Mobile Number <span className="required">*</span></label>
//                   <input className={`form-control${errors.mobile ? ' error' : ''}`} placeholder="10-digit mobile" maxLength={10} {...f('mobile')} />
//                   {errors.mobile && <span className="form-error">{errors.mobile}</span>}
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Email Address</label>
//                   <input className="form-control" type="email" placeholder="merchant@email.com" {...f('email')} />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Shop Name <span className="required">*</span></label>
//                   <input className={`form-control${errors.shopName ? ' error' : ''}`} placeholder="Shop / Business name" {...f('shopName')} />
//                   {errors.shopName && <span className="form-error">{errors.shopName}</span>}
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Business Category <span className="required">*</span></label>
//                   <select className={`form-control${errors.businessCategory ? ' error' : ''}`} value={form.businessCategory} onChange={e => setForm(p => ({ ...p, businessCategory: e.target.value }))}>
//                     <option value="">Select category...</option>
//                     {businessCategories.map(c => <option key={c} value={c}>{c}</option>)}
//                   </select>
//                   {errors.businessCategory && <span className="form-error">{errors.businessCategory}</span>}
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Aadhaar Number</label>
//                   <input className="form-control" placeholder="12-digit Aadhaar" maxLength={12} {...f('aadhaarNumber')} />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">PAN Number</label>
//                   <input className="form-control" placeholder="ABCDE1234F" maxLength={10} style={{ textTransform: 'uppercase' }} {...f('panNumber')} />
//                 </div>
//               </div>
//               <div className="form-group" style={{ gridColumn: '1 / -1' }}>
//                 <label className="form-label">Address <span className="required">*</span></label>
//                 <textarea className={`form-control${errors.address ? ' error' : ''}`} rows={3} placeholder="Full shop address..." value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
//                 {errors.address && <span className="form-error">{errors.address}</span>}
//               </div>
//               <div style={{ marginTop: 8 }}>
//                 <button className="btn btn-primary" onClick={handleSaveMerchant} disabled={loading}>
//                   {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : 'Save & Continue to Documents →'}
//                 </button>
//               </div>
//             </div>
//           )}

//           {step === 2 && (
//             <div className="card">
//               <div className="card-header"><h3 className="card-title">Upload Documents</h3><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>JPG, PNG, PDF · Max 10MB each</span></div>
//               <div className="doc-upload-grid">
//                 {docConfig.map(doc => (
//                   <div key={doc.key} className={`doc-upload-item ${files[doc.key] ? 'uploaded' : ''}`}>
//                     <input type="file" accept="image/*,.pdf" onChange={e => e.target.files[0] && setFiles(f => ({ ...f, [doc.key]: e.target.files[0] }))} />
//                     {files[doc.key] ? (
//                       <>
//                         <div style={{ color: 'var(--success)', marginBottom: 4 }}>✓</div>
//                         <div className="doc-upload-label" style={{ color: 'var(--success)' }}>{files[doc.key].name.slice(0, 18)}</div>
//                         <div className="doc-upload-hint">Tap to change</div>
//                       </>
//                     ) : (
//                       <>
//                         <div className="doc-upload-icon">📄</div>
//                         <div className="doc-upload-label">{doc.label}</div>
//                         <div className="doc-upload-hint">{doc.required ? '⚠ Required' : 'Optional'}</div>
//                       </>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
//                 <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
//                 <button className="btn btn-primary" onClick={handleUploadDocs} disabled={uploading}>
//                   {uploading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Uploading...</> : 'Upload & Continue →'}
//                 </button>
//               </div>
//             </div>
//           )}

//           {step === 3 && (
//             <div className="card">
//               <div className="card-header"><h3 className="card-title">Review & Submit</h3></div>
//               <div className="alert alert-info">
//                 <span>ℹ️</span>
//                 <span>All information has been saved. Click <strong>Submit for Review</strong> to send this merchant for admin verification.</span>
//               </div>
//               <div className="form-grid" style={{ marginBottom: 20 }}>
//                 {[['Name', form.merchantName], ['Mobile', form.mobile], ['Shop', form.shopName], ['Category', form.businessCategory]].map(([l, v]) => (
//                   <div key={l} style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
//                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l}</div>
//                     <div style={{ fontWeight: 600, marginTop: 2 }}>{v}</div>
//                   </div>
//                 ))}
//               </div>
//               <div style={{ display: 'flex', gap: 12 }}>
//                 <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back to Documents</button>
//                 <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
//                   {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Submitting...</> : '🚀 Submit for Review'}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }































import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentSidebar from '../../components/AgentSidebar';
import { Topbar } from '../../components/index';
import { createMerchant, uploadDocuments, submitMerchant } from '../../services/api';
import toast from 'react-hot-toast';


const CATEGORIES = ['Retail','Restaurant / Food','Grocery','Pharmacy','Electronics','Clothing / Fashion','Service','Healthcare','Education','Transport','Other'];

const DOC_CONFIG = [
  { key: 'aadhaarFront',    label: 'Aadhaar Front',          required: true },
  { key: 'aadhaarBack',     label: 'Aadhaar Back',           required: true },
  { key: 'panFront',        label: 'PAN Card Front',         required: true },
  { key: 'panBack',         label: 'PAN Card Back',          required: false },
  { key: 'utilityBill',     label: 'Utility Bill',           required: true },
  { key: 'bankDocument',    label: 'Bank Passbook / Cheque', required: true },
  { key: 'gstOrAgreement',  label: 'GST Cert / Agreement',   required: true },
  { key: 'shopPhoto',       label: 'Shop Photo',             required: true },
  { key: 'shopBoardPhoto',  label: 'Shop Board Photo',       required: true },
];

const STEPS = [
  { n: 1, label: 'Merchant Info', icon: '📋' },
  { n: 2, label: 'Documents',     icon: '📁' },
  { n: 3, label: 'Submit',        icon: '🚀' },
];


//  const Field = ({ name, label, required, half, type = 'text', maxLength, placeholder, style }) => (
  const Field = ({
  name,
  label,
  required,
  half,
  type = 'text',
  maxLength,
  placeholder,
  style,
  form,
  errors,
  handleInputChange
}) => (
    <div className="form-group" style={half ? {} : {}}>
      <label className="form-label">
        {label}{required && <span className="required" style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
      </label>
      <input
        className={`form-control${errors[name] ? ' error' : ''}`}
        type={type} maxLength={maxLength} placeholder={placeholder}
        style={style}
        value={form[name]}
        // onChange={set(name)}
       onChange={(e) =>
  handleInputChange(name, e.target.value)
}
      />
      {errors[name] && <span className="form-error" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors[name]}</span>}
    </div>
  );

export default function AddMerchant() {
   console.log("AddMerchant Render");
  const [step, setStep] = useState(1);
  const [merchantId, setMerchantId] = useState(null);
  const [form, setForm] = useState({
    merchantName: '', mobile: '', email: '', shopName: '',
    businessCategory: '', address: '', city: '', state: '',
    pincode: '', aadhaarNumber: '', panNumber: ''
  });
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
  setForm(prev => ({
    ...prev,
    [field]: value
  }));
};
  // const set = field => e => setForm(p => ({ ...p, [field]: e.target.value }));
  

  const validateStep1 = () => {
    const e = {};
    if (!form.merchantName.trim())      e.merchantName = 'Full name is required';
    if (!/^\d{10}$/.test(form.mobile))  e.mobile = 'Valid 10-digit mobile required';
    if (!form.shopName.trim())          e.shopName = 'Shop name is required';
    if (!form.businessCategory)         e.businessCategory = 'Please select a category';
    if (!form.address.trim())           e.address = 'Address is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSaveMerchant = async () => {
    if (!validateStep1()) return;
    setLoading(true);
    try {
      const { data } = await createMerchant(form);
      setMerchantId(data.data._id);
      setStep(2);
      toast.success('Info saved! Now upload documents.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save merchant');
    } finally { setLoading(false); }
  };

  const handleUploadDocs = async () => {
    const missing = DOC_CONFIG.filter(d => d.required && !files[d.key]);
    if (missing.length) {
      toast.error(`Required documents missing: ${missing.map(d => d.label).join(', ')}`);
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      Object.entries(files).forEach(([k, f]) => fd.append(k, f));
      await uploadDocuments(merchantId, fd);
      setStep(3);
      toast.success('Documents uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitMerchant(merchantId);
      toast.success('Merchant submitted for review!');
      navigate('/agent/merchants');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submit failed');
    } finally { setLoading(false); }
  };
console.log("Field Recreated");
 

  return (
    <div className="layout">
      <AgentSidebar />
      <div className="main-content">
        <Topbar title="Add New Merchant" subtitle="Onboard a merchant in 3 steps" />
        <div className="page-content">

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, padding: '16px 20px', background: 'var(--card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={s.n}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: i < 2 ? 'none' : undefined }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    background: step > s.n ? 'var(--success)' : step === s.n ? 'var(--accent)' : 'var(--border)',
                    color: step >= s.n ? 'white' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.875rem', transition: 'all 0.25s'
                  }}>
                    {step > s.n ? '✓' : s.n}
                  </div>
                  <div className="step-label">
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: step >= s.n ? 'var(--text)' : 'var(--text-muted)' }}>{s.label}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{s.icon}</div>
                  </div>
                </div>
                {i < 2 && (
                  <div style={{
                    flex: 1, height: 2, margin: '0 10px',
                    background: step > s.n ? 'var(--success)' : 'var(--border)',
                    minWidth: 16, transition: 'background 0.25s'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ─── Step 1: Merchant Info ─── */}
          {step === 1 && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title" style={{ marginBottom: 0 }}>Merchant Information</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Fields marked * are required</span>
              </div>

              <div className="form-grid">
                {/* <Field name="merchantName"     label="Merchant Full Name"    required placeholder="e.g. Ravi Kumar" /> */}
                <div className="form-group">
  <label className="form-label">
    Merchant Full Name
  </label>

  <input
  placeholder="e.g. Ravi Kumar"
    className="form-control"
    type="text"
    value={form.merchantName}
    onChange={(e) =>
      setForm(prev => ({
        ...prev,
        merchantName: e.target.value
      }))
    }
  />
</div>
                <Field name="mobile"           label="Mobile Number"         required placeholder="10-digit number" maxLength={10}  form={form}
  errors={errors}
  handleInputChange={handleInputChange} />
                <Field name="email"            label="Email Address"         type="email" placeholder="optional@email.com"
                 form={form}
  errors={errors}
  handleInputChange={handleInputChange} />
                <Field name="shopName"         label="Shop / Business Name"  required placeholder="e.g. Ravi Electronics" 
                 form={form}
  errors={errors}
  handleInputChange={handleInputChange}/>
                <div className="form-group">
                  <label className="form-label">Business Category <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <select
                    className={`form-control${errors.businessCategory ? ' error' : ''}`}
                    value={form.businessCategory}
                    // onChange={set('businessCategory')}
                    onChange={(e) => handleInputChange('businessCategory', e.target.value)}
                  >
                    <option value="">Select a category…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.businessCategory && <span className="form-error" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.businessCategory}</span>}
                </div>
                <Field name="aadhaarNumber" label="Aadhaar Number" placeholder="12-digit Aadhaar" maxLength={12} form={form}
errors={errors}
handleInputChange={handleInputChange} />
                <Field name="panNumber"     label="PAN Number"     placeholder="ABCDE1234F" maxLength={10} style={{ textTransform: 'uppercase' }}  form={form}
errors={errors}
handleInputChange={handleInputChange}/>
                <Field name="city"     label="City"   placeholder="e.g. Chennai" form={form}
errors={errors}
handleInputChange={handleInputChange}/>
                <Field name="state"    label="State"  placeholder="e.g. Tamil Nadu" form={form}
errors={errors}
handleInputChange={handleInputChange}/>
                <Field name="pincode"  label="Pincode" placeholder="6-digit pincode" maxLength={6} form={form}
errors={errors}
handleInputChange={handleInputChange}/>
              </div>

              <div className="form-group" style={{ marginTop: 8 }}>
                <label className="form-label">Shop Address <span style={{ color: 'var(--danger)' }}>*</span></label>
                <textarea
                  className={`form-control${errors.address ? ' error' : ''}`}
                  rows={3} placeholder="Full shop address with landmark…"
                  value={form.address}
                  //  onChange={set('address')}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
                {errors.address && <span className="form-error" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.address}</span>}
              </div>

              <div style={{ marginTop: 20 }}>
                <button className="btn btn-primary" onClick={handleSaveMerchant} disabled={loading} style={{ minWidth: 200 }}>
                  {loading
                    ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</>
                    : 'Save & Continue to Documents →'}
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 2: Documents ─── */}
          {step === 2 && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title" style={{ marginBottom: 0 }}>Upload Documents</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>JPG, PNG, PDF · Max 10 MB each</span>
              </div>

              <div className="doc-upload-grid">
                {DOC_CONFIG.map(doc => (
                  <div
                    key={doc.key}
                    className={`doc-upload-item${files[doc.key] ? ' uploaded' : ''}`}
                    style={{ position: 'relative' }}
                  >
                    <input
                      type="file" accept="image/*,.pdf"
                      onChange={e => e.target.files[0] && setFiles(f => ({ ...f, [doc.key]: e.target.files[0] }))}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                    />
                    {files[doc.key] ? (
                      <>
                        <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>✅</div>
                        <div className="doc-upload-label" style={{ color: 'var(--success)' }}>
                          {files[doc.key].name.length > 18 ? files[doc.key].name.slice(0, 15) + '…' : files[doc.key].name}
                        </div>
                        <div className="doc-upload-hint">Tap to replace</div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>📄</div>
                        <div className="doc-upload-label">{doc.label}</div>
                        <div className="doc-upload-hint" style={{ color: doc.required ? '#f59e0b' : 'var(--text-muted)' }}>
                          {doc.required ? '⚠ Required' : 'Optional'}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 8, padding: '10px 14px', background: '#eff6ff', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: '#1d4ed8', marginBottom: 8 }}>
                ℹ️ {DOC_CONFIG.filter(d => !files[d.key] && d.required).length > 0
                  ? `${DOC_CONFIG.filter(d => !files[d.key] && d.required).length} required document(s) still missing`
                  : '✓ All required documents selected'}
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" onClick={handleUploadDocs} disabled={uploading} style={{ flex: 1, minWidth: 160, maxWidth: 280 }}>
                  {uploading
                    ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Uploading…</>
                    : 'Upload & Continue →'}
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Review & Submit ─── */}
          {step === 3 && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title" style={{ marginBottom: 0 }}>Review & Submit</h3>
              </div>

              <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-sm)', marginBottom: 20, color: '#15803d', fontSize: '0.875rem' }}>
                ✅ All documents uploaded. Review the details below before submitting.
              </div>

              <div className="form-grid" style={{ marginBottom: 20 }}>
                {[
                  ['Merchant Name', form.merchantName],
                  ['Mobile', form.mobile],
                  ['Email', form.email || '—'],
                  ['Shop Name', form.shopName],
                  ['Category', form.businessCategory],
                  ['City', form.city || '—'],
                  ['State', form.state || '—'],
                  ['Pincode', form.pincode || '—'],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: '12px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: 20 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Address</div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>{form.address}</div>
              </div>

              <div style={{ padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-sm)', marginBottom: 20, fontSize: '0.8rem', color: '#92400e' }}>
                ⚠️ Once submitted, you cannot edit the merchant information. Ensure all details are correct.
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn btn-outline" onClick={() => setStep(2)}>← Back to Documents</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 1, minWidth: 180, maxWidth: 280 }}>
                  {loading
                    ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Submitting…</>
                    : '🚀 Submit for Review'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}