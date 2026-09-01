import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DigiLocker.css";
import {
  initiateDigiLocker,
  checkDigiLockerStatus,
} from "../../../../services/merchantApi";
export default function DigiLocker() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("not_started");
const [captureLink, setCaptureLink] = useState("");
const [merchantId, setMerchantId] = useState("");
const [checkingStatus, setCheckingStatus] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
  const id = localStorage.getItem("onboardingMerchantId");

  if (!id) {
    setError(
      "Merchant session not found. Please start the onboarding again."
    );
    return;
  }

  setMerchantId(id);
}, []);

const startVerification = async () => {
  try {
    setError("");
    setStatus("processing");

    const response = await initiateDigiLocker(merchantId);

    console.log(
      "DIGILOCKER API RESPONSE:",
      response
    );

    if (!response?.success) {
      setStatus("not_started");

      setError(
        response?.message ||
        "Unable to generate DigiLocker link."
      );

      return;
    }

    const link = response?.data?.captureLink;

    if (!link) {
      setStatus("not_started");

      setError(
        "DigiLocker link was not generated."
      );

      return;
    }

    setCaptureLink(link);
    setStatus("link_generated");

    console.log(
      "DIGILOCKER CAPTURE LINK:",
      link
    );

  } catch (error) {

    console.error(
      "DIGILOCKER ERROR:",
      error
    );

    setStatus("not_started");

    setError(
      error?.response?.data?.message ||
      error?.message ||
      "Unable to start DigiLocker verification."
    );
  }
};


