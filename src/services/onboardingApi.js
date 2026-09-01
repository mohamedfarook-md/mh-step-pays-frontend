// ======================================================
// MERCHANT ONBOARDING API
// ======================================================

import api from "./api";


// ======================================================
// HELPER
// ======================================================

const handleApiError = (error) => {
    console.error(
        "Onboarding API Error:",
        error?.response?.data || error
    );

    throw error;
};


// ======================================================
// 1. CREATE MERCHANT
// ======================================================

export const createMerchant = async (data) => {
    try {
        const response = await api.post(
            "/merchants",
            data
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// 2. GET MERCHANT
// ======================================================

export const getMerchant = async (merchantId) => {
    try {
        const response = await api.get(
            `/merchants/${merchantId}`
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// 3. UPDATE PAN & DOB
// ======================================================

export const updatePanDob = async (
    merchantId,
    data
) => {
    try {
        const response = await api.put(
            `/merchants/${merchantId}/pan`,
            data
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// 4. CKYC
// ======================================================

export const updateCKYC = async (
    merchantId,
    data
) => {
    try {
        const response = await api.put(
            `/merchants/${merchantId}/ckyc`,
            data
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// SKIP CKYC
// ======================================================

export const skipCKYC = async (merchantId) => {
    try {
        const response = await api.post(
            `/merchants/${merchantId}/ckyc/skip`
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// 5. BANK DETAILS
// ======================================================

export const updateBankDetails = async (
    merchantId,
    data
) => {
    try {
        const response = await api.put(
            `/merchants/${merchantId}/bank`,
            data
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// BANK STATUS
// ======================================================

export const getBankStatus = async (merchantId) => {
    try {
        const response = await api.get(
            `/merchants/${merchantId}/bank/status`
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// 6. BUSINESS DETAILS
// ======================================================

export const updateBusinessDetails = async (
    merchantId,
    data
) => {
    try {
        const response = await api.put(
            `/merchants/${merchantId}/business`,
            data
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// GET BUSINESS DETAILS
// ======================================================

export const getBusinessDetails = async (
    merchantId
) => {
    try {
        const response = await api.get(
            `/merchants/${merchantId}/business`
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// 7. WEBSITE / INTEGRATION
// ======================================================

export const updateWebsiteDetails = async (
    merchantId,
    data
) => {
    try {
        const response = await api.put(
            `/merchants/${merchantId}/website`,
            data
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// SKIP WEBSITE / USE TOOLS
// ======================================================

export const skipWebsite = async (merchantId) => {
    try {
        const response = await api.put(
            `/merchants/${merchantId}/website`,
            {
                integrationType: "Tools",
            }
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// 8. SIGNING AUTHORITY
// ======================================================

export const updateSigningAuthority = async (
    merchantId,
    data
) => {
    try {
        const response = await api.put(
            `/merchants/${merchantId}/signatory`,
            data
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// 9. DIGILOCKER
// ======================================================

export const initiateDigiLocker = async (
    merchantId
) => {
    try {
        const response = await api.post(
            `/merchants/${merchantId}/digilocker/initiate`
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// DIGILOCKER STATUS
// ======================================================

export const getDigiLockerStatus = async (
    merchantId
) => {
    try {
        const response = await api.get(
            `/merchants/${merchantId}/digilocker/status`
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// 10. UBO
// ======================================================

export const updateUBO = async (
    merchantId,
    data
) => {
    try {
        const response = await api.put(
            `/merchants/${merchantId}/ubo`,
            data
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// BUSINESS MEMBERS
// ======================================================

export const updateBusinessMembers = async (
    merchantId,
    data
) => {
    try {
        const response = await api.put(
            `/merchants/${merchantId}/business-members`,
            data
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// 11. DOCUMENTS
// ======================================================

export const uploadDocument = async (
    merchantId,
    formData
) => {
    try {
        const response = await api.post(
            `/merchants/${merchantId}/documents`,
            formData
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// GET DOCUMENTS
// ======================================================

export const getDocuments = async (
    merchantId
) => {
    try {
        const response = await api.get(
            `/merchants/${merchantId}/documents`
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// 12. VKYC
// ======================================================

export const initiateVKYC = async (
    merchantId
) => {
    try {
        const response = await api.post(
            `/merchants/${merchantId}/vkyc/initiate`
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// VKYC STATUS
// ======================================================

export const getVKYCStatus = async (
    merchantId
) => {
    try {
        const response = await api.get(
            `/merchants/${merchantId}/vkyc/status`
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// 13. SUBMIT FOR ADMIN REVIEW
// ======================================================

export const submitForAdminReview = async (
    merchantId
) => {
    try {
        const response = await api.post(
            `/merchants/${merchantId}/submit-review`
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};


// ======================================================
// GET ONBOARDING PROGRESS
// ======================================================

export const getOnboardingProgress = async (
    merchantId
) => {
    try {
        const response = await api.get(
            `/merchants/${merchantId}/onboarding-progress`
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};