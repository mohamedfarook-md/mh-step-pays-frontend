// ======================================================
// MERCHANT ENTITY CONFIGURATION
// ======================================================
//
// Entity type selected during Create Merchant controls:
// - Required documents
// - UBO requirement
// - Business members requirement
// - Signing authority requirement
// - CIN / LLPIN requirement
// ======================================================


export const ENTITY_TYPES = {
    INDIVIDUAL: "Individual",
    PROPRIETORSHIP: "Proprietorship",
    PARTNERSHIP: "Partnership",
    LLP: "LLP",
    PRIVATE_LIMITED: "Private Limited",
    PUBLIC_LIMITED: "Public Limited",
    TRUST: "Trust",
    SOCIETY: "Society",
    NGO: "NGO",
};


// ======================================================
// ENTITY CONFIG
// ======================================================

export const ENTITY_CONFIG = {

    [ENTITY_TYPES.INDIVIDUAL]: {
        label: "Individual",

        requiresCIN: false,
        requiresLLPIN: false,

        requiresUBO: false,
        requiresBusinessMembers: false,

        requiresSigningAuthority: true,

        requiresGST: false,

        documents: [
            "PAN",
            "Aadhaar",
            "Bank Account Proof",
            "Address Proof",
        ],
    },


    [ENTITY_TYPES.PROPRIETORSHIP]: {
        label: "Proprietorship",

        requiresCIN: false,
        requiresLLPIN: false,

        requiresUBO: false,
        requiresBusinessMembers: false,

        requiresSigningAuthority: true,

        requiresGST: false,

        documents: [
            "PAN",
            "Aadhaar",
            "Business Proof",
            "Bank Account Proof",
            "Address Proof",
        ],
    },


    [ENTITY_TYPES.PARTNERSHIP]: {
        label: "Partnership",

        requiresCIN: false,
        requiresLLPIN: false,

        requiresUBO: true,
        requiresBusinessMembers: true,

        requiresSigningAuthority: true,

        requiresGST: false,

        documents: [
            "PAN",
            "Partnership Deed",
            "Business Proof",
            "Bank Account Proof",
            "Address Proof",
        ],
    },


    [ENTITY_TYPES.LLP]: {
        label: "LLP",

        requiresCIN: false,
        requiresLLPIN: true,

        requiresUBO: true,
        requiresBusinessMembers: true,

        requiresSigningAuthority: true,

        requiresGST: false,

        documents: [
            "PAN",
            "LLPIN",
            "LLP Agreement",
            "Business Proof",
            "Bank Account Proof",
            "Address Proof",
        ],
    },


    [ENTITY_TYPES.PRIVATE_LIMITED]: {
        label: "Private Limited",

        requiresCIN: true,
        requiresLLPIN: false,

        requiresUBO: true,
        requiresBusinessMembers: true,

        requiresSigningAuthority: true,

        requiresGST: false,

        documents: [
            "PAN",
            "Certificate of Incorporation",
            "MOA",
            "AOA",
            "Business Proof",
            "Bank Account Proof",
            "Address Proof",
        ],
    },


    [ENTITY_TYPES.PUBLIC_LIMITED]: {
        label: "Public Limited",

        requiresCIN: true,
        requiresLLPIN: false,

        requiresUBO: true,
        requiresBusinessMembers: true,

        requiresSigningAuthority: true,

        requiresGST: false,

        documents: [
            "PAN",
            "Certificate of Incorporation",
            "MOA",
            "AOA",
            "Business Proof",
            "Bank Account Proof",
            "Address Proof",
        ],
    },


    [ENTITY_TYPES.TRUST]: {
        label: "Trust",

        requiresCIN: false,
        requiresLLPIN: false,

        requiresUBO: true,
        requiresBusinessMembers: true,

        requiresSigningAuthority: true,

        requiresGST: false,

        documents: [
            "PAN",
            "Trust Deed",
            "Registration Certificate",
            "Bank Account Proof",
            "Address Proof",
        ],
    },


    [ENTITY_TYPES.SOCIETY]: {
        label: "Society",

        requiresCIN: false,
        requiresLLPIN: false,

        requiresUBO: true,
        requiresBusinessMembers: true,

        requiresSigningAuthority: true,

        requiresGST: false,

        documents: [
            "PAN",
            "Society Registration Certificate",
            "Bylaws",
            "Bank Account Proof",
            "Address Proof",
        ],
    },


    [ENTITY_TYPES.NGO]: {
        label: "NGO",

        requiresCIN: false,
        requiresLLPIN: false,

        requiresUBO: true,
        requiresBusinessMembers: true,

        requiresSigningAuthority: true,

        requiresGST: false,

        documents: [
            "PAN",
            "Registration Certificate",
            "Trust/Society Documents",
            "Bank Account Proof",
            "Address Proof",
        ],
    },
};


// ======================================================
// GET ENTITY CONFIG
// ======================================================

export const getEntityConfig = (entityType) => {
    return (
        ENTITY_CONFIG[entityType] || {
            label: entityType,

            requiresCIN: false,
            requiresLLPIN: false,

            requiresUBO: false,
            requiresBusinessMembers: false,

            requiresSigningAuthority: true,

            requiresGST: false,

            documents: [],
        }
    );
};


// ======================================================
// ENTITY CHECK HELPERS
// ======================================================

export const requiresCIN = (entityType) => {
    return getEntityConfig(entityType).requiresCIN;
};


export const requiresLLPIN = (entityType) => {
    return getEntityConfig(entityType).requiresLLPIN;
};


export const requiresUBO = (entityType) => {
    return getEntityConfig(entityType).requiresUBO;
};


export const requiresBusinessMembers = (entityType) => {
    return getEntityConfig(entityType).requiresBusinessMembers;
};


export const requiresSigningAuthority = (entityType) => {
    return getEntityConfig(entityType).requiresSigningAuthority;
};


// ======================================================
// DOCUMENTS
// ======================================================

export const getRequiredDocuments = (entityType) => {
    return getEntityConfig(entityType).documents;
};


// ======================================================
// ENTITY OPTIONS FOR DROPDOWN
// ======================================================

export const ENTITY_OPTIONS = Object.values(ENTITY_TYPES).map(
    (entityType) => ({
        value: entityType,
        label: ENTITY_CONFIG[entityType]?.label || entityType,
    })
);