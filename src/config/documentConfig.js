// ======================================================
// DOCUMENT CONFIGURATION
// ======================================================
//
// Entity Type based document requirements.
//
// IMPORTANT:
// This is the frontend configuration layer.
// Final validation must also happen in backend / PayU.
// ======================================================


// ======================================================
// DOCUMENT TYPES
// ======================================================

export const DOCUMENT_TYPES = {
    PAN: "PAN",
    AADHAAR: "Aadhaar",

    ADDRESS_PROOF: "Address Proof",
    BUSINESS_PROOF: "Business Proof",
    BANK_ACCOUNT_PROOF: "Bank Account Proof",

    GST_CERTIFICATE: "GST Certificate",
    CIN_CERTIFICATE: "Certificate of Incorporation",
    LLPIN_CERTIFICATE: "LLPIN",

    PARTNERSHIP_DEED: "Partnership Deed",
    LLP_AGREEMENT: "LLP Agreement",

    MOA: "MOA",
    AOA: "AOA",

    TRUST_DEED: "Trust Deed",
    SOCIETY_REGISTRATION: "Society Registration Certificate",
    SOCIETY_BYLAWS: "Society Bylaws",

    REGISTRATION_CERTIFICATE: "Registration Certificate",

    BUSINESS_LICENSE: "Business License",

    CANCELLED_CHEQUE: "Cancelled Cheque",
};


// ======================================================
// BASE DOCUMENT CONFIG
// ======================================================

export const DOCUMENT_CONFIG = {

    PAN: {
        key: "pan",
        label: "PAN",
        type: DOCUMENT_TYPES.PAN,
        required: true,
        category: "Identity",
    },

    AADHAAR: {
        key: "aadhaar",
        label: "Aadhaar",
        type: DOCUMENT_TYPES.AADHAAR,
        required: true,
        category: "Identity",
    },

    ADDRESS_PROOF: {
        key: "addressProof",
        label: "Address Proof",
        type: DOCUMENT_TYPES.ADDRESS_PROOF,
        required: true,
        category: "Address",
    },

    BUSINESS_PROOF: {
        key: "businessProof",
        label: "Business Proof",
        type: DOCUMENT_TYPES.BUSINESS_PROOF,
        required: true,
        category: "Business",
    },

    BANK_ACCOUNT_PROOF: {
        key: "bankAccountProof",
        label: "Bank Account Proof",
        type: DOCUMENT_TYPES.BANK_ACCOUNT_PROOF,
        required: true,
        category: "Bank",
    },

    GST_CERTIFICATE: {
        key: "gstCertificate",
        label: "GST Certificate",
        type: DOCUMENT_TYPES.GST_CERTIFICATE,
        required: false,
        category: "Business",
    },

    CIN_CERTIFICATE: {
        key: "cinCertificate",
        label: "Certificate of Incorporation",
        type: DOCUMENT_TYPES.CIN_CERTIFICATE,
        required: true,
        category: "Business",
    },

    LLPIN_CERTIFICATE: {
        key: "llpinCertificate",
        label: "LLPIN Certificate",
        type: DOCUMENT_TYPES.LLPIN_CERTIFICATE,
        required: true,
        category: "Business",
    },

    PARTNERSHIP_DEED: {
        key: "partnershipDeed",
        label: "Partnership Deed",
        type: DOCUMENT_TYPES.PARTNERSHIP_DEED,
        required: true,
        category: "Business",
    },

    LLP_AGREEMENT: {
        key: "llpAgreement",
        label: "LLP Agreement",
        type: DOCUMENT_TYPES.LLP_AGREEMENT,
        required: true,
        category: "Business",
    },

    MOA: {
        key: "moa",
        label: "MOA",
        type: DOCUMENT_TYPES.MOA,
        required: true,
        category: "Company",
    },

    AOA: {
        key: "aoa",
        label: "AOA",
        type: DOCUMENT_TYPES.AOA,
        required: true,
        category: "Company",
    },

    TRUST_DEED: {
        key: "trustDeed",
        label: "Trust Deed",
        type: DOCUMENT_TYPES.TRUST_DEED,
        required: true,
        category: "Organization",
    },

    SOCIETY_REGISTRATION: {
        key: "societyRegistration",
        label: "Society Registration Certificate",
        type: DOCUMENT_TYPES.SOCIETY_REGISTRATION,
        required: true,
        category: "Organization",
    },

    SOCIETY_BYLAWS: {
        key: "societyBylaws",
        label: "Society Bylaws",
        type: DOCUMENT_TYPES.SOCIETY_BYLAWS,
        required: true,
        category: "Organization",
    },

    REGISTRATION_CERTIFICATE: {
        key: "registrationCertificate",
        label: "Registration Certificate",
        type: DOCUMENT_TYPES.REGISTRATION_CERTIFICATE,
        required: true,
        category: "Organization",
    },

    BUSINESS_LICENSE: {
        key: "businessLicense",
        label: "Business License",
        type: DOCUMENT_TYPES.BUSINESS_LICENSE,
        required: false,
        category: "Business",
    },

    CANCELLED_CHEQUE: {
        key: "cancelledCheque",
        label: "Cancelled Cheque",
        type: DOCUMENT_TYPES.CANCELLED_CHEQUE,
        required: true,
        category: "Bank",
    },
};


// ======================================================
// ENTITY BASE DOCUMENTS
// ======================================================