const checkVerificationStatus = async () => {
  try {

    setError("");
    setCheckingStatus(true);

    const response =
      await checkDigiLockerStatus(merchantId);

    console.log(
      "DIGILOCKER STATUS RESPONSE:",
      response
    );

    if (
      response?.success &&
      response?.verified === true
    ) {

      setStatus("success");

      return;
    }

    setStatus("link_generated");

    setError(
      "DigiLocker verification is not completed yet. Please complete the verification and try again."
    );

  } catch (error) {

    console.error(
      "DIGILOCKER STATUS ERROR:",
      error
    );

    setError(
      error?.response?.data?.message ||
      error?.message ||
      "Unable to check DigiLocker status."
    );

  } finally {

    setCheckingStatus(false);

  }
};
  const handleContinue = () => {
    // if (status !== "success") {
    //   setError(
    //     "Please complete DigiLocker verification before continuing."
    //   );
    //   return;
    // }

    navigate(
  `/agent/merchant/${merchantId}/ubo`
);
  };

  return (
    <div className="digilocker-page">
      <div className="digilocker-container">

        {/* HEADER */}
        <div className="digilocker-header">
          <p className="digilocker-step">STEP 08 OF 12</p>

          <h1>DigiLocker Verification</h1>

          <p>
            Verify the merchant's identity through DigiLocker before
            proceeding to the next onboarding stage.
          </p>
        </div>


        {/* PROGRESS */}
        <div className="digilocker-progress-card">

          {[
            ["✓", "Basic Details", "completed"],
            ["✓", "PAN & DOB", "completed"],
            ["✓", "CKYC", "completed"],
            ["✓", "Bank Details", "completed"],
            ["✓", "Business Details", "completed"],
            ["✓", "Website", "completed"],
            ["✓", "Signing Authority", "completed"],
            ["8", "DigiLocker", "active"],
          ].map((item, index) => (
            <div
              className="digilocker-progress-wrapper"
              key={item[1]}
            >

              <div
                className={`digilocker-progress-item ${item[2]}`}
              >

                <div className="digilocker-progress-circle">
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

              {index < 7 && (
                <div className="digilocker-progress-line active" />
              )}

            </div>
          ))}

        </div>


        {/* ERROR */}
        {error && (
          <div className="digilocker-alert">

            <div className="digilocker-alert-icon">
              !
            </div>

            <span>{error}</span>

          </div>
        )}


        {/* VERIFICATION CARD */}
        <section className="digilocker-section">

          <div className="digilocker-section-heading">

            <div className="digilocker-section-icon">
              DL
            </div>

            <div>
              <h2>Identity Verification</h2>

              <p>
                Connect and verify the merchant through DigiLocker.
              </p>
            </div>

          </div>


          {/* STATUS */}
          <div className={`digilocker-status-card ${status}`}>

            <div className="digilocker-status-icon">

              {status === "not_started" && "D"}

              {status === "processing" && "..."}

               {status === "link_generated" && "🔗"}

              {status === "success" && "✓"}

            </div>


            <div className="digilocker-status-content">

              {status === "not_started" && (
                <>
                  <strong>Verification Not Started</strong>

                  <p>
                    Start DigiLocker verification to continue
                    the merchant onboarding process.
                  </p>
                </>
              )}


              {status === "processing" && (
                <>
                  <strong>Verification In Progress</strong>

                  <p>
                    Please wait while DigiLocker verification
                    is being completed.
                  </p>
                </>
              )}


{status === "link_generated" && (
  <>
    <strong>DigiLocker Link Generated</strong>

    <p>
      Your DigiLocker verification link is ready.
      Click the button below to complete verification.
    </p>
  </>
)}

              {status === "success" && (
                <>
                  <strong>Verification Successful</strong>

                  <p>
                    DigiLocker verification has been completed
                    successfully.
                  </p>
                </>
              )}

            </div>


            {status === "success" && (
              <div className="digilocker-success-badge">
                Verified
              </div>
            )}

          </div>


          {/* ACTION */}
         {status === "not_started" && (
  <button
    type="button"
    className="digilocker-start-btn"
    onClick={startVerification}
  >
    Start DigiLocker Verification
  </button>
)}

{status === "processing" && (
  <button
    type="button"
    className="digilocker-start-btn"
    disabled
  >
    Generating DigiLocker Link...
  </button>
)}

{status === "link_generated" && (
  <div className="digilocker-link-actions">

    <button
      type="button"
      className="digilocker-start-btn"
      onClick={() => {
        window.open(
          captureLink,
          "_blank",
          "noopener,noreferrer"
        );
      }}
    >
      Click Here to Complete DigiLocker Verification
      <span> →</span>
    </button>

    <button
      type="button"
      className="digilocker-check-btn"
      onClick={checkVerificationStatus}
      disabled={checkingStatus}
    >
      {checkingStatus
        ? "Checking Verification Status..."
        : "Check Verification Status"}
    </button>

  </div>
)}

        </section>


        {/* REQUIREMENT */}
        <section className="digilocker-section">

          <div className="digilocker-section-heading">

            <div className="digilocker-section-icon small">
              ✓
            </div>

            <div>
              <h2>Verification Requirement</h2>

              <p>
                DigiLocker must be successfully completed before VKYC.
              </p>
            </div>

          </div>


          <div className="digilocker-check-list">

            <div className="digilocker-check-item">
              <span>✓</span>
              Merchant identity verification
            </div>

            <div className="digilocker-check-item">
              <span>✓</span>
              KYC information validation
            </div>

            <div className="digilocker-check-item">
              <span>✓</span>
              Required before Video KYC
            </div>

          </div>

        </section>


        {/* INFO */}
        <div className="digilocker-info">

          <div className="digilocker-info-icon">
            i
          </div>

          <div>

            <strong>Important</strong>

            <p>
              Do not proceed to Video KYC until DigiLocker verification
              is successfully completed.
            </p>

          </div>

        </div>


        {/* ACTIONS */}
        <div className="digilocker-actions">

          <button
            type="button"
            className="digilocker-btn secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <button
            type="button"
            className="digilocker-btn primary"
            onClick={handleContinue}
            // disabled={status !== "success"}
          >
            Continue
            <span>→</span>
          </button>

        </div>

      </div>
    </div>
  );
}