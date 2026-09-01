// ======================================================
// ADMIN API SERVICE
// ======================================================
//
// Agent
//   ↓
// Submit for Admin Review
//   ↓
// Admin Pending Applications
//   ↓
// Admin Review
//   ↓
// Approve / Reject / Send Back
//   ↓
// PayU / Agreement
//
// IMPORTANT:
// Final approval must always happen in backend.
// Frontend button visibility alone is NOT security.
// ======================================================

import api from "./api";


// ======================================================
// ERROR HANDLER
// ======================================================

const handleAdminError = (error) => {
    console.error(
        "Admin API Error:",
        error?.response?.data || error
    );

    throw error;
};


// ======================================================
// GET PENDING MERCHANTS
// ======================================================

export const getPendingMerchants = async () => {
    try {
        const response = await api.get(
            "/admin/merchants/pending"
        );

        return response.data;
    } catch (error) {
        handleAdminError(error);
    }
};


// ======================================================
// GET ALL MERCHANTS
// ======================================================

export const getAllMerchants = async (params = {}) => {
    try {
        const response = await api.get(
            "/admin/merchants",
            {
                params,
            }
        );

        return response.data;
    } catch (error) {
        handleAdminError(error);
    }
};


// ======================================================
// GET SINGLE MERCHANT
// ======================================================

export const getAdminMerchant = async (
    merchantId
) => {
    try {
        const response = await api.get(
            `/admin/merchants/${merchantId}`
        );

        return response.data;
    } catch (error) {
        handleAdminError(error);
    }
};


// ======================================================
// GET ONBOARDING PROGRESS
// ======================================================

export const getAdminOnboardingProgress = async (
    merchantId
) => {
    try {
        const response = await api.get(
            `/admin/merchants/${merchantId}/onboarding-progress`
        );

        return response.data;
    } catch (error) {
        handleAdminError(error);
    }
};


// ======================================================
// GET MERCHANT DOCUMENTS
// ======================================================

export const getAdminMerchantDocuments = async (
    merchantId
) => {
    try {
        const response = await api.get(
            `/admin/merchants/${merchantId}/documents`
        );

        return response.data;
    } catch (error) {
        handleAdminError(error);
    }
};


// ======================================================
// GET VKYC STATUS
// ======================================================

export const getAdminVKYCStatus = async (
    merchantId
) => {
    try {
        const response = await api.get(
            `/admin/merchants/${merchantId}/vkyc/status`
        );

        return response.data;
    } catch (error) {
        handleAdminError(error);
    }
};


// ======================================================
// APPROVE MERCHANT
// ======================================================

export const approveMerchant = async (
    merchantId,
    data = {}
) => {
    try {
        const response = await api.post(
            `/admin/merchants/${merchantId}/approve`,
            data
        );

        return response.data;
    } catch (error) {
        handleAdminError(error);
    }
};


// ======================================================
// REJECT MERCHANT
// ======================================================

export const rejectMerchant = async (
    merchantId,
    reason
) => {
    try {
        const response = await api.post(
            `/admin/merchants/${merchantId}/reject`,
            {
                reason,
            }
        );

        return response.data;
    } catch (error) {
        handleAdminError(error);
    }
};


// ======================================================
// SEND BACK FOR CORRECTION
// ======================================================

export const requestMerchantCorrection = async (
    merchantId,
    data
) => {
    try {
        const response = await api.post(
            `/admin/merchants/${merchantId}/correction`,
            data
        );

        return response.data;
    } catch (error) {
        handleAdminError(error);
    }
};


// ======================================================
// GET ADMIN REVIEW HISTORY
// ======================================================

export const getReviewHistory = async (
    merchantId
) => {
    try {
        const response = await api.get(
            `/admin/merchants/${merchantId}/review-history`
        );

        return response.data;
    } catch (error) {
        handleAdminError(error);
    }
};


// ======================================================
// GENERATE AGREEMENT
// ======================================================
//
// ADMIN ONLY
//
// This should be called ONLY after admin approval.
// ======================================================

export const generateMerchantAgreement = async (
    merchantId
) => {
    try {
        const response = await api.get(
            `/admin/merchants/${merchantId}/agreement/generate`
        );

        return response.data;
    } catch (error) {
        handleAdminError(error);
    }
};


// ======================================================
// GET AGREEMENT
// ======================================================

export const getMerchantAgreement = async (
    merchantId
) => {
    try {
        const response = await api.get(
            `/admin/merchants/${merchantId}/agreement`
        );

        return response.data;
    } catch (error) {
        handleAdminError(error);
    }
};


// ======================================================
// GET DASHBOARD SUMMARY
// ======================================================

export const getAdminDashboard = async () => {
    try {
        const response = await api.get(
            "/admin/dashboard"
        );

        return response.data;
    } catch (error) {
        handleAdminError(error);
    }
};