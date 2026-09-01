import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MerchantDocuments.css";

const MerchantDocuments = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [filter, setFilter] = useState("All");
  const [remarks, setRemarks] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);

  // ======================================================
  // TEMPORARY MERCHANT DATA
  // Backend integration later
  // ======================================================

  const merchant = {
    merchantId: id || "8801432",
    applicationId: "APP-1001",
    name: "MOHAMED ISKULLA SIDDIQ ALI",
    businessName: "MOHAMED ISKULLA SIDDIQ ALI",
    entityType: "Individual",
    agent: "Agent Farook",
    submittedDate: "13 Aug 2026",
  };

  // ======================================================
  // TEMPORARY DOCUMENT DATA
  //
  // Structure intentionally follows the PayU-style
  // category -> document_types -> uploaded document flow.
  // ======================================================

  const documentCategories = [
    {
      id: 103,
      name: "Address Proof of Signing Authority",
      frontendName: "ADDRESS_PROOF_SIGNED_AUTHORITY",
      required: true,
      status: "Pending Review",

      uploadedDocument: {
        documentType: "Aadhar",
        frontendType: "AADHAR",
        fileName: "Aadhar_Address_Proof.pdf",
        uploadedOn: "13 Aug 2026, 10:45 AM",
        status: "Pending",
        issueDate: "",
        expiryDate: "",
      },

      availableTypes: [
        "Passport",
        "Aadhar",
        "Voter's ID",
        "Driving Licence",
        "Utilities Bill",
        "Address Verification Letter from Bank",
      ],
    },

    {
      id: 95,
      name: "Bank Account Proof",
      frontendName: "BANK_PROOF",
      required: true,
      status: "Verified",

      uploadedDocument: {
        documentType: "Cancelled Cheque",
        frontendType: "CC",
        fileName: "Cancelled_Cheque.jpg",
        uploadedOn: "13 Aug 2026, 10:48 AM",
        status: "Approved",
        issueDate: "",
        expiryDate: "",
      },

      availableTypes: [
        "Passbook",
        "Bank Statement",
        "Cancelled Cheque",
        "Bank Verification Letter",
      ],
    },
  ];

  // ======================================================
  // CALCULATE SUMMARY
  // ======================================================

  const totalDocuments = documentCategories.length;

  const approvedDocuments = documentCategories.filter(
    (category) =>
      category.uploadedDocument?.status === "Approved"
  ).length;

  const pendingDocuments = documentCategories.filter(
    (category) =>
      category.uploadedDocument?.status === "Pending"
  ).length;

  const rejectedDocuments = documentCategories.filter(
    (category) =>
      category.uploadedDocument?.status === "Rejected"
  ).length;

  const completionPercentage =
    totalDocuments === 0
      ? 0
      : Math.round(
          (approvedDocuments / totalDocuments) * 100
        );

  // ======================================================
  // FILTER
  // ======================================================

  const filteredCategories = useMemo(() => {
    if (filter === "All") {
      return documentCategories;
    }

    if (filter === "Approved") {
      return documentCategories.filter(
        (category) =>
          category.uploadedDocument?.status === "Approved"
      );
    }

    if (filter === "Pending") {
      return documentCategories.filter(
        (category) =>
          category.uploadedDocument?.status === "Pending"
      );
    }

    if (filter === "Rejected") {
      return documentCategories.filter(
        (category) =>
          category.uploadedDocument?.status === "Rejected"
      );
    }

    return documentCategories;
  }, [filter]);

  // ======================================================
  // STATUS CLASS
  // ======================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
      case "Verified":
        return "document-status-approved";

      case "Pending":
      case "Pending Review":
        return "document-status-pending";

      case "Rejected":
        return "document-status-rejected";

      default:
        return "";
    }
  };

  // ======================================================
  // VIEW DOCUMENT
  // ======================================================

  const handleViewDocument = (document, category) => {
    setSelectedDocument({
      ...document,
      categoryName: category.name,
    });
  };

  // ======================================================
  // CLOSE PREVIEW
  // ======================================================

  const closePreview = () => {
    setSelectedDocument(null);
  };

  // ======================================================
  // APPROVE / REJECT
  // ======================================================

  const handleApprove = (category) => {
    console.log(
      "Approve document:",
      category.frontendName
    );
  };

  const handleReject = (category) => {
    console.log(
      "Reject document:",
      category.frontendName
    );
  };

  // ======================================================
  // CONTINUE
  // ======================================================

  const handleContinue = () => {
    navigate(
      `/admin/merchant-review/${merchant.merchantId}/vkyc`
    );
  };

  return (
    <div className="merchant-documents-page">

      <div className="merchant-documents-container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="documents-header">

          <div>

            <div className="documents-breadcrumb">
              Admin / Merchant Review / Documents
            </div>

            <h1>
              Document Review
            </h1>

            <p>
              Review all required merchant documents before
              proceeding to Video KYC.
            </p>

          </div>

          <div className="documents-header-actions">

            <span className="documents-application-badge">
              Application: {merchant.applicationId}
            </span>

            <button
              type="button"
              className="documents-back-button"
              onClick={() =>
                navigate(
                  `/admin/merchant-review/${merchant.merchantId}/kyc`
                )
              }
            >
              ← KYC Review
            </button>

          </div>

        </div>


        {/* ==================================================
            MERCHANT SUMMARY
        ================================================== */}

        <section className="documents-merchant-card">

          <div className="documents-merchant-main">

            <div className="documents-merchant-avatar">
              {merchant.name.charAt(0)}
            </div>

            <div>

              <h2>
                {merchant.name}
              </h2>

              <p>
                {merchant.businessName}
              </p>

              <div className="documents-merchant-tags">

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

          <div className="documents-submitted">

            <span>
              SUBMITTED
            </span>

            <strong>
              {merchant.submittedDate}
            </strong>

          </div>

        </section>


        {/* ==================================================
            PROGRESS
        ================================================== */}

        <div className="documents-progress-card">

          <div className="document-progress-item completed">

            <div className="document-progress-circle">
              ✓
            </div>

            <div>
              <strong>
                KYC
              </strong>

              <span>
                Completed
              </span>
            </div>

          </div>


          <div className="document-progress-line active" />


          <div className="document-progress-item active">

            <div className="document-progress-circle">
              02
            </div>

            <div>
              <strong>
                Documents
              </strong>

              <span>
                Current
              </span>
            </div>

          </div>


          <div className="document-progress-line" />


          <div className="document-progress-item">

            <div className="document-progress-circle">
              03
            </div>

            <div>
              <strong>
                VKYC
              </strong>

              <span>
                Next
              </span>
            </div>

          </div>


          <div className="document-progress-line" />


          <div className="document-progress-item">

            <div className="document-progress-circle">
              04
            </div>

            <div>
              <strong>
                Approval
              </strong>

              <span>
                Pending
              </span>
            </div>

          </div>

        </div>


        {/* ==================================================
            DOCUMENT SUMMARY
        ================================================== */}

        <div className="document-summary-grid">

          <div className="document-summary-card">

            <div className="document-summary-icon blue">
              ▣
            </div>

            <div>

              <span>
                Required
              </span>

              <strong>
                {totalDocuments}
              </strong>

            </div>

          </div>


          <div className="document-summary-card">

            <div className="document-summary-icon green">
              ✓
            </div>

            <div>

              <span>
                Approved
              </span>

              <strong>
                {approvedDocuments}
              </strong>

            </div>

          </div>


          <div className="document-summary-card">

            <div className="document-summary-icon orange">
              !
            </div>

            <div>

              <span>
                Pending
              </span>

              <strong>
                {pendingDocuments}
              </strong>

            </div>

          </div>


          <div className="document-summary-card">

            <div className="document-summary-icon red">
              ×
            </div>

            <div>

              <span>
                Rejected
              </span>

              <strong>
                {rejectedDocuments}
              </strong>

            </div>

          </div>

        </div>


        {/* ==================================================
            COMPLETION BAR
        ================================================== */}

        <section className="documents-completion-card">

          <div className="documents-completion-top">

            <div>

              <h2>
                Document Completion
              </h2>

              <p>
                {approvedDocuments} of {totalDocuments} required
                documents approved.
              </p>

            </div>

            <strong>
              {completionPercentage}%
            </strong>

          </div>

          <div className="documents-completion-track">

            <div
              className="documents-completion-fill"
              style={{
                width: `${completionPercentage}%`,
              }}
            />

          </div>

        </section>


        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="documents-filter-bar">

          <div>

            <h2>
              Required Documents
            </h2>

            <p>
              Documents required for {merchant.entityType}
              merchant.
            </p>

          </div>


          <div className="documents-filter-buttons">

            {[
              "All",
              "Approved",
              "Pending",
              "Rejected",
            ].map((item) => (

              <button
                type="button"
                key={item}
                className={
                  filter === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(item)
                }
              >
                {item}
              </button>

            ))}

          </div>

        </div>


        {/* ==================================================
            DOCUMENT CATEGORIES
        ================================================== */}

        <div className="document-category-list">

          {filteredCategories.map((category, index) => {

            const document =
              category.uploadedDocument;

            return (
              <section
                className="document-category-card"
                key={category.id}
              >

                {/* Category Header */}

                <div className="document-category-header">

                  <div className="category-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="category-heading">

                    <div className="category-title-row">

                      <h2>
                        {category.name}
                      </h2>

                      <span className="required-badge">
                        Required
                      </span>

                    </div>

                    <span className="category-frontend-name">
                      {category.frontendName}
                    </span>

                  </div>


                  <div className="category-status">

                    <span
                      className={`document-status ${getStatusClass(
                        document?.status
                      )}`}
                    >
                      <i />
                      {document?.status || "Not Uploaded"}
                    </span>

                  </div>

                </div>


                {/* Document Body */}

                {document ? (

                  <div className="uploaded-document-card">

                    <div className="uploaded-file-icon">
                      PDF
                    </div>


                    <div className="uploaded-file-info">

                      <h3>
                        {document.fileName}
                      </h3>

                      <div className="uploaded-file-meta">

                        <span>
                          Type: {document.documentType}
                        </span>

                        <span>
                          Uploaded: {document.uploadedOn}
                        </span>

                      </div>

                    </div>


                    <button
                      type="button"
                      className="document-view-button"
                      onClick={() =>
                        handleViewDocument(
                          document,
                          category
                        )
                      }
                    >
                      View
                    </button>


                    <div className="document-action-buttons">

                      <button
                        type="button"
                        className="document-approve-button"
                        onClick={() =>
                          handleApprove(category)
                        }
                      >
                        ✓ Approve
                      </button>

                      <button
                        type="button"
                        className="document-reject-button"
                        onClick={() =>
                          handleReject(category)
                        }
                      >
                        × Reject
                      </button>

                    </div>

                  </div>

                ) : (

                  <div className="document-not-uploaded">

                    <div className="not-uploaded-icon">
                      !
                    </div>

                    <div>

                      <strong>
                        Document not uploaded
                      </strong>

                      <span>
                        This document is required before
                        the application can proceed.
                      </span>

                    </div>

                  </div>

                )}


                {/* Document Details */}

                {document && (

                  <div className="document-details-row">

                    <div>

                      <span>
                        Document Type
                      </span>

                      <strong>
                        {document.documentType}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Frontend Type
                      </span>

                      <strong>
                        {document.frontendType}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Issue Date
                      </span>

                      <strong>
                        {document.issueDate || "Not Required"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Expiry Date
                      </span>

                      <strong>
                        {document.expiryDate || "Not Required"}
                      </strong>

                    </div>

                  </div>

                )}


                {/* Available Types */}

                <div className="available-document-types">

                  <span>
                    Accepted document types:
                  </span>

                  <div>

                    {category.availableTypes.map(
                      (type) => (

                        <span key={type}>
                          {type}
                        </span>

                      )
                    )}

                  </div>

                </div>

              </section>
            );
          })}

        </div>


        {/* ==================================================
            ADMIN REMARKS
        ================================================== */}

        <section className="documents-remarks-section">

          <div className="documents-section-heading">

            <div>

              <h2>
                Admin Remarks
              </h2>

              <p>
                Add any notes related to document verification.
              </p>

            </div>

            <span>
              Optional
            </span>

          </div>


          <textarea
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
            placeholder="Enter document verification remarks..."
            rows={4}
          />

        </section>


        {/* ==================================================
            NOTICE
        ================================================== */}

        <div className="documents-notice">

          <div className="documents-notice-icon">
            i
          </div>

          <div>

            <strong>
              Document review reminder
            </strong>

            <p>
              All required documents must be reviewed and
              approved before proceeding to the VKYC stage.
              Rejected or missing documents must be corrected
              before final approval.
            </p>

          </div>

        </div>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="documents-footer-actions">

          <button
            type="button"
            className="documents-secondary-button"
            onClick={() =>
              navigate(
                `/admin/merchant-review/${merchant.merchantId}/kyc`
              )
            }
          >
            ← Back to KYC
          </button>


          <button
            type="button"
            className="documents-primary-button"
            onClick={handleContinue}
          >
            Continue to VKYC
            <span>
              →
            </span>
          </button>

        </div>

      </div>


      {/* ====================================================
          DOCUMENT PREVIEW MODAL
      ==================================================== */}

      {selectedDocument && (

        <div
          className="document-preview-overlay"
          onClick={closePreview}
        >

          <div
            className="document-preview-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="document-preview-header">

              <div>

                <span>
                  DOCUMENT PREVIEW
                </span>

                <h2>
                  {selectedDocument.fileName}
                </h2>

              </div>

              <button
                type="button"
                onClick={closePreview}
                className="document-preview-close"
              >
                ×
              </button>

            </div>


            <div className="document-preview-body">

              <div className="document-preview-placeholder">

                <div className="preview-file-icon">
                  PDF
                </div>

                <h3>
                  Document Preview
                </h3>

                <p>
                  {selectedDocument.categoryName}
                </p>

                <span>
                  {selectedDocument.documentType}
                </span>

                <small>
                  Actual document preview will be
                  connected during backend integration.
                </small>

              </div>

            </div>


            <div className="document-preview-footer">

              <button
                type="button"
                className="document-preview-cancel"
                onClick={closePreview}
              >
                Close
              </button>

              <button
                type="button"
                className="document-preview-approve"
                onClick={() => {
                  closePreview();
                  console.log(
                    "Approved:",
                    selectedDocument.fileName
                  );
                }}
              >
                ✓ Approve Document
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default MerchantDocuments;