// ======================================================
// PAYU MERCHANT ONBOARDING STEPS
// ======================================================

export const ONBOARDING_STEPS = [
    {
        id: 1,
        key: "createMerchant",
        title: "Create Merchant",
        shortTitle: "Create",
        path: "create-merchant",
        required: true,
    },
    {
        id: 2,
        key: "panDob",
        title: "PAN & DOB",
        shortTitle: "PAN",
        path: "pan-dob",
        required: true,
    },
    {
        id: 3,
        key: "ckyc",
        title: "CKYC",
        shortTitle: "CKYC",
        path: "ckyc",
        required: false,
        canSkip: true,
    },
    {
        id: 4,
        key: "bankDetails",
        title: "Bank Details",
        shortTitle: "Bank",
        path: "bank-details",
        required: true,
    },
    {
        id: 5,
        key: "businessDetails",
        title: "Business Details",
        shortTitle: "Business",
        path: "business-details",
        required: true,
    },
    {
        id: 6,
        key: "websiteDetails",
        title: "Website / Integration",
        shortTitle: "Website",
        path: "website",
        required: false,
        canSkip: true,
    },
    {
        id: 7,
        key: "signingAuthority",
        title: "Signing Authority",
        shortTitle: "Signatory",
        path: "signing-authority",
        required: true,
    },
    {
        id: 8,
        key: "digiLocker",
        title: "DigiLocker",
        shortTitle: "DigiLocker",
        path: "digilocker",
        required: true,
    },
    {
        id: 9,
        key: "ubo",
        title: "UBO & Business Members",
        shortTitle: "UBO",
        path: "ubo",
        required: false,
        conditional: true,
    },
    {
        id: 10,
        key: "documents",
        title: "Documents",
        shortTitle: "Docs",
        path: "documents",
        required: true,
        conditional: true,
    },
    {
        id: 11,
        key: "vkyc",
        title: "Video KYC",
        shortTitle: "VKYC",
        path: "vkyc",
        required: true,
        dependsOn: ["digiLocker"],
    },
    {
        id: 12,
        key: "agreement",
        title: "Agreement",
        shortTitle: "Agreement",
        path: "agreement",
        required: true,
        adminOnly: true,
    },
];


// ======================================================
// STEP STATUS
// ======================================================

export const STEP_STATUS = {
    LOCKED: "locked",
    CURRENT: "current",
    COMPLETED: "completed",
    SKIPPED: "skipped",
    ERROR: "error",
    PENDING_REVIEW: "pending_review",
};


// ======================================================
// AGENT ONBOARDING STATUS
// ======================================================

export const MERCHANT_ONBOARDING_STATUS = {
    DRAFT: "draft",
    IN_PROGRESS: "in_progress",
    READY_FOR_REVIEW: "ready_for_review",
    ADMIN_REVIEW: "admin_review",
    CORRECTION_REQUIRED: "correction_required",
    ADMIN_APPROVED: "admin_approved",
    PAYU_PROCESSING: "payu_processing",
    AGREEMENT_PENDING: "agreement_pending",
    ESIGN_PENDING: "esign_pending",
    COMPLETED: "completed",
};


// ======================================================
// STEP HELPERS
// ======================================================

export const getStepByKey = (key) => {
    return ONBOARDING_STEPS.find((step) => step.key === key);
};


export const getStepById = (id) => {
    return ONBOARDING_STEPS.find((step) => step.id === id);
};


export const getRequiredSteps = () => {
    return ONBOARDING_STEPS.filter((step) => step.required);
};


export const getAgentSteps = () => {
    return ONBOARDING_STEPS.filter((step) => !step.adminOnly);
};


export const getAdminSteps = () => {
    return ONBOARDING_STEPS.filter((step) => step.adminOnly);
};


// ======================================================
// CHECK WHETHER A STEP IS LOCKED
// ======================================================

export const isStepLocked = (step, completedSteps = {}) => {
    if (!step?.dependsOn) {
        return false;
    }

    return step.dependsOn.some(
        (dependency) => !completedSteps[dependency]
    );
};


// ======================================================
// CHECK WHETHER ONBOARDING CAN BE SUBMITTED
// ======================================================

export const canSubmitForAdminReview = (completedSteps = {}) => {
    const requiredSteps = getRequiredSteps();

    return requiredSteps.every((step) => {
        return completedSteps[step.key] === true;
    });
};