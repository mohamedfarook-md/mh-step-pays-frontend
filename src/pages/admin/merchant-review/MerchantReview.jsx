import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MerchantReview.css";

const MerchantReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

    category: "Professional Services",
    subCategory: "Matrimony",

    monthlyVolume: "₹5,00,000",

    agent: "Agent Farook",
    submittedDate: "13 Aug 2026",

    overallStatus: "Pending Review",
  };

  // ======================================================
  // ONBOARDING STEPS
  // ======================================================

  const onboardingSteps = [
    {
      number: "01",
      title: "Basic Details",
      description: "Merchant information",
      status: "completed",
    },
    {
      number: "02",
      title: "PAN & DOB",
      description: "PAN verification",
      status: "completed",
    },
    {
      number: "03",
      title: "CKYC",
      description: "CKYC verification",
      status: "completed",
    },
    {
      number: "04",
      title: "Bank Details",
      description: "Bank verification",
      status: "completed",
    },
    {
      number: "05",
      title: "Business Details",
      description: "Business information",
      status: "completed",
    },
    {
      number: "06",
      title: "Website",
      description: "Website verification",
      status: "completed",
    },
    {
      number: "07",
      title: "Signing Authority",
      description: "Authorized signatory",
      status: "completed",
    },
    {
      number: "08",
      title: "DigiLocker",
      description: "Identity verification",
      status: "completed",
    },
    {
      number: "09",
      title: "UBO / Members",
      description: "Ownership details",
      status: "completed",
    },
    {
      number: "10",
      title: "Documents",
      description: "Required documents",
      status: "completed",
    },
    {
      number: "11",
      title: "VKYC",
      description: "Video KYC",
      status: "pending",
    },
    {
      number: "12",
      title: "Agreement",
      description: "Final agreement",
      status: "locked",
    },
  ];

  // ======================================================
  // STATUS HELPERS
  // ======================================================

  const getStatusClass = (status) => {
    if (status === "completed") return "review-status-completed";
    if (status === "pending") return "review-status-pending";
    if (status === "locked") return "review-status-locked";

    return "";
  };

  const getStatusText = (status) => {
    if (status === "completed") return "Completed";
    if (status === "pending") return "Pending";
    if (status === "locked") return "Locked";

    return status;
  };

  // ======================================================
  // SECTION NAVIGATION
  // ======================================================

  const handleReviewSection = (title) => {
    switch (title) {
      case "PAN & DOB":
      case "CKYC":
      case "DigiLocker":
        navigate(`/admin/merchant-review/${merchant.merchantId}/kyc`);
        break;

      case "Documents":
        navigate(
          `/admin/merchant-review/${merchant.merchantId}/documents`
        );
        break;

      case "VKYC":
        navigate(
          `/admin/merchant-review/${merchant.merchantId}/vkyc`
        );
        break;

      case "Agreement":
        break;

      default:
        break;
    }
  };

  return (
    <div className="merchant-review-page">

      <div className="merchant-review-container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="merchant-review-header">

          <div>

            <div className="review-breadcrumb">
              Admin / Merchant Review / {merchant.merchantId}
            </div>

            <h1>
              Merchant Review
            </h1>

            <p>
              Review the complete merchant onboarding application
              before final approval.
            </p>

          </div>


          <div className="review-header-actions">

            <span className="overall-status">
              <i />
              {merchant.overallStatus}
            </span>

            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate("/admin/merchant-review")
              }
            >
              ← Applications
            </button>

          </div>

        </div>


        {/* ==================================================
            MERCHANT PROFILE
        ================================================== */}

        <section className="merchant-profile-card">

          <div className="merchant-profile-main">

            <div className="merchant-profile-avatar">
              {merchant.name.charAt(0)}
            </div>

            <div>

              <h2>
                {merchant.name}
              </h2>

              <p>
                {merchant.businessName}
              </p>

              <div className="merchant-profile-tags">

                <span>
                  MID: {merchant.merchantId}
                </span>

                <span>
                  {merchant.entityType}
                </span>

                <span>
                  {merchant.category}
                </span>

              </div>

            </div>

          </div>


          <div className="merchant-profile-meta">

            <div>
              <span>
                Agent
              </span>

              <strong>
                {merchant.agent}
              </strong>
            </div>

            <div>
              <span>
                Submitted
              </span>

              <strong>
                {merchant.submittedDate}
              </strong>
            </div>

          </div>

        </section>


        {/* ==================================================
            QUICK INFORMATION
        ================================================== */}

        <div className="review-info-grid">

          <div className="review-info-card">

            <span>
              Mobile Number
            </span>

            <strong>
              {merchant.mobile}
            </strong>

          </div>


          <div className="review-info-card">

            <span>
              Email
            </span>

            <strong className="break-text">
              {merchant.email}
            </strong>

          </div>


          <div className="review-info-card">

            <span>
              PAN Number
            </span>

            <strong>
              {merchant.pan}
            </strong>

          </div>


          <div className="review-info-card">

            <span>
              Date of Birth
            </span>

            <strong>
              {merchant.dob}
            </strong>

          </div>


          <div className="review-info-card">

            <span>
              Business Category
            </span>

            <strong>
              {merchant.subCategory}
            </strong>

          </div>


          <div className="review-info-card">

            <span>
              Expected Monthly Volume
            </span>

            <strong>
              {merchant.monthlyVolume}
            </strong>

          </div>

        </div>


        {/* ==================================================
            ONBOARDING PROGRESS
        ================================================== */}

        <section className="review-section">

          <div className="review-section-header">

            <div>

              <h2>
                Onboarding Progress
              </h2>

              <p>
                Current status of each merchant onboarding stage.
              </p>

            </div>

            <div className="progress-summary">
              <strong>
                10 / 12
              </strong>

              <span>
                steps completed
              </span>
            </div>

          </div>


          <div className="onboarding-progress-bar">

            <div
              className="onboarding-progress-fill"
              style={{ width: "83.33%" }}
            />

          </div>


          <div className="onboarding-step-list">

            {onboardingSteps.map((step) => (

              <div
                className={`onboarding-step ${getStatusClass(
                  step.status
                )}`}
                key={step.number}
              >

                <div className="step-number">
                  {step.status === "completed"
                    ? "✓"
                    : step.number}
                </div>


                <div className="step-content">

                  <strong>
                    {step.title}
                  </strong>

                  <span>
                    {step.description}
                  </span>

                </div>


                <div className="step-right">

                  <span className="step-status-text">
                    {getStatusText(step.status)}
                  </span>


                  {(step.status === "completed" ||
                    step.status === "pending") && (
                    <button
                      type="button"
                      className="step-view-button"
                      onClick={() =>
                        handleReviewSection(step.title)
                      }
                    >
                      {step.status === "pending"
                        ? "Review"
                        : "View"}
                    </button>
                  )}

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* ==================================================
            VERIFICATION SUMMARY
        ================================================== */}

        <section className="review-section">

          <div className="review-section-header">

            <div>

              <h2>
                Verification Summary
              </h2>

              <p>
                Important verification results for this application.
              </p>

            </div>

          </div>


          <div className="verification-summary-grid">

            <div className="verification-summary-card">

              <div className="summary-status-icon success">
                ✓
              </div>

              <div>

                <span>
                  PAN Verification
                </span>

                <strong>
                  Verified
                </strong>

              </div>

            </div>


            <div className="verification-summary-card">

              <div className="summary-status-icon success">
                ✓
              </div>

              <div>

                <span>
                  Bank Verification
                </span>

                <strong>
                  Verified
                </strong>

              </div>

            </div>


            <div className="verification-summary-card">

              <div className="summary-status-icon success">
                ✓
              </div>

              <div>

                <span>
                  DigiLocker
                </span>

                <strong>
                  Approved
                </strong>

              </div>

            </div>


            <div className="verification-summary-card">

              <div className="summary-status-icon warning">
                !
              </div>

              <div>

                <span>
                  VKYC
                </span>

                <strong>
                  Pending
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            REVIEW CHECKLIST
        ================================================== */}

        <section className="review-section">

          <div className="review-section-header">

            <div>

              <h2>
                Admin Review Checklist
              </h2>

              <p>
                Confirm the application is ready for final approval.
              </p>

            </div>

          </div>


          <div className="admin-checklist">

            <div className="admin-check-item">

              <div className="check-circle completed">
                ✓
              </div>

              <div>
                <strong>
                  Merchant details verified
                </strong>

                <span>
                  Basic merchant information is complete.
                </span>
              </div>

            </div>


            <div className="admin-check-item">

              <div className="check-circle completed">
                ✓
              </div>

              <div>
                <strong>
                  KYC verification completed
                </strong>

                <span>
                  Required identity verification is completed.
                </span>
              </div>

            </div>


            <div className="admin-check-item">

              <div className="check-circle completed">
                ✓
              </div>

              <div>
                <strong>
                  Required documents reviewed
                </strong>

                <span>
                  Submitted documents are available for review.
                </span>
              </div>

            </div>


            <div className="admin-check-item">

              <div className="check-circle pending">
                !
              </div>

              <div>
                <strong>
                  VKYC verification
                </strong>

                <span>
                  Complete VKYC before final approval.
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            NEXT ACTION
        ================================================== */}

        <section className="next-action-card">

          <div className="next-action-icon">
            →
          </div>

          <div className="next-action-content">

            <span>
              NEXT ACTION
            </span>

            <h3>
              Complete Video KYC Review
            </h3>

            <p>
              VKYC is currently pending. Complete the VKYC
              verification before proceeding to final approval.
            </p>

          </div>


          <button
            type="button"
            className="next-action-button"
            onClick={() =>
              navigate(
                `/admin/merchant-review/${merchant.merchantId}/vkyc`
              )
            }
          >
            Review VKYC
            <span>→</span>
          </button>

        </section>


        {/* ==================================================
            FOOTER ACTIONS
        ================================================== */}

        <div className="merchant-review-footer">

          <button
            type="button"
            className="footer-secondary-button"
            onClick={() =>
              navigate("/admin/merchant-review")
            }
          >
            ← Back to Applications
          </button>


          <button
            type="button"
            className="footer-primary-button"
            onClick={() =>
              navigate(
                `/admin/merchant-review/${merchant.merchantId}/vkyc`
              )
            }
          >
            Continue Review
            <span>→</span>
          </button>

        </div>

      </div>

    </div>
  );
};

export default MerchantReview;