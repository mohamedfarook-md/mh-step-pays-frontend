import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PendingApplications.css";

const PendingApplications = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ======================================================
  // TEMPORARY UI DATA
  // Later this will come from backend API
  // ======================================================

  const applications = [
    {
      id: "APP-1001",
      merchantId: "8801432",
      merchantName: "MOHAMED ISKULLA SIDDIQ ALI",
      businessName: "MOHAMED ISKULLA SIDDIQ ALI",
      entityType: "Individual",
      agent: "Agent Farook",
      mobile: "9876543292",
      currentStep: "VKYC",
      kycStatus: "Completed",
      documentStatus: "Approved",
      vkycStatus: "Pending",
      submittedDate: "13 Aug 2026",
      status: "Pending Review",
    },
    {
      id: "APP-1002",
      merchantId: "8801433",
      merchantName: "ARUN KUMAR",
      businessName: "ARUN TRADERS",
      entityType: "Proprietorship",
      agent: "Agent Rahman",
      mobile: "9876543211",
      currentStep: "Documents",
      kycStatus: "Completed",
      documentStatus: "Pending",
      vkycStatus: "Not Started",
      submittedDate: "13 Aug 2026",
      status: "Pending Review",
    },
    {
      id: "APP-1003",
      merchantId: "8801434",
      merchantName: "PRIYA S",
      businessName: "PRIYA SERVICES",
      entityType: "Individual",
      agent: "Agent Imran",
      mobile: "9876543255",
      currentStep: "DigiLocker",
      kycStatus: "Completed",
      documentStatus: "Pending",
      vkycStatus: "Not Eligible",
      submittedDate: "12 Aug 2026",
      status: "Documents Pending",
    },
    {
      id: "APP-1004",
      merchantId: "8801435",
      merchantName: "SRI GANESH STORES",
      businessName: "SRI GANESH STORES",
      entityType: "Partnership",
      agent: "Agent Mohammed",
      mobile: "9876543288",
      currentStep: "Admin Review",
      kycStatus: "Completed",
      documentStatus: "Approved",
      vkycStatus: "Approved",
      submittedDate: "12 Aug 2026",
      status: "Ready for Approval",
    },
  ];

  // ======================================================
  // FILTER
  // ======================================================

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !query ||
        application.merchantName.toLowerCase().includes(query) ||
        application.businessName.toLowerCase().includes(query) ||
        application.merchantId.toString().includes(query) ||
        application.mobile.includes(query) ||
        application.agent.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  // ======================================================
  // STATUS CLASS
  // ======================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Ready for Approval":
        return "status-ready";

      case "Documents Pending":
        return "status-warning";

      case "Pending Review":
        return "status-pending";

      default:
        return "";
    }
  };

  const getStepClass = (step) => {
    if (step === "Admin Review") {
      return "step-admin";
    }

    if (step === "VKYC") {
      return "step-vkyc";
    }

    if (step === "Documents") {
      return "step-documents";
    }

    return "step-default";
  };

  // ======================================================
  // REVIEW
  // ======================================================

  const handleReview = (application) => {
    navigate(
      `/admin/merchant-review/${application.merchantId}`
    );
  };

  return (
    <div className="pending-applications-page">

      <div className="pending-applications-container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="pending-header">

          <div>

            <div className="pending-breadcrumb">
              Admin / Merchant Review
            </div>

            <h1>
              Pending Applications
            </h1>

            <p>
              Review merchant onboarding applications submitted
              by field agents.
            </p>

          </div>

          <div className="pending-count-card">

            <span>
              Pending
            </span>

            <strong>
              {applications.length}
            </strong>

          </div>

        </div>


        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="pending-summary-grid">

          <div className="pending-summary-card">

            <div className="summary-icon blue">
              ◷
            </div>

            <div>
              <span>
                Total Applications
              </span>

              <strong>
                {applications.length}
              </strong>
            </div>

          </div>


          <div className="pending-summary-card">

            <div className="summary-icon orange">
              !
            </div>

            <div>
              <span>
                Pending Review
              </span>

              <strong>
                {
                  applications.filter(
                    (item) =>
                      item.status === "Pending Review"
                  ).length
                }
              </strong>
            </div>

          </div>


          <div className="pending-summary-card">

            <div className="summary-icon purple">
              ◉
            </div>

            <div>
              <span>
                Documents Pending
              </span>

              <strong>
                {
                  applications.filter(
                    (item) =>
                      item.status === "Documents Pending"
                  ).length
                }
              </strong>
            </div>

          </div>


          <div className="pending-summary-card">

            <div className="summary-icon green">
              ✓
            </div>

            <div>
              <span>
                Ready for Approval
              </span>

              <strong>
                {
                  applications.filter(
                    (item) =>
                      item.status === "Ready for Approval"
                  ).length
                }
              </strong>
            </div>

          </div>

        </div>


        {/* ==================================================
            FILTER BAR
        ================================================== */}

        <div className="pending-filter-card">

          <div className="pending-search">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search merchant, MID, mobile or agent..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}

          </div>


          <div className="pending-filter">

            <label>
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">
                All
              </option>

              <option value="Pending Review">
                Pending Review
              </option>

              <option value="Documents Pending">
                Documents Pending
              </option>

              <option value="Ready for Approval">
                Ready for Approval
              </option>
            </select>

          </div>

        </div>


        {/* ==================================================
            APPLICATIONS
        ================================================== */}

        <div className="pending-list-card">

          <div className="pending-list-header">

            <div>

              <h2>
                Merchant Applications
              </h2>

              <p>
                {filteredApplications.length} application
                {filteredApplications.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>

            </div>

          </div>


          {/* ==================================================
              DESKTOP TABLE
          ================================================== */}

          <div className="applications-table-wrapper">

            <table className="applications-table">

              <thead>

                <tr>

                  <th>
                    Merchant
                  </th>

                  <th>
                    Entity
                  </th>

                  <th>
                    Agent
                  </th>

                  <th>
                    Current Step
                  </th>

                  <th>
                    Verification
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredApplications.map(
                  (application) => (

                    <tr key={application.id}>

                      <td>

                        <div className="merchant-cell">

                          <div className="merchant-avatar">
                            {application.merchantName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {application.merchantName}
                            </strong>

                            <span>
                              MID: {application.merchantId}
                            </span>

                            <small>
                              {application.mobile}
                            </small>

                          </div>

                        </div>

                      </td>


                      <td>

                        <span className="entity-badge">
                          {application.entityType}
                        </span>

                      </td>


                      <td>

                        <div className="agent-cell">

                          <strong>
                            {application.agent}
                          </strong>

                          <span>
                            {application.submittedDate}
                          </span>

                        </div>

                      </td>


                      <td>

                        <span
                          className={`step-badge ${getStepClass(
                            application.currentStep
                          )}`}
                        >
                          {application.currentStep}
                        </span>

                      </td>


                      <td>

                        <div className="verification-cell">

                          <span>
                            KYC{" "}
                            <b className="mini-success">
                              ✓
                            </b>
                          </span>

                          <span>
                            Docs{" "}
                            <b
                              className={
                                application.documentStatus ===
                                "Approved"
                                  ? "mini-success"
                                  : "mini-warning"
                              }
                            >
                              {application.documentStatus ===
                              "Approved"
                                ? "✓"
                                : "!"}
                            </b>
                          </span>

                          <span>
                            VKYC{" "}
                            <b
                              className={
                                application.vkycStatus ===
                                "Approved"
                                  ? "mini-success"
                                  : "mini-warning"
                              }
                            >
                              {application.vkycStatus ===
                              "Approved"
                                ? "✓"
                                : "!"}
                            </b>
                          </span>

                        </div>

                      </td>


                      <td>

                        <span
                          className={`application-status ${getStatusClass(
                            application.status
                          )}`}
                        >
                          <i />
                          {application.status}
                        </span>

                      </td>


                      <td>

                        <button
                          type="button"
                          className="review-button"
                          onClick={() =>
                            handleReview(application)
                          }
                        >
                          Review
                          <span>
                            →
                          </span>
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>


          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {filteredApplications.length === 0 && (

            <div className="pending-empty">

              <div className="empty-icon">
                ⌕
              </div>

              <h3>
                No applications found
              </h3>

              <p>
                Try changing your search or status filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
              >
                Clear Filters
              </button>

            </div>

          )}

        </div>


        {/* ==================================================
            FOOTER NOTE
        ================================================== */}

        <div className="pending-footer-note">

          <span>
            i
          </span>

          <p>
            Applications remain pending until all required
            onboarding checks are completed and approved
            by an administrator.
          </p>

        </div>

      </div>

    </div>
  );
};

export default PendingApplications;