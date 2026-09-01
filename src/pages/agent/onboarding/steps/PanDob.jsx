import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PanDob.css";
import { getMerchant, verifyPAN } from "../../../../services/merchantApi";
export default function PanDob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
  pan: "",
  panName: "",
  dob: "",
});

  const [error, setError] = useState("");
  const [merchant, setMerchant] = useState(null);
const [loadingMerchant, setLoadingMerchant] = useState(true);

useEffect(() => {
  const loadMerchant = async () => {
    try {
      const merchantId = localStorage.getItem(
        "onboardingMerchantId"
      );

      if (!merchantId) {
        setError(
          "Merchant session not found. Please start the onboarding again."
        );
        return;
      }

      const response = await getMerchant(merchantId);

      console.log(
        "PAN PAGE MERCHANT:",
        response
      );

      if (response?.success) {
        setMerchant(response.data);
      } else {
        setError(
          response?.message ||
          "Unable to load merchant details."
        );
      }

    } catch (error) {

      console.error(
        "LOAD MERCHANT ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Unable to load merchant details."
      );

    } finally {
      setLoadingMerchant(false);
    }
  };

  loadMerchant();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "pan" ? value.toUpperCase() : value,
    }));

    setError("");
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!form.pan.trim()) {
      setError("PAN number is required.");
      return;
    }

    if (form.pan.length !== 10) {
      setError("Please enter a valid 10-character PAN number.");
      return;
    }

    if (!form.panName.trim()) {
  setError("PAN card name is required.");
  return;
}

    if (!form.dob) {
      setError("Date of birth is required.");
      return;
    }

   const merchantId = localStorage.getItem(
  "onboardingMerchantId"
);

if (!merchantId) {
  setError(
    "Merchant session not found. Please start the onboarding again."
  );
  return;
}

try {
  setError("");

  const response = await verifyPAN(
    merchantId,
    {
      pan: form.pan,
      panName: form.panName,
      dob: form.dob,
    }
  );

  console.log(
    "PAN VERIFICATION RESPONSE:",
    response
  );

  if (!response?.success) {
    setError(
      response?.message ||
      "Unable to submit PAN details."
    );
    return;
  }

  navigate("/agent/merchant/next/ckyc");

} catch (error) {

  console.error(
    "PAN VERIFICATION ERROR:",
    error
  );

  setError(
    error?.response?.data?.message ||
    "Unable to submit PAN details. Please try again."
  );
}
  };

  return (
    <div className="pan-dob-page">

      <div className="pan-dob-container">

        {/* HEADER */}
        <div className="pan-dob-header">
          <div>
            <p className="page-step">STEP 02 OF 12</p>

            <h1>PAN & Personal Details</h1>

            <p>
              Verify the merchant's PAN and date of birth information.
            </p>
          </div>
        </div>


        {/* PROGRESS */}
        <div className="pan-progress-card">

          <div className="pan-progress-item completed">
            <div className="progress-circle">✓</div>

            <div>
              <strong>Basic Details</strong>
              <span>Completed</span>
            </div>
          </div>

          <div className="progress-line active" />

          <div className="pan-progress-item active">
            <div className="progress-circle">2</div>

            <div>
              <strong>PAN & DOB</strong>
              <span>Current step</span>
            </div>
          </div>

          <div className="progress-line" />

          <div className="pan-progress-item">
            <div className="progress-circle">3</div>

            <div>
              <strong>CKYC</strong>
              <span>Next step</span>
            </div>
          </div>

        </div>


        {/* ERROR */}
        {error && (
          <div className="pan-alert">
            <span className="alert-icon">!</span>
            <span>{error}</span>
          </div>
        )}


        <form onSubmit={handleContinue}>

          {/* MERCHANT SUMMARY */}
          <section className="pan-section">

            <div className="section-heading">
              <div className="section-icon">M</div>

              <div>
                <h2>Merchant Information</h2>
                <p>
                  Basic information collected during merchant creation.
                </p>
              </div>
            </div>

            <div className="merchant-summary">

              <div className="summary-item">
                <span>Merchant Name</span>
                <strong>
  {loadingMerchant
    ? "Loading..."
    : merchant?.merchantName || "-"}
</strong>
              </div>

              <div className="summary-item">
                <span>Business Entity</span>
                <strong>
  {loadingMerchant
    ? "Loading..."
    : merchant?.entityType || "-"}
</strong>
              </div>

            </div>

          </section>


          {/* PAN DETAILS */}
          <section className="pan-section">

            <div className="section-heading">

              <div className="section-icon blue">
                ID
              </div>

              <div>
                <h2>PAN Details</h2>
                <p>
                  Enter the PAN details exactly as mentioned on the PAN card.
                </p>
              </div>

            </div>


            <div className="pan-form-grid">

              <div className="pan-form-group">

                <label>
                  PAN Number <span>*</span>
                </label>

                <input
                  type="text"
                  name="pan"
                  value={form.pan}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  autoComplete="off"
                  className="pan-input"
                />

                <small>
                  Enter the 10-character PAN number.
                </small>

              </div>

             <div className="pan-form-group">

  <label>
    Name as per PAN Card <span>*</span>
  </label>

  <input
    type="text"
    name="panName"
    value={form.panName}
    onChange={handleChange}
    placeholder="Enter name exactly as per PAN card"
    autoComplete="off"
    className="pan-input"
  />

  <small>
    Enter the name exactly as mentioned on the PAN card.
  </small>

</div>


              <div className="pan-form-group">

                <label>
                  Date of Birth <span>*</span>
                </label>

                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="pan-input"
                />

                <small>
                  Enter the date of birth as per official records.
                </small>

              </div>

            </div>

          </section>


          {/* INFORMATION CARD */}
          <div className="pan-info-card">

            <div className="info-icon">i</div>

            <div>
              <strong>Important</strong>

              <p>
                PAN and date of birth should match the merchant's official
                KYC documents. Any mismatch may cause verification failure.
              </p>
            </div>

          </div>


          {/* ACTIONS */}
          <div className="pan-actions">

            <button
              type="button"
              className="pan-btn secondary"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            <button
              type="submit"
              className="pan-btn primary"
            >
              Continue
              <span>→</span>
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}