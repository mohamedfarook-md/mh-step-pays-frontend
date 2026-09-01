import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./VKYC.css";
import {
  createVKYCProfile,
  getMerchant,
  getMerchantStatus,
} from "../../../../services/merchantApi";


const VKYC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [status, setStatus] = useState("ready");
  const [message, setMessage] = useState("");
  const [captureLink, setCaptureLink] = useState("");
  const [loadingMerchant, setLoadingMerchant] = useState(true);

  const [merchant, setMerchant] = useState({
    name: "",
    mobile: "",
    entityType: "",
    kycStatus: "",
    digilockerStatus: "",
    documentStatus: "",
  });

  // ======================================================
  // LOAD MERCHANT
  // ======================================================
// ======================================================
// LOAD MERCHANT
// ======================================================

useEffect(() => {

  const loadMerchant = async () => {

    try {

      setLoadingMerchant(true);
      setMessage("");

      if (!id) {
        setMessage("Merchant ID is missing.");
        return;
      }

      console.log("========== LOAD VKYC MERCHANT ==========");
      console.log("Merchant ID:", id);

      const response = await getMerchant(id);

      console.log("========== MERCHANT RESPONSE ==========");
      console.log(response);

      const merchantData =
        response?.data?.merchant ||
        response?.data ||
        response?.merchant ||
        response;

      console.log("========== MERCHANT DATA ==========");
      console.log(merchantData);

      if (!merchantData) {
        setMessage("Unable to load merchant details.");
        return;
      }

      const merchantDetails = {

        name:
          merchantData.merchantName ||
          merchantData.name ||
          merchantData.businessName ||
          merchantData.business_name ||
          "-",

        mobile:
          merchantData.mobile ||
          merchantData.registered_mobile ||
          merchantData.registeredMobile ||
          "-",

        entityType:
          merchantData.entityType ||
          merchantData.businessEntity ||
          merchantData.business_entity ||
          merchantData.business_type ||
          "-",

        kycStatus:
          merchantData.kycStatus ||
          merchantData.kyc_status?.kyc_status ||
          merchantData.kyc_status ||
          "Completed",

        digilockerStatus:
          merchantData.digilocker?.status ||
          merchantData.digilockerStatus ||
          merchantData.digilocker_status ||
          "Approved",

        documentStatus:
          merchantData.documentVerified === true
            ? "Approved"
            : merchantData.documentStatus ||
              merchantData.document_status ||
              "Pending",
      };

      console.log(
        "========== VKYC MERCHANT DETAILS =========="
      );

      console.log(merchantDetails);

      setMerchant(merchantDetails);

      // ==========================================
      // EXISTING VKYC LINK
      // ==========================================

      const existingCaptureLink =
        merchantData.vkyc?.captureLink ||
        merchantData.vkyc?.capture_link ||
        "";

      if (existingCaptureLink) {

        setCaptureLink(
          existingCaptureLink
        );

        const existingStatus =
          merchantData.vkyc?.status ||
          merchantData.vkyc_status;

        if (
          existingStatus === "LINK_GENERATED" ||
          existingStatus === "link_generated"
        ) {

          setStatus(
            "link-generated"
          );
        }
      }

    } catch (error) {

      console.error(
        "Load Merchant Error:",
        error
      );

      setMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load merchant details."
      );

    } finally {

      setLoadingMerchant(false);

    }

  };

  loadMerchant();

}, [id]);
  // ======================================================
  // CREATE VKYC PROFILE
  // ======================================================

  const handleStartVKYC = async () => {

    if (!id) {
      setMessage(
        "Merchant ID is missing."
      );
      return;
    }

    try {

      setStatus("starting");
      setMessage("");

     const merchantResponse =
  await getMerchant(id);

const refreshedMerchant =
  merchantResponse?.data?.merchant ||
  merchantResponse?.data ||
  merchantResponse?.merchant ||
  merchantResponse;

if (refreshedMerchant) {

  setMerchant({
    name:
      refreshedMerchant.merchantName ||
      refreshedMerchant.name ||
      refreshedMerchant.businessName ||
      refreshedMerchant.business_name ||
      "-",

    mobile:
      refreshedMerchant.mobile ||
      refreshedMerchant.registered_mobile ||
      refreshedMerchant.registeredMobile ||
      "-",

    entityType:
      refreshedMerchant.entityType ||
      refreshedMerchant.businessEntity ||
      refreshedMerchant.business_entity ||
      refreshedMerchant.business_type ||
      "-",

    kycStatus:
      refreshedMerchant.kycStatus ||
      refreshedMerchant.kyc_status?.kyc_status ||
      refreshedMerchant.kyc_status ||
      "Completed",

    digilockerStatus:
      refreshedMerchant.digilocker?.status ||
      refreshedMerchant.digilockerStatus ||
      refreshedMerchant.digilocker_status ||
      "Approved",

    documentStatus:
      refreshedMerchant.documentVerified === true
        ? "Approved"
        : refreshedMerchant.documentStatus ||
          refreshedMerchant.document_status ||
          "Pending",
  });

}

      // ======================================
// GENERATE VKYC LINK
// ======================================

const response = await createVKYCProfile(id);

console.log(
  "========== VKYC RESPONSE =========="
);

console.log(
  JSON.stringify(response, null, 2)
);


      if (!response?.success) {

        setStatus("ready");

        setMessage(
          response?.message ||
          "Unable to generate VKYC link."
        );

        return;
      }


      const generatedLink =
        response?.data?.captureLink ||
        response?.data?.vkyc?.captureLink ||
        response?.data?.payuResponse?.capture_link ||
        null;


      if (!generatedLink) {

        setStatus("ready");

        setMessage(
          "VKYC profile created, but capture link was not received."
        );

        return;
      }


      // Save link in frontend state
      setCaptureLink(
        generatedLink
      );


      setStatus(
        "link-generated"
      );


      setMessage(
        "VKYC link generated successfully. The merchant can now start Video KYC."
      );

    } catch (error) {

      console.error(
        "VKYC Create Error:",
        error
      );

      setStatus("ready");

      setMessage(
        error?.message ||
        "Unable to generate VKYC link."
      );
    }
  };


  // ======================================================
  // OPEN VKYC
  // ======================================================

  const handleOpenVKYC = () => {

    if (!captureLink) {

      setMessage(
        "VKYC capture link is not available."
      );

      return;
    }

    setStatus("in-progress");

    setMessage(
      "Opening Video KYC session..."
    );

    window.open(
      captureLink,
      "_blank",
      "noopener,noreferrer"
    );
  };



  const handleCheckVKYCStatus = async () => {
  try {
    if (!id) {
      setMessage("Merchant ID is missing.");
      return;
    }

    setStatus("starting");
    setMessage("Checking VKYC status...");

    const response = await getMerchantStatus(id);

    console.log(
      "VKYC STATUS RESPONSE:",
      response
    );

    const merchantData =
      response?.data?.merchant ||
      response?.data ||
      response?.merchant ||
      response;

    const vkycStatus =
      merchantData?.vkyc_status ||
      merchantData?.vkyc?.status ||
      "";

    console.log(
      "CURRENT VKYC STATUS:",
      vkycStatus
    );

    if (
      vkycStatus === "completed" ||
      vkycStatus === "COMPLETED"
    ) {
      setStatus("completed");

      setMessage(
        "Video KYC completed successfully."
      );

      return;
    }

    if (
      vkycStatus === "link_generated"
    ) {
      setStatus("link-generated");

      setMessage(
        "Video KYC is not completed yet. Please complete the Video KYC."
      );

      return;
    }

    setStatus("ready");

    setMessage(
      `Current VKYC status: ${vkycStatus || "Unknown"}`
    );

  } catch (error) {

    console.error(
      "VKYC STATUS ERROR:",
      error
    );

    setStatus("ready");

    setMessage(
      error?.response?.data?.message ||
      error?.message ||
      "Unable to check VKYC status."
    );
  }
};
  // ======================================================
  // STATUS TEXT
  // ======================================================

  const getStatusText = () => {

    switch (status) {

      case "ready":
        return "Ready to Start";

      case "starting":
        return "Generating VKYC Link...";

      case "link-generated":
        return "VKYC Link Generated";

      case "in-progress":
        return "VKYC In Progress";

      case "completed":
        return "VKYC Completed";

      case "approved":
        return "VKYC Approved";

      case "rejected":
        return "VKYC Rejected";

      default:
        return "Ready to Start";
    }
  };


  // ======================================================
  // LOADING
  // ======================================================

  if (loadingMerchant) {

    return (
      <div className="vkyc-page">

        <div className="vkyc-container">

          <div className="vkyc-main-card">

            <h2>
              Loading Merchant Details...
            </h2>

          </div>

        </div>

      </div>
    );
  }


  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="vkyc-page">

      <div className="vkyc-container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="vkyc-header">

          <div>

            <p className="vkyc-step">
              STEP 11 OF 12
            </p>

            <h1>
              Video KYC
            </h1>

            <p>
              Complete the merchant's Video KYC
              verification before proceeding to
              the final onboarding stage.
            </p>

          </div>

          <div className="vkyc-status-pill">

            <span className="status-dot" />

            {getStatusText()}

          </div>

        </div>


        {/* ==================================================
            PROGRESS
        ================================================== */}

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
            ["11", "VKYC", "active"],
            ["12", "Agreement", "pending"],
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

                  <strong>
                    {item[1]}
                  </strong>

                  <span>

                    {item[2] === "active"
                      ? "Current step"
                      : item[2] === "pending"
                      ? "Pending"
                      : "Completed"}

                  </span>

                </div>

              </div>

              {index < 11 && (

                <div
                  className={`vkyc-progress-line ${
                    item[2] === "pending"
                      ? ""
                      : "active"
                  }`}
                />

              )}

            </div>

          ))}

        </div>


        {/* ==================================================
            ELIGIBILITY NOTICE
        ================================================== */}

        <div className="vkyc-eligibility">

          <div className="vkyc-info-icon">
            ✓
          </div>

          <div>

            <strong>
              Merchant is eligible for Video KYC
            </strong>

            <p>
              DigiLocker and required document
              verification have been completed.
              VKYC can now be initiated.
            </p>

          </div>

        </div>


        {/* ==================================================
            MERCHANT SUMMARY
        ================================================== */}

        <section className="vkyc-section">

          <div className="vkyc-section-header">

            <div>

              <h2>
                Merchant Details
              </h2>

              <p>
                Verify the merchant information
                before starting Video KYC.
              </p>

            </div>

          </div>


          <div className="vkyc-details-grid">

            <div className="vkyc-detail-item">

              <span>
                Merchant Name
              </span>

              <strong>
                {merchant.name}
              </strong>

            </div>


            <div className="vkyc-detail-item">

              <span>
                Mobile Number
              </span>

              <strong>
                {merchant.mobile}
              </strong>

            </div>


            <div className="vkyc-detail-item">

              <span>
                Business Entity
              </span>

              <strong>
                {merchant.entityType}
              </strong>

            </div>


            <div className="vkyc-detail-item">

              <span>
                KYC Status
              </span>

              <strong className="verified-text">
                ✓ {merchant.kycStatus}
              </strong>

            </div>

          </div>

        </section>


        {/* ==================================================
            VERIFICATION STATUS
        ================================================== */}

        <section className="vkyc-section">

          <div className="vkyc-section-header">

            <div>

              <h2>
                Verification Status
              </h2>

              <p>
                Required onboarding checks before VKYC.
              </p>

            </div>

          </div>


          <div className="vkyc-check-list">

            <div className="vkyc-check-item">

              <div className="check-icon">
                ✓
              </div>

              <div>

                <strong>
                  DigiLocker Verification
                </strong>

                <span>
                  Identity verification completed
                </span>

              </div>

              <b className="approved-badge">
                Approved
              </b>

            </div>


            <div className="vkyc-check-item">

              <div className="check-icon">
                ✓
              </div>

              <div>

                <strong>
                  Document Verification
                </strong>

                <span>
                  Required documents are ready
                </span>

              </div>

              <b className="approved-badge">
                Approved
              </b>

            </div>


            <div className="vkyc-check-item">

              <div className="check-icon">
                ✓
              </div>

              <div>

                <strong>
                  KYC Verification
                </strong>

                <span>
                  Previous KYC checks completed
                </span>

              </div>

              <b className="approved-badge">
                Completed
              </b>

            </div>

          </div>

        </section>


        {/* ==================================================
            VKYC MAIN CARD
        ================================================== */}

        <section className="vkyc-main-card">

          <div className="vkyc-video-icon">
            <span>▶</span>
          </div>

          <h2>
            Start Video KYC
          </h2>

          <p>
            The merchant will need to complete a
            live Video KYC session for identity
            verification.
          </p>


          <div className="vkyc-timing">

            <div className="timing-icon">
              ⏱
            </div>

            <div>

              <strong>
                VKYC Availability
              </strong>

              <span>
                10:00 AM – 5:00 PM
              </span>

            </div>

          </div>


          {message && (

            <div className="vkyc-message">
              {message}
            </div>

          )}


          {/* ================================================
              START
          ================================================= */}

          {status === "ready" && (

            <button
              type="button"
              className="vkyc-primary-btn"
              onClick={handleStartVKYC}
            >

              Start Video KYC

              <span>
                →
              </span>

            </button>

          )}


          {/* ================================================
              LOADING
          ================================================= */}

          {status === "starting" && (

            <button
              type="button"
              className="vkyc-primary-btn"
              disabled
            >

              Generating Link...

            </button>

          )}


          {/* ================================================
              LINK GENERATED
          ================================================= */}

          {status === "link-generated" && (

            <div className="vkyc-link-area">

              <div className="vkyc-link-success">
                ✓ VKYC link generated successfully
              </div>

              <button
                type="button"
                className="vkyc-primary-btn"
                onClick={handleOpenVKYC}
              >

                Open VKYC

                <span>
                  ↗
                </span>

              </button>


              <button
  type="button"
  className="vkyc-secondary-btn"
  onClick={handleCheckVKYCStatus}
>
  Check VKYC Status
</button>

              <p className="vkyc-link-note">

                Open the VKYC session and hand over
                the device to the merchant when
                required.

              </p>

            </div>

          )}


          {/* ================================================
              IN PROGRESS
          ================================================= */}

          {status === "in-progress" && (

            <div className="vkyc-waiting">

              <div className="vkyc-loader" />

              <strong>
                VKYC session opened
              </strong>

              <span>
                Please complete the Video KYC session.
              </span>

            </div>

          )}

        </section>


        {/* ==================================================
            INSTRUCTIONS
        ================================================== */}

        <section className="vkyc-section">

          <div className="vkyc-section-header">

            <div>

              <h2>
                Before Starting VKYC
              </h2>

              <p>
                Make sure the merchant is ready
                before starting the session.
              </p>

            </div>

          </div>


          <div className="vkyc-instructions">

            <div className="instruction-item">

              <span>
                01
              </span>

              <div>

                <strong>
                  Good Internet Connection
                </strong>

                <p>
                  Ensure stable internet connectivity
                  throughout the video session.
                </p>

              </div>

            </div>


            <div className="instruction-item">

              <span>
                02
              </span>

              <div>

                <strong>
                  Proper Lighting
                </strong>

                <p>
                  Merchant's face should be clearly
                  visible during verification.
                </p>

              </div>

            </div>


            <div className="instruction-item">

              <span>
                03
              </span>

              <div>

                <strong>
                  Keep Original Documents Ready
                </strong>

                <p>
                  Keep the relevant original identity
                  documents available if requested.
                </p>

              </div>

            </div>


            <div className="instruction-item">

              <span>
                04
              </span>

              <div>

                <strong>
                  Merchant Must Be Present
                </strong>

                <p>
                  The merchant must personally complete
                  the Video KYC session.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            ADMIN REVIEW NOTICE
        ================================================== */}

        <div className="vkyc-review-notice">

          <div className="review-icon">
            i
          </div>

          <div>

            <strong>
              Final Approval
            </strong>

            <p>
              After VKYC is completed, the merchant
              will remain subject to Admin review and
              final onboarding approval. Agreement
              generation will be handled in the next stage.
            </p>

          </div>

        </div>


        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="vkyc-actions">

          <button
            type="button"
            className="vkyc-secondary-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          {/* <button
            type="button"
            className="vkyc-secondary-btn"
            onClick={() =>
              navigate("/agent/merchants")
            }
          >
            Save & Exit
          </button> */}

          <button
  type="button"
  className="vkyc-primary-btn"
  onClick={() => navigate(`/agent/merchant/${id}/agreement`)}
>
  Next: Agreement →
</button>

        </div>

      </div>

    </div>

  );
};

export default VKYC;