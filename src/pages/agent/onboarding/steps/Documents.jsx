import React, { useMemo, useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
// import {
//   getDocumentChecklist,
//   isDocumentChecklistComplete,
// } from "../../../../config/documentConfig";
import "./Documents.css";
import {
  getMerchant,
  getRequiredDocuments,
  uploadKYCDocument,
} from "../../../../services/merchantApi";


const Documents = () => {
  const navigate = useNavigate();

  const { id: merchantId } = useParams();

  const [entityType, setEntityType] = useState("");
const [documentChecklist, setDocumentChecklist] = useState([]);
const [loadingDocuments, setLoadingDocuments] = useState(true);
const [allDocumentsSubmitted, setAllDocumentsSubmitted] =
  useState(false);

useEffect(() => {

  const loadRequiredDocuments = async () => {

    try {

     

      if (!merchantId) {
        setError(
          "Merchant session not found."
        );
        return;
      }

      const merchantResponse =
        await getMerchant(merchantId);

      if (
        !merchantResponse?.success ||
        !merchantResponse?.data
      ) {
        setError(
          merchantResponse?.message ||
          "Unable to load merchant."
        );
        return;
      }

      const merchant =
        merchantResponse.data;

      setEntityType(
        merchant.entityType || ""
      );

      // ======================================
      // PAYU REQUIRED DOCUMENTS
      // ======================================

      const response =
        await getRequiredDocuments(
          merchantId
        );

      console.log(
        "PAYU REQUIRED DOCUMENTS:",
        response
      );

      if (!response?.success) {
        setError(
          response?.message ||
          "Unable to fetch required documents."
        );
        return;
      }

      const payuData =
        response.data;

      setEntityType(
        payuData.business_entity ||
        merchant.entityType ||
        ""
      );

      const categories =
        payuData.document_categories || [];

      // ======================================
      // ONLY PAYU REQUIRED CATEGORIES
      // ======================================

      // const documents = categories
      //   .filter(
      //     (category) =>
      //       category.kyc_document_status ===
      //       "required"
      //   )
      //   .map((category) => ({

      //     categoryId:
      //       category.id,

      //     categoryName:
      //       category.name,

      //     frontendName:
      //       category.name_on_frontend,

      //     required:
      //       true,

      //     documentTypes:
      //       category.document_types || [],

      //     uploaded: false,

      //   }));


      const documents = categories.map((category) => ({
    categoryId: category.id,

    categoryName:
      category.name,

    frontendName:
      category.name_on_frontend,

    required:
  category.kyc_document_status === "required" ||
  !!category.kyc_document,

    documentTypes:
      category.document_types || [],

    // PayU already submitted document
    uploaded:
      !!category.kyc_document &&
      category.kyc_document.status ===
        "DOCUMENT_SUBMITTED",

    submittedDocument:
      category.kyc_document || null,
  }));
      setDocumentChecklist(
        documents
      );
      const requiredDocs = documents.filter(
  (document) => document.required === true
);

const allSubmitted =
  requiredDocs.length > 0 &&
  requiredDocs.every(
    (document) => document.uploaded === true
  );

setAllDocumentsSubmitted(allSubmitted);

setAllDocumentsSubmitted(allSubmitted);

    } catch (error) {

      console.error(
        "REQUIRED DOCUMENTS ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load required documents."
      );

    } finally {

      setLoadingDocuments(false);

    }

  };

  loadRequiredDocuments();

}, []);

  // ======================================================
  // UPLOADED DOCUMENTS
  //
  // Example:
  // {
  //   pan: {
  //     file: File,
  //     status: "uploaded"
  //   }
  // }
  // ======================================================

  const [uploadedDocuments, setUploadedDocuments] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ======================================================
  // FILE UPLOAD
  // ======================================================

  const handleFileChange = async (
  categoryId,
  event
) => {

  const file =
    event.target.files?.[0];

  if (!file) return;


  // ======================================
  // GET SELECTED DOCUMENT TYPE
  // ======================================

  const selectedType =
    uploadedDocuments[
      `${categoryId}_selected`
    ];

  if (!selectedType?.typeId) {

    setError(
      "Please select a document type first."
    );

    return;
  }


  // ======================================
  // FILE TYPE
  // ======================================

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (!allowedTypes.includes(file.type)) {

    setError(
      "Only PDF, JPG, JPEG and PNG files are allowed."
    );

    return;
  }


  // ======================================
  // FILE SIZE
  // ======================================

  if (file.size > 5 * 1024 * 1024) {

    setError(
      "File size should not exceed 5 MB."
    );

    return;
  }


  try {

    setError("");

    setSuccess(
      "Uploading document..."
    );


    // ======================================
    // MERCHANT ID
    // ======================================

    

    if (!merchantId) {

      setError(
        "Merchant session not found."
      );

      setSuccess("");

      return;
    }


    // ======================================
    // UPLOAD TO OUR BACKEND
    // ======================================

    console.log(
      "========== FRONTEND KYC UPLOAD =========="
    );

    console.log(
      "Merchant ID:",
      merchantId
    );

    console.log(
      "Document Category:",
      categoryId
    );

    console.log(
      "Document Type:",
      selectedType.typeId
    );

    console.log(
      "File:",
      file.name
    );

    console.log(
      "=========================================="
    );


 const response =
  await uploadKYCDocument(
    merchantId,
    file,
    selectedType.categoryName,
    selectedType.documentTypeName
  );
if (!response?.success) {

  setError(
    response?.message ||
    "Document upload failed."
  );

  setSuccess("");

  return;
}
setAllDocumentsSubmitted(
  response?.data?.allDocumentsSubmitted === true
);

    console.log(
      "KYC UPLOAD RESPONSE:",
      response
    );


    if (!response?.success) {

      setError(
        response?.message ||
        "Document upload failed."
      );

      setSuccess("");

      return;
    }
    if (
  response?.data?.allDocumentsSubmitted === true
) {

  setSuccess(
    "All required documents uploaded successfully."
  );

} else {

  setSuccess(
    "Document uploaded successfully."
  );

}


    // ======================================
    // SAVE LOCAL UI STATE
    // ======================================

    setUploadedDocuments(
      (prev) => ({

        ...prev,

        [categoryId]: {

          file,

          status: "uploaded",

          categoryId,

          documentTypeId:
            selectedType.typeId,

          documentTypeName:
            selectedType.documentTypeName,

        },

      })
    );


    setSuccess(
      "Document uploaded successfully."
    );


    setTimeout(() => {

      setSuccess("");

    }, 2500);


  } catch (error) {

    console.error(
      "KYC DOCUMENT UPLOAD ERROR:",
      error
    );

    setSuccess("");

    setError(
      error?.response?.data?.message ||
      error?.message ||
      "Document upload failed."
    );

  }

};
  // ======================================================
  // REMOVE DOCUMENT
  // ======================================================

  const handleRemove = (documentKey) => {
    setUploadedDocuments((prev) => {
      const updated = { ...prev };

      delete updated[documentKey];

      return updated;
    });

    setError("");
  };

  // ======================================================
  // REQUIRED DOCUMENT COUNT
  // ======================================================

 const requiredDocuments =
  documentChecklist.filter(
    (document) => document.required === true
  );

 const uploadedRequiredDocuments =
  requiredDocuments.filter(
    (document) =>
      document.uploaded === true ||
      uploadedDocuments[document.categoryId]
  );

  // ======================================================
  // PROGRESS
  // ======================================================

  const completionPercentage =
    requiredDocuments.length === 0
      ? 100
      : Math.round(
          (uploadedRequiredDocuments.length /
            requiredDocuments.length) *
            100
        );

  // ======================================================
  // CATEGORY GROUPING
  // ======================================================

 const categories = documentChecklist;

  // ======================================================
  // SUBMIT DOCUMENTS
  // ======================================================
const handleContinue = () => {

  if (!allDocumentsSubmitted) {

    setError(
      "Please upload all required documents before continuing."
    );

    return;
  }

  setError("");

  setSuccess(
    "All required documents are uploaded successfully."
  );

  setTimeout(() => {

   navigate(
  `/agent/merchant/${merchantId}/vkyc`
);

  }, 700);
};
  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="documents-page">

      <div className="documents-container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="documents-header">

          <p className="documents-step">
            STEP 10 OF 12
          </p>

          <h1>Documents</h1>

          <p>
            Upload the required documents based on
            the merchant entity and business details.
          </p>

        </div>


        {/* ==================================================
            PROGRESS
        ================================================== */}

        <div className="documents-progress-card">

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
            ["10", "Documents", "active"],
          ].map((item, index) => (

            <div
              className="documents-progress-wrapper"
              key={item[1]}
            >

              <div
                className={`documents-progress-item ${item[2]}`}
              >

                <div className="documents-progress-circle">
                  {item[0]}
                </div>

                <div>

                  <strong>
                    {item[1]}
                  </strong>

                  <span>
                    {item[2] === "active"
                      ? "Current step"
                      : "Completed"}
                  </span>

                </div>

              </div>

              {index < 9 && (
                <div className="documents-progress-line active" />
              )}

            </div>

          ))}

        </div>


        {/* ==================================================
            ALERT
        ================================================== */}

        {error && (

          <div className="documents-alert error">

            <div className="documents-alert-icon">
              !
            </div>

            <span>
              {error}
            </span>

          </div>

        )}


        {success && (

          <div className="documents-alert success">

            <div className="documents-alert-icon">
              ✓
            </div>

            <span>
              {success}
            </span>

          </div>

        )}


        {/* ==================================================
            MERCHANT DOCUMENT REQUIREMENT
        ================================================== */}

        <section className="documents-summary">

          <div className="documents-summary-top">

            <div>

              <span>
                DOCUMENT CHECKLIST
              </span>

              <strong>
                {entityType} Merchant
              </strong>

            </div>

            <div className="documents-percentage">
              {completionPercentage}%
            </div>

          </div>


          <div className="documents-progress-bar">

            <div
              className="documents-progress-fill"
              style={{
                width: `${completionPercentage}%`,
              }}
            />

          </div>


          <div style={{ marginTop: "10px" }}>

            <span
              style={{
                color: "#7b8494",
                fontSize: "12px",
              }}
            >
              {uploadedRequiredDocuments.length} of{" "}
              {requiredDocuments.length} required
              documents uploaded
            </span>

          </div>

        </section>


        {/* ==================================================
            DOCUMENT SECTIONS
        ================================================== */}

       {categories.map((category) => {

 const selected =
  uploadedDocuments[category.categoryId];

const alreadySubmitted =
  category.uploaded === true;

  return (
    <section
      className="documents-section"
      key={category.categoryId}
    >

      {/* CATEGORY HEADER */}

      <div className="documents-section-heading">

        <div className="documents-section-icon">
          DOC
        </div>

        <div>

          <h2>
            {category.categoryName}
          </h2>

          <p>
            Select any one document accepted by PayU.
          </p>

        </div>

      </div>


      {/* DOCUMENT TYPE */}

      <div className="documents-list">

        <div
          className={`document-card ${
  selected || alreadySubmitted ? "uploaded" : ""
}`}
        >

         <div className="document-icon">
  {selected || alreadySubmitted ? "✓" : "DOC"}
</div>


          <div className="document-info">

            <div className="document-title-row">

              <strong>
                {selected?.documentTypeName ||
                  "Select Document Type"}
              </strong>

             {category.required && (
  <span className="required-badge">
    Required
  </span>
)}

            </div>


            {/* DOCUMENT TYPE DROPDOWN */}

            {!selected && !alreadySubmitted && (

              <select
                className="document-type-select"
                value={
                  uploadedDocuments[
                    `${category.categoryId}_selected`
                  ]?.typeId || ""
                }
                onChange={(e) => {

                  const typeId =
                    Number(e.target.value);

                  const selectedType =
                    category.documentTypes.find(
                      (type) =>
                        type.id === typeId
                    );

                  if (!selectedType) return;

                  setUploadedDocuments(
                    (prev) => ({
                      ...prev,

                      [`${category.categoryId}_selected`]:
                        {
                          typeId:
                            selectedType.id,

                          documentTypeName:
                            selectedType.name,

                          documentType:
                            selectedType.name_on_frontend,

                          categoryId:
                            category.categoryId,
                            categoryName:
  category.categoryName,
                        },
                    })
                  );

                  setError("");
                }}
              >

                <option value="">
                  -- Select Document Type --
                </option>

                {category.documentTypes.map(
                  (type) => (

                    <option
                      key={type.id}
                      value={type.id}
                    >
                      {type.name}
                    </option>

                  )
                )}

              </select>

            )}


            {/* SELECTED DOCUMENT */}

            {selected && (
              <p>
                {selected.documentTypeName}
              </p>
            )}


            {/* FILE NAME */}

            {selected?.file && (

              <div className="document-file">

                <span className="file-icon">
                  FILE
                </span>

                <span>
                  {selected.file.name}
                </span>

              </div>

            )}

          </div>


          {/* ACTION */}

          <div className="document-actions">

            {selected ? (

              <button
                type="button"
                className="document-remove"
                onClick={() =>
                  handleRemove(
                    category.categoryId
                  )
                }
              >
                Remove
              </button>

            ) : alreadySubmitted ? (

  <span className="document-upload-btn">
    ✓ Submitted
  </span>

) : (

  <label className="document-upload-btn">

                Upload

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={
                    !uploadedDocuments[
                      `${category.categoryId}_selected`
                    ]
                  }
                  onChange={(event) => {

                    const selectedType =
                      uploadedDocuments[
                        `${category.categoryId}_selected`
                      ];

                    if (!selectedType) {

                      setError(
                        "Please select a document type first."
                      );

                      return;
                    }

                    handleFileChange(
                      category.categoryId,
                      event
                    );

                  }}
                />

              </label>

            )}

          </div>

        </div>

      </div>

    </section>
  );

})}

        {/* ==================================================
            ADMIN REVIEW NOTICE
        ================================================== */}

        <div className="documents-review-notice">

          <div className="review-icon">
            i
          </div>

          <div>

            <strong>
              Document Review
            </strong>

            <p>
              After submission, the uploaded documents
              will be sent for Admin review. VKYC will
              proceed only after the required onboarding
              steps and approvals are completed.
            </p>

          </div>

        </div>


        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="documents-actions">

          <button
            type="button"
            className="documents-btn secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>


          <button
            type="button"
            className="documents-btn primary"
            onClick={handleContinue}
          >
            Submit Documents
            <span>→</span>
          </button>

        </div>

      </div>

    </div>
  );
};

export default Documents;