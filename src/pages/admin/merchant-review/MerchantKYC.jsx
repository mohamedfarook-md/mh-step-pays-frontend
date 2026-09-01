import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MerchantKYC.css";

const MerchantKYC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [remarks, setRemarks] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  // ======================================================
  // TEMPORARY UI DATA
  // Backend integration later
  // ======================================================

  const merchant = {
    merchantId: id || "8801432",
    applicationId: "APP-1001",
    name: "MOHAMED ISKULLA SIDDIQ ALI",
    businessName: "MOHAMED ISKULLA SIDDIQ ALI",
    entityType: "Individual",
    mobile: "9876543292",
    email: "merchant.test5@mhsteppays.com",
    pan: "MZQPS3599M",
    dob: "06 Dec 1999",
    agent: "Agent Farook",
  };

  // ======================================================
  // KYC VERIFICATION DATA
  // ======================================================

  const verificationItems = [
    {
      id: "pan",
      title: "PAN Verification",
      description: "PAN details verified against submitted merchant information.",
      document: "PAN Card",
      value: merchant.pan,
      status: "Verified",
      date: "13 Aug 2026, 10:32 AM",
      verifiedBy: "System Verification",
    },
    {
      id: "ckyc",
      title: "CKYC Verification",
      description: "Central KYC record verification completed successfully.",
      document: "CKYC Record",
      value: "CKYC Verified",
      status: "Verified",
      date: "13 Aug 2026, 10:35 AM",
      verifiedBy: "System Verification",
    },
    {
      id: "identity",
      title: "Identity Verification",
      description: "Merchant identity information has been verified.",
      document: "Identity Proof",
      value: "Verified",
      status: "Verified",
      date: "13 Aug 2026, 10:38 AM",
      verifiedBy: "Agent Farook",
    },
    {
      id: "digilocker",
      title: "DigiLocker Verification",
      description: "Identity information retrieved through DigiLocker.",
      document: "DigiLocker",
      value: "Verified",
      status: "Verified",
      date: "13 Aug 2026, 10:41 AM",
      verifiedBy: "DigiLocker",
    },
  ];

  // ======================================================
  // SIGNING AUTHORITY
  // ======================================================

  const signingAuthority = {
    name: merchant.name,
    mobile: merchant.mobile,
    email: merchant.email,
    designation: "Owner",
    authorityType: "Self",
    verificationStatus: "Verified",
  };

  // ======================================================
  // HELPER
  // ======================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Verified":
        return "kyc-status-verified";

      case "Pending":
        return "kyc-status-pending";

      case "Rejected":
        return "kyc-status-rejected";

      default:
        return "";
    }
  };

  // ======================================================
  // ACTIONS
  // ======================================================

  const handleDocumentView = (item) => {
    // UI-only for now
    console.log("View KYC document:", item);
  };

  const handleApprove = () => {
    setSelectedAction("approved");
  };

  const handleReject = () => {
    setSelectedAction("rejected");
  };

  const handleContinue = () => {
    navigate(
      `/admin/merchant-review/${merchant.merchantId}/documents`
    );
  };

  return (
    <div className="merchant-kyc-page">

      <div className="merchant-kyc-container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="merchant-kyc-header">

          <div>

            <div className="kyc-breadcrumb">
              Admin / Merchant Review / KYC
            </div>

            <h1>
              KYC Review
            </h1>

            <p>
              Review and verify the merchant's KYC information
              before proceeding to document and VKYC review.
            </p>

          </div>

          <div className="kyc-header-actions">

            <span className="kyc-application-badge">
              Application: {merchant.applicationId}
            </span>

            <button
              type="button"
              className="kyc-back-button"
              onClick={() =>
                navigate(
                  `/admin/merchant-review/${merchant.merchantId}`
                )
              }
            >
              ← Merchant Review
            </button>

          </div>

        </div>


        {/* ==================================================
            MERCHANT SUMMARY
        ================================================== */}

        <section className="kyc-merchant-card">

          <div className="kyc-merchant-main">

            <div className="kyc-merchant-avatar">
              {merchant.name.charAt(0)}
            </div>

            <div>

              <h2>
                {merchant.name}
              </h2>

              <p>
                {merchant.businessName}
              </p>

              <div className="kyc-merchant-tags">

                <span>
                  MID: {merchant.merchantId}
                </span>

                <span>
                  {merchant.entityType}
                </span>

                <span>
                  Agent: {merchant.agent}
                </span>

              </div>

            </div>

          </div>

          <div className="kyc-summary-status">

            <span>
              KYC STATUS
            </span>

            <strong>
              <i />
              Verification Complete
            </strong>

          </div>

        </section>


        {/* ==================================================
            KYC PROGRESS
        ================================================== */}

        <div className="kyc-progress-card">

          <div className="kyc-progress-item completed">

            <div className="kyc-progress-circle">
              ✓
            </div>

            <div>
              <strong>
                Merchant Details
              </strong>

              <span>
                Completed
              </span>
            </div>

          </div>

          <div className="kyc-progress-line active" />

          <div className="kyc-progress-item active">

            <div className="kyc-progress-circle">
              02
            </div>

            <div>
              <strong>
                KYC Review
              </strong>

              <span>
                Current
              </span>
            </div>

          </div>

          <div className="kyc-progress-line" />

          <div className="kyc-progress-item">

            <div className="kyc-progress-circle">
              03
            </div>

            <div>
              <strong>
                Documents
              </strong>

              <span>
                Next
              </span>
            </div>

          </div>

          <div className="kyc-progress-line" />

          <div className="kyc-progress-item">

            <div className="kyc-progress-circle">
              04
            </div>

            <div>
              <strong>
                VKYC
              </strong>

              <span>
                Pending
              </span>
            </div>

          </div>

        </div>


        {/* ==================================================
            BASIC KYC DETAILS
        ================================================== */}

        <section className="kyc-section">

          <div className="kyc-section-header">

            <div>

              <h2>
                Merchant KYC Details
              </h2>

              <p>
                Basic identity information submitted during onboarding.
              </p>

            </div>

            <span className="section-verified">
              ✓ Verified
            </span>

          </div>


          <div className="kyc-details-grid">

            <div className="kyc-detail-item">

              <span>
                Full Name
              </span>

              <strong>
                {merchant.name}
              </strong>

            </div>


            <div className="kyc-detail-item">

              <span>
                Entity Type
              </span>

              <strong>
                {merchant.entityType}
              </strong>

            </div>


            <div className="kyc-detail-item">

              <span>
                PAN Number
              </span>

              <strong>
                {merchant.pan}
              </strong>

            </div>


            <div className="kyc-detail-item">

              <span>
                Date of Birth
              </span>

              <strong>
                {merchant.dob}
              </strong>

            </div>


            <div className="kyc-detail-item">

              <span>
                Mobile Number
              </span>

              <strong>
                {merchant.mobile}
              </strong>

            </div>


            <div className="kyc-detail-item">

              <span>
                Email Address
              </span>

              <strong className="break-text">
                {merchant.email}
              </strong>

            </div>

          </div>

        </section>


        {/* ==================================================
            VERIFICATION ITEMS
        ================================================== */}

        <section className="kyc-section">

          <div className="kyc-section-header">

            <div>

              <h2>
                KYC Verification
              </h2>

              <p>
                Review each verification result and supporting information.
              </p>

            </div>

          </div>


          <div className="kyc-verification-list">

            {verificationItems.map((item) => (

              <div
                className="kyc-verification-card"
                key={item.id}
              >

                <div className="kyc-verification-icon">
                  ✓
                </div>


                <div className="kyc-verification-content">

                  <div className="kyc-verification-title">

                    <h3>
                      {item.title}
                    </h3>

                    <span
                      className={`kyc-status ${getStatusClass(
                        item.status
                      )}`}
                    >
                      <i />
                      {item.status}
                    </span>

                  </div>

                  <p>
                    {item.description}
                  </p>


                  <div className="kyc-verification-meta">

                    <div>

                      <span>
                        Document / Source
                      </span>

                      <strong>
                        {item.document}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Value
                      </span>

                      <strong>
                        {item.value}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Verified By
                      </span>

                      <strong>
                        {item.verifiedBy}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Verified On
                      </span>

                      <strong>
                        {item.date}
                      </strong>

                    </div>

                  </div>

                </div>


                <button
                  type="button"
                  className="kyc-view-button"
                  onClick={() =>
                    handleDocumentView(item)
                  }
                >
                  View
                </button>

              </div>

            ))}

          </div>

        </section>


        {/* ==================================================
            SIGNING AUTHORITY
        ================================================== */}

        <section className="kyc-section">

          <div className="kyc-section-header">

            <div>

              <h2>
                Signing Authority
              </h2>

              <p>
                Person authorized to represent the merchant.
              </p>

            </div>

            <span className="section-verified">
              ✓ Verified
            </span>

          </div>


          <div className="signing-authority-card">

            <div className="authority-avatar">
              {signingAuthority.name.charAt(0)}
            </div>

            <div className="authority-main">

              <h3>
                {signingAuthority.name}
              </h3>

              <span>
                {signingAuthority.designation}
              </span>

            </div>


            <div className="authority-details">

              <div>

                <span>
                  Mobile
                </span>

                <strong>
                  {signingAuthority.mobile}
                </strong>

              </div>

              <div>

                <span>
                  Email
                </span>

                <strong>
                  {signingAuthority.email}
                </strong>

              </div>

              <div>

                <span>
                  Authority Type
                </span>

                <strong>
                  {signingAuthority.authorityType}
                </strong>

              </div>

            </div>


            <span className="authority-verified">
              ✓ Verified
            </span>

          </div>

        </section>


        {/* ==================================================
            ADMIN DECISION
        ================================================== */}

        <section className="kyc-section">

          <div className="kyc-section-header">

            <div>

              <h2>
                Admin Decision
              </h2>

              <p>
                Record your review decision for the KYC section.
              </p>

            </div>

          </div>


          <div className="kyc-decision-area">

            <div className="decision-options">

              <button
                type="button"
                className={`decision-button approve ${
                  selectedAction === "approved"
                    ? "selected"
                    : ""
                }`}
                onClick={handleApprove}
              >

                <span className="decision-icon">
                  ✓
                </span>

                <span>
                  <strong>
                    KYC Approved
                  </strong>

                  <small>
                    KYC information is satisfactory.
                  </small>
                </span>

              </button>


              <button
                type="button"
                className={`decision-button reject ${
                  selectedAction === "rejected"
                    ? "selected"
                    : ""
                }`}
                onClick={handleReject}
              >

                <span className="decision-icon">
                  ×
                </span>

                <span>
                  <strong>
                    Request Correction
                  </strong>

                  <small>
                    KYC information requires correction.
                  </small>
                </span>

              </button>

            </div>


            <div className="remarks-group">

              <label>
                Admin Remarks
                <span>
                  Optional
                </span>
              </label>

              <textarea
                value={remarks}
                onChange={(e) =>
                  setRemarks(e.target.value)
                }
                placeholder="Enter any remarks or verification notes..."
                rows={4}
              />

            </div>

          </div>

        </section>


        {/* ==================================================
            NOTICE
        ================================================== */}

        <div className="kyc-review-notice">

          <div className="notice-icon">
            i
          </div>

          <div>

            <strong>
              Review before proceeding
            </strong>

            <p>
              Once KYC review is completed, continue to the
              document review stage. Final merchant approval
              will only be available after all required checks,
              including VKYC, are completed.
            </p>

          </div>

        </div>


        {/* ==================================================
            FOOTER ACTIONS
        ================================================== */}

        <div className="kyc-footer-actions">

          <button
            type="button"
            className="kyc-secondary-button"
            onClick={() =>
              navigate(
                `/admin/merchant-review/${merchant.merchantId}`
              )
            }
          >
            ← Back to Review
          </button>


          <button
            type="button"
            className="kyc-primary-button"
            onClick={handleContinue}
          >
            Continue to Documents
            <span>
              →
            </span>
          </button>

        </div>

      </div>

    </div>
  );
};

export default MerchantKYC;