export const ENTITY_DOCUMENTS = {

    Individual: [
        "PAN",
        "AADHAAR",
        "ADDRESS_PROOF",
        "BANK_ACCOUNT_PROOF",
    ],


    Proprietorship: [
        "PAN",
        "AADHAAR",
        "BUSINESS_PROOF",
        "ADDRESS_PROOF",
        "BANK_ACCOUNT_PROOF",
    ],


    Partnership: [
        "PAN",
        "PARTNERSHIP_DEED",
        "BUSINESS_PROOF",
        "ADDRESS_PROOF",
        "BANK_ACCOUNT_PROOF",
    ],


    LLP: [
        "PAN",
        "LLPIN_CERTIFICATE",
        "LLP_AGREEMENT",
        "BUSINESS_PROOF",
        "ADDRESS_PROOF",
        "BANK_ACCOUNT_PROOF",
    ],


    "Private Limited": [
        "PAN",
        "CIN_CERTIFICATE",
        "MOA",
        "AOA",
        "BUSINESS_PROOF",
        "ADDRESS_PROOF",
        "BANK_ACCOUNT_PROOF",
    ],


    "Public Limited": [
        "PAN",
        "CIN_CERTIFICATE",
        "MOA",
        "AOA",
        "BUSINESS_PROOF",
        "ADDRESS_PROOF",
        "BANK_ACCOUNT_PROOF",
    ],


    Trust: [
        "PAN",
        "TRUST_DEED",
        "REGISTRATION_CERTIFICATE",
        "ADDRESS_PROOF",
        "BANK_ACCOUNT_PROOF",
    ],


    Society: [
        "PAN",
        "SOCIETY_REGISTRATION",
        "SOCIETY_BYLAWS",
        "ADDRESS_PROOF",
        "BANK_ACCOUNT_PROOF",
    ],


    NGO: [
        "PAN",
        "REGISTRATION_CERTIFICATE",
        "BUSINESS_PROOF",
        "ADDRESS_PROOF",
        "BANK_ACCOUNT_PROOF",
    ],
};


// ======================================================
// GET DOCUMENT CONFIG
// ======================================================

export const getDocumentConfig = (documentKey) => {
    return DOCUMENT_CONFIG[documentKey] || null;
};


// ======================================================
// GET ENTITY DOCUMENTS
// ======================================================

// export const getEntityDocumentKeys = (entityType) => {
//     return ENTITY_DOCUMENTS[entityType] || [];
// };


export const getEntityDocumentKeys = (entityType) => {

    if (!entityType) {
        return [];
    }

    const normalizedEntityType =
        String(entityType).trim();

    return ENTITY_DOCUMENTS[normalizedEntityType] || [];
};

// ======================================================
// GET FULL DOCUMENT OBJECTS
// ======================================================

export const getEntityDocuments = (entityType) => {

    const documentKeys = getEntityDocumentKeys(entityType);

    return documentKeys
        .map((key) => DOCUMENT_CONFIG[key])
        .filter(Boolean);
};


// ======================================================
// GET REQUIRED DOCUMENTS
// ======================================================

export const getRequiredEntityDocuments = (entityType) => {

    return getEntityDocuments(entityType)
        .filter((document) => document.required);
};


// ======================================================
// GST DOCUMENT
// ======================================================
//
// GST is conditional.
// If GSTIN is provided / applicable,
// frontend can request GST certificate.
// ======================================================

export const shouldRequireGSTDocument = (gstin) => {

    return Boolean(
        gstin &&
        gstin.trim() !== ""
    );
};


// ======================================================
// CIN DOCUMENT
// ======================================================

export const shouldRequireCINDocument = (entityType) => {

    return (
        entityType === "Private Limited" ||
        entityType === "Public Limited"
    );
};


// ======================================================
// LLP DOCUMENT
// ======================================================

export const shouldRequireLLPDocuments = (entityType) => {

    return entityType === "LLP";
};


// ======================================================
// UBO REQUIREMENT
// ======================================================

export const requiresUBODocuments = (entityType) => {

    return (
        entityType === "Partnership" ||
        entityType === "LLP" ||
        entityType === "Private Limited" ||
        entityType === "Public Limited" ||
        entityType === "Trust" ||
        entityType === "Society" ||
        entityType === "NGO"
    );
};


// ======================================================
// BUSINESS MEMBER REQUIREMENT
// ======================================================

export const requiresBusinessMembers = (entityType) => {

    return (
        entityType === "Partnership" ||
        entityType === "LLP" ||
        entityType === "Private Limited" ||
        entityType === "Public Limited" ||
        entityType === "Trust" ||
        entityType === "Society" ||
        entityType === "NGO"
    );
};


// ======================================================
// SIGNING AUTHORITY
// ======================================================

export const requiresSigningAuthority = () => {
    return true;
};


// ======================================================
// GET COMPLETE DOCUMENT CHECKLIST
// ======================================================

export const getDocumentChecklist = (
    entityType,
    gstin = ""
) => {

    const documents = [
        ...getEntityDocuments(entityType),
    ];

    // GST certificate is conditional
    if (shouldRequireGSTDocument(gstin)) {
        documents.push("GST_CERTIFICATE");
    }

    // Remove duplicates
    return [...new Set(documents)]
        .map((key) => DOCUMENT_CONFIG[key])
        .filter(Boolean);
};


// ======================================================
// CHECK DOCUMENT COMPLETION
// ======================================================
//
// uploadedDocuments example:
//
// {
//     pan: true,
//     aadhaar: true,
//     addressProof: true
// }
// ======================================================

export const isDocumentChecklistComplete = (
    entityType,
    uploadedDocuments = {},
    gstin = ""
) => {

    const checklist = getDocumentChecklist(
        entityType,
        gstin
    );

    return checklist.every((document) => {

        return uploadedDocuments[document.key] === true;
    });
};