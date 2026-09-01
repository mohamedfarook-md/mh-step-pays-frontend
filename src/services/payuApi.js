// ======================================================
// PAYU API SERVICE
// ======================================================
//
// IMPORTANT:
// Frontend -> Our Backend -> PayU
//
// Frontend direct-ah PayU credentials use panna koodadhu.
// ======================================================

import api from "./api";


// ======================================================
// ERROR HANDLER
// ======================================================

const handlePayUError = (error) => {
    console.error(
        "PayU API Error:",
        error?.response?.data || error
    );

    throw error;
};


// ======================================================
// GET PAYU MERCHANT DETAILS
// ======================================================

export const getPayUMerchant = async (uuid) => {
    try {
        const response = await api.get(
            `/payu/merchants/${uuid}`
        );

        return response.data;
    } catch (error) {
        handlePayUError(error);
    }
};


// ======================================================
// UPDATE PAYU MERCHANT
// ======================================================

export const updatePayUMerchant = async (
    uuid,
    formData
) => {
    try {
        const response = await api.put(
            `/payu/merchants/${uuid}/update`,
            formData
        );

        return response.data;
    } catch (error) {
        handlePayUError(error);
    }
};


// ======================================================
// DIGILOCKER
// ======================================================

export const startPayUDigiLocker = async (
    uuid
) => {
    try {
        const response = await api.post(
            `/payu/merchants/${uuid}/digilocker`
        );

        return response.data;
    } catch (error) {
        handlePayUError(error);
    }
};


export const getPayUDigiLockerStatus = async (
    uuid
) => {
    try {
        const response = await api.get(
            `/payu/merchants/${uuid}/digilocker/status`
        );

        return response.data;
    } catch (error) {
        handlePayUError(error);
    }
};


// ======================================================
// VKYC
// ======================================================

export const generateVKYCLink = async (merchantId) => {
    try {
        const response = await api.post(
            `/merchants/${merchantId}/vkyc`
        );

        return response.data;
    } catch (error) {
        handlePayUError(error);
    }
};


export const getVKYCStatus = async (
    uuid
) => {
    try {
        const response = await api.get(
            `/payu/merchants/${uuid}/vkyc/status`
        );

        return response.data;
    } catch (error) {
        handlePayUError(error);
    }
};


// ======================================================
// AGREEMENT
// ======================================================
//
// IMPORTANT:
// Agreement generation is ADMIN ONLY.
// Agent should never call this function.
// ======================================================

// ======================================================
// AGREEMENT
// ======================================================

export const generateAgreement = async (merchantId) => {
    try {
        const response = await api.get(
            `/merchants/${merchantId}/agreement/generate`
        );

        return response.data;
    } catch (error) {
        handlePayUError(error);
    }
};


// ======================================================
// AGREEMENT STATUS
// ======================================================

export const getAgreementStatus = async (
    uuid
) => {
    try {
        const response = await api.get(
            `/payu/merchants/${uuid}/agreement`
        );

        return response.data;
    } catch (error) {
        handlePayUError(error);
    }
};


// ======================================================
// E-SIGN STATUS
// ======================================================

export const getESignStatus = async (
    uuid
) => {
    try {
        const response = await api.get(
            `/payu/merchants/${uuid}/esign/status`
        );

        return response.data;
    } catch (error) {
        handlePayUError(error);
    }
};