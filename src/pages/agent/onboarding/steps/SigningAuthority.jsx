import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SigningAuthority.css";
import { addSignatoryDetails } from "../../../../services/merchantApi";

export default function SigningAuthority() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    panNumber: "",
    authorisedSignatory: true,
    contactDetailType: "Signing Authority",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleContinue = async (e) => {
  e.preventDefault();

  if (!form.name.trim()) {
    setError("Please enter the signing authority name.");
    return;
  }

  if (!form.email.trim()) {
    setError("Please enter the email address.");
    return;
  }

  if (!form.mobile.trim()) {
    setError("Please enter the mobile number.");
    return;
  }

  if (!form.panNumber.trim()) {
    setError("Please enter the PAN number.");
    return;
  }

  if (form.mobile.length !== 10) {
    setError("Please enter a valid 10-digit mobile number.");
    return;
  }

  if (form.panNumber.length !== 10) {
    setError("Please enter a valid 10-character PAN number.");
    return;
  }

  try {

    setError("");

    const merchantId = localStorage.getItem(
      "onboardingMerchantId"
    );

    if (!merchantId) {
      setError(
        "Merchant session not found. Please start the onboarding again."
      );
      return;
    }

    console.log("SIGNATORY PAYLOAD:", {
      name: form.name,
      email: form.email,
      panNumber: form.panNumber,
    });

    const response = await addSignatoryDetails(
      merchantId,
      {
        name: form.name,
        email: form.email,
        panNumber: form.panNumber,
      }
    );

    console.log(
      "SIGNATORY API RESPONSE:",
      response
    );

    if (!response?.success) {
      setError(
        response?.message ||
        "Unable to save signing authority details."
      );
      return;
    }

    navigate(
  `/agent/merchant/${merchantId}/digilocker`
);

  } catch (error) {

    console.error(
      "SIGNATORY ERROR:",
      error
    );

    setError(
      error?.response?.data?.message ||
      "Unable to save signing authority details."
    );
  }
};

  return (
    <div className="signing-page">
      <div className="signing-container">

        {/* HEADER */}
        <div className="signing-header">
          <p className="signing-step">STEP 07 OF 12</p>

          <h1>Signing Authority</h1>

          <p>
            Provide the details of the person authorised to represent
            and sign on behalf of the merchant.
          </p>
        </div>


        {/* PROGRESS */}
        <div className="signing-progress-card">

          {[
            ["✓", "Basic Details", "completed"],
            ["✓", "PAN & DOB", "completed"],
            ["✓", "CKYC", "completed"],
            ["✓", "Bank Details", "completed"],
            ["✓", "Business Details", "completed"],
            ["✓", "Website", "completed"],
            ["7", "Signing Authority", "active"],
          ].map((item, index) => (
            <div
              className="signing-progress-wrapper"
              key={item[1]}
            >

              <div
                className={`signing-progress-item ${item[2]}`}
              >

                <div className="signing-progress-circle">
                  {item[0]}
                </div>

                <div>
                  <strong>{item[1]}</strong>

                  <span>
                    {item[2] === "active"
                      ? "Current step"
                      : "Completed"}
                  </span>
                </div>

              </div>

              {index < 6 && (
                <div className="signing-progress-line active" />
              )}

            </div>
          ))}

        </div>


        {/* ERROR */}
        {error && (
          <div className="signing-alert">

            <div className="signing-alert-icon">
              !
            </div>

            <span>{error}</span>

          </div>
        )}


        <form onSubmit={handleContinue}>

          {/* PERSON DETAILS */}
          <section className="signing-section">

            <div className="signing-section-heading">

              <div className="signing-section-icon">
                SA
              </div>

              <div>
                <h2>Signing Authority Details</h2>

                <p>
                  Enter the personal details of the authorised signatory.
                </p>
              </div>

            </div>


            <div className="signing-form-grid">

              {/* NAME */}
              <div className="signing-form-group full">

                <label>
                  Full Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name as per PAN"
                  className="signing-input"
                />

                <small>
                  Name should match the PAN / KYC records.
                </small>

              </div>


              {/* EMAIL */}
              <div className="signing-form-group">

                <label>
                  Email Address <span>*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="signing-input"
                />

              </div>


              {/* MOBILE */}
              <div className="signing-form-group">

                <label>
                  Mobile Number <span>*</span>
                </label>

                <div className="signing-mobile-input">

                  <span>+91</span>

                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                      setForm((prev) => ({
                        ...prev,
                        mobile: value,
                      }));

                      setError("");
                    }}
                    placeholder="10-digit mobile number"
                  />

                </div>

              </div>


              {/* PAN */}
              <div className="signing-form-group">

                <label>
                  PAN Number <span>*</span>
                </label>

                <input
                  type="text"
                  name="panNumber"
                  value={form.panNumber}
                  onChange={(e) => {
                    const value = e.target.value
                      .toUpperCase()
                      .slice(0, 10);

                    setForm((prev) => ({
                      ...prev,
                      panNumber: value,
                    }));

                    setError("");
                  }}
                  placeholder="ABCDE1234F"
                  className="signing-input"
                />

              </div>


              {/* CONTACT TYPE */}
              <div className="signing-form-group">

                <label>
                  Contact Detail Type
                </label>

                <select
                  name="contactDetailType"
                  value={form.contactDetailType}
                  onChange={handleChange}
                  className="signing-input"
                >
                  <option value="Signing Authority">
                    Signing Authority
                  </option>
                </select>

              </div>

            </div>

          </section>


          {/* AUTHORISATION */}
          <section className="signing-section">

            <div className="signing-section-heading">

              <div className="signing-section-icon">
                ✓
              </div>

              <div>
                <h2>Authorisation</h2>

                <p>
                  Confirm the person's authority to represent the merchant.
                </p>
              </div>

            </div>


            <div className="signing-authorisation-card">

              <div className="signing-authorisation-left">

                <div className="signing-authorisation-check">
                  ✓
                </div>

                <div>
                  <strong>Authorised Signatory</strong>

                  <p>
                    This person is authorised to sign and represent
                    the merchant for the onboarding process.
                  </p>
                </div>

              </div>

              <div className="signing-status-badge">
                Confirmed
              </div>

            </div>

          </section>


          {/* INFO */}
          <div className="signing-info">

            <div className="signing-info-icon">
              i
            </div>

            <div>

              <strong>Important</strong>

              <p>
                Please ensure that the name, PAN and contact details
                match the merchant's KYC records. These details may
                be used for verification and agreement signing.
              </p>

            </div>

          </div>


          {/* ACTIONS */}
          <div className="signing-actions">

            <button
              type="button"
              className="signing-btn secondary"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            <button
              type="submit"
              className="signing-btn primary"
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