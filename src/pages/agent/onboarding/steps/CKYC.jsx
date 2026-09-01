import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CKYC.css";
import { getMerchant, skipCKYC, } from "../../../../services/merchantApi";

export default function CKYC() {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("");
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
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
        "CKYC PAGE MERCHANT:",
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
        "CKYC MERCHANT LOAD ERROR:",
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

  const handleContinue = () => {
    if (!selectedOption) {
      setError("Please select whether you want to proceed with CKYC or skip it.");
      return;
    }

    setError("");

    if (selectedOption === "skip") {
      setShowSkipConfirm(true);
      return;
    }

  console.log("Proceeding with CKYC");

const merchantId = localStorage.getItem(
  "onboardingMerchantId"
);

if (!merchantId) {
  setError(
    "Merchant session not found. Please start the onboarding again."
  );
  return;
}

navigate(
  `/agent/merchant/${merchantId}/bank`
);
  };

 const confirmSkip = async () => {
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

    const response = await skipCKYC(
      merchantId
    );

    console.log(
      "CKYC SKIP RESPONSE:",
      response
    );

    if (!response?.success) {
      setError(
        response?.message ||
        "Unable to skip CKYC."
      );
      return;
    }

    setShowSkipConfirm(false);

navigate(
  `/agent/merchant/${merchantId}/bank`
);

  } catch (error) {

    console.error(
      "CKYC SKIP ERROR:",
      error
    );

    setError(
      error?.response?.data?.message ||
      "Unable to skip CKYC."
    );
  }
};

  return (
    <div className="ckyc-page">
      <div className="ckyc-container">

        {/* HEADER */}
        <div className="ckyc-header">
          <p className="ckyc-step">STEP 03 OF 12</p>

          <h1>CKYC Verification</h1>

          <p>
            Complete Central KYC verification or skip this step if applicable.
          </p>
        </div>


        {/* PROGRESS */}
        <div className="ckyc-progress-card">

          <div className="ckyc-progress-item completed">
            <div className="ckyc-progress-circle">✓</div>
            <div>
              <strong>Basic Details</strong>
              <span>Completed</span>
            </div>
          </div>

          <div className="ckyc-progress-line active" />

          <div className="ckyc-progress-item completed">
            <div className="ckyc-progress-circle">✓</div>
            <div>
              <strong>PAN & DOB</strong>
              <span>Completed</span>
            </div>
          </div>

          <div className="ckyc-progress-line active" />

          <div className="ckyc-progress-item active">
            <div className="ckyc-progress-circle">3</div>
            <div>
              <strong>CKYC</strong>
              <span>Current step</span>
            </div>
          </div>

          <div className="ckyc-progress-line" />

          <div className="ckyc-progress-item">
            <div className="ckyc-progress-circle">4</div>
            <div>
              <strong>Bank Details</strong>
              <span>Next step</span>
            </div>
          </div>

        </div>


        {/* ERROR */}
        {error && (
          <div className="ckyc-alert">
            <div className="ckyc-alert-icon">!</div>
            <span>{error}</span>
          </div>
        )}


        {/* MERCHANT SUMMARY */}
        <section className="ckyc-section">

          <div className="ckyc-section-heading">

            <div className="ckyc-section-icon">
              M
            </div>

            <div>
              <h2>Merchant Information</h2>

              <p>
                Details associated with this merchant onboarding.
              </p>
            </div>

          </div>


         <div className="ckyc-summary">

  <div className="ckyc-summary-item">
    <span>Merchant Name</span>
    <strong>
      {loadingMerchant
        ? "Loading..."
        : merchant?.merchantName || "-"}
    </strong>
  </div>

  <div className="ckyc-summary-item">
    <span>Business Entity</span>
    <strong>
      {loadingMerchant
        ? "Loading..."
        : merchant?.entityType || "-"}
    </strong>
  </div>

  <div className="ckyc-summary-item">
    <span>PAN Number</span>
    <strong>
      {loadingMerchant
        ? "Loading..."
        : merchant?.panNumber || "-"}
    </strong>
  </div>

</div>

        </section>


        {/* CKYC OPTIONS */}
        <section className="ckyc-section">

          <div className="ckyc-section-heading">

            <div className="ckyc-section-icon blue">
              KYC
            </div>

            <div>
              <h2>Choose CKYC Option</h2>

              <p>
                Select how you want to proceed with Central KYC verification.
              </p>
            </div>

          </div>


          <div className="ckyc-options">

            {/* PROCEED */}
            <button
              type="button"
              className={`ckyc-option ${
                selectedOption === "proceed" ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedOption("proceed");
                setError("");
              }}
            >

              <div className="ckyc-option-top">

                <div className="ckyc-option-icon blue-icon">
                  ✓
                </div>

                {selectedOption === "proceed" && (
                  <div className="ckyc-selected">
                    ✓
                  </div>
                )}

              </div>

              <h3>Proceed with CKYC</h3>

              <p>
                Continue with CKYC verification for the merchant.
              </p>

            </button>


            {/* SKIP */}
            <button
              type="button"
              className={`ckyc-option ${
                selectedOption === "skip" ? "selected skip-selected" : ""
              }`}
              onClick={() => {
                setSelectedOption("skip");
                setError("");
              }}
            >

              <div className="ckyc-option-top">

                <div className="ckyc-option-icon grey-icon">
                  →
                </div>

                {selectedOption === "skip" && (
                  <div className="ckyc-selected">
                    ✓
                  </div>
                )}

              </div>

              <h3>Skip CKYC</h3>

              <p>
                Skip CKYC if the merchant journey allows it.
              </p>

            </button>

          </div>

        </section>


        {/* INFO */}
        <div className="ckyc-info">

          <div className="ckyc-info-icon">
            i
          </div>

          <div>
            <strong>About CKYC</strong>

            <p>
              CKYC may be skipped when permitted by the merchant onboarding
              journey. The option selected here can be connected to the
              PayU verification flow during API integration.
            </p>
          </div>

        </div>


        {/* ACTIONS */}
        <div className="ckyc-actions">

          <button
            type="button"
            className="ckyc-btn secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <button
            type="button"
            className="ckyc-btn primary"
            onClick={handleContinue}
          >
            Continue
            <span>→</span>
          </button>

        </div>


        {/* SKIP CONFIRMATION */}
        {showSkipConfirm && (
          <div className="ckyc-modal-overlay">

            <div className="ckyc-modal">

              <div className="ckyc-modal-icon">
                !
              </div>

              <h2>Skip CKYC?</h2>

              <p>
                Are you sure you want to skip CKYC for this merchant?
                You can continue to the next onboarding step.
              </p>

              <div className="ckyc-modal-actions">

                <button
                  type="button"
                  className="ckyc-modal-cancel"
                  onClick={() => setShowSkipConfirm(false)}
                >
                  Go Back
                </button>

                <button
                  type="button"
                  className="ckyc-modal-confirm"
                  onClick={confirmSkip}
                >
                  Yes, Skip CKYC
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}