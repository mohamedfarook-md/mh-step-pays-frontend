import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Agreement.css";
import { generateAgreement } from "../../../../services/payuApi";

const Agreement = () => {
  const navigate = useNavigate();
  const { merchantId } = useParams();
  const [loading, setLoading] = React.useState(false);
const [agreementData, setAgreementData] = React.useState(null);
const [error, setError] = React.useState("");

  const handleGenerateAgreement = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await generateAgreement(merchantId);

    console.log("AGREEMENT RESPONSE:", response);

    if (response?.success) {
      setAgreementData(response.data);
    } else {
      setError(
        response?.message ||
        "Unable to generate agreement"
      );
    }

  } catch (error) {
    console.error(
      "Generate Agreement Error:",
      error
    );

    setError(
      error?.response?.data?.message ||
      "Unable to generate agreement"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="agreement-page">
      <div className="agreement-container">

        {/* STEP */}
        <div className="agreement-step-label">
          FINAL STEP
        </div>

        {/* HEADER */}
        <h1 className="agreement-title">
          Agreement
        </h1>

        <p className="agreement-description">
          Review the merchant agreement before proceeding
          to the final onboarding step.
        </p>

        {/* PROGRESS */}
        <div className="vkyc-progress-card">
  {[
    ["✓", "Basic Details", "completed"],
    ["✓", "PAN & DOB", "completed"],
    ["✓", "CKYC", "completed"],
    ["✓", "Bank Details", "completed"],
    ["✓", "Business Details", "completed"],
    ["✓", "Website", "completed"],
    ["✓", "Signing Authority", "completed"],
    ["✓", "DigiLocker", "completed"],
    ["✓", "UBO / Members", "completed"],
    ["✓", "Shop Verification", "completed"],
    ["✓", "Documents", "completed"],
    ["✓", "VKYC", "completed"],
    ["12", "Agreement", "active"],
  ].map((item, index) => (
    <div
      className="vkyc-progress-wrapper"
      key={item[1]}
    >
      <div
        className={`vkyc-progress-item ${item[2]}`}
      >
        <div className="vkyc-progress-circle">
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

      {index < 11 && (
        <div
          className={`vkyc-progress-line ${
            item[2] === "active" ? "" : "active"
          }`}
        />
      )}
    </div>
  ))}
</div>

        {/* AGREEMENT CARD */}
        <div className="agreement-card">

          <div className="agreement-card-header">
            <div className="agreement-icon">
              DOC
            </div>

            <div>
              <h2>Merchant Agreement</h2>

              <p>
                The agreement will be generated and reviewed
                before the merchant proceeds to the final step.
              </p>
            </div>
          </div>

          {/* STATUS */}
          <div className="agreement-status">
            <span className="status-dot"></span>

            <div>
              <strong>Agreement Pending</strong>

              <p>
                Agreement has not been generated yet.
              </p>
            </div>
          </div>

          {/* PREVIEW PLACEHOLDER */}
          <div className="agreement-preview">
            <div className="preview-icon">
              📄
            </div>

            <h3>Agreement Document</h3>

            <p>
              The merchant agreement will appear here
              once it is generated.
            </p>
          </div>

          {/* GENERATE BUTTON */}
          <button
  type="button"
  className="agreement-generate-btn"
  onClick={handleGenerateAgreement}
  disabled={loading}
>
  {loading
    ? "Generating Agreement..."
    : "Generate Agreement"}
</button>
{error && (
  <div className="agreement-error">
    {error}
  </div>
)}

        </div>

        {/* ACTIONS */}
        <div className="agreement-actions">

          {/* <button
            type="button"
            className="agreement-next-btn"
            onClick={handleContinue}
          >
            Next →
          </button> */}

          <button
            type="button"
            className="agreement-back-btn"
            onClick={() =>
              navigate(
                `/agent/merchant/${merchantId}/vkyc`
              )
            }
          >
            ← Back
          </button>

        </div>

      </div>
    </div>
  );
};

export default Agreement;