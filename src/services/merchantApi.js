// ======================================================
// MERCHANT API SERVICE
// ======================================================
//
// Create Merchant + Merchant basic information
//
// FRONTEND
//    ↓
// OUR BACKEND
//    ↓
// PAYU
//
// PayU credentials frontend-la irukka koodadhu.
// ======================================================

import api from "./api";


// ======================================================
// ERROR HANDLER
// ======================================================

const handleMerchantError = (error) => {
    console.error(
        "Merchant API Error:",
        error?.response?.data || error
    );

    throw error;
};


// ======================================================
// CREATE MERCHANT
// ======================================================
//
// This is the FIRST step.
//
// Entity type selected here becomes the base for:
// - Documents
// - UBO
// - Business Members
// - CIN / LLPIN
// - Signing Authority
// ======================================================
// ======================================================
// CREATE MERCHANT
// ======================================================
export const createMerchant = async (data) => {
    try {

        const payload = {
            merchantName: data.name,
            mobile: data.mobile,
            email: data.email,

            shopName: data.businessName,

            address: [
                data.addressLine1,
                data.addressLine2,
                data.city,
                data.state,
                data.pincode,
            ]
                .filter(Boolean)
                .join(", "),

            entityType: data.businessEntity,

            merchantType: data.businessEntity,
        };

        console.log(
            "CREATE MERCHANT PAYLOAD:",
            payload
        );

        const response = await api.post(
            "/merchants/basic-details",
            payload
        );

        return response.data;

    } catch (error) {

        handleMerchantError(error);

    }
};


// ======================================================
// STEP 2 - PAN & DOB VERIFICATION
// ======================================================

export const verifyPAN = async (
    merchantId,
    data
) => {
    try {

        const response = await api.post(
            `/merchants/${merchantId}/pan-verification`,
            {
                panNumber: data.pan,
                panName: data.panName,
                dob: data.dob,
            }
        );

        return response.data;

    } catch (error) {

        handleMerchantError(error);

    }
};

// ======================================================
// GET MERCHANT DETAILS
// ======================================================

export const getMerchant = async (merchantId) => {
    try {

        const response = await api.get(
            `/merchants/${merchantId}`
        );

        return response.data;

    } catch (error) {

        handleMerchantError(error);

    }
};


// ======================================================
// UPDATE MERCHANT BASIC DETAILS
// ======================================================

export const updateMerchant = async (
    merchantId,
    data
) => {
    try {

        const response = await api.put(
            `/merchants/${merchantId}`,
            data
        );

        return response.data;

    } catch (error) {

        handleMerchantError(error);

    }
};


// ======================================================
// GET MERCHANT ONBOARDING STATUS
// ======================================================

export const getMerchantOnboardingStatus = async (
    merchantId
) => {
    try {

        const response = await api.get(
            `/merchants/${merchantId}/onboarding-status`
        );

        return response.data;

    } catch (error) {

        handleMerchantError(error);

    }
};


// ======================================================
// GET MERCHANT PROGRESS
// ======================================================

export const getMerchantProgress = async (
    merchantId
) => {
    try {

        const response = await api.get(
            `/merchants/${merchantId}/onboarding-progress`
        );

        return response.data;

    } catch (error) {

        handleMerchantError(error);

    }
};


// ======================================================
// SAVE ENTITY TYPE
// ======================================================
//
// Entity type is important because it controls
// document / UBO / business-member requirements.
// ======================================================

export const updateEntityType = async (
    merchantId,
    entityType
) => {
    try {

        const response = await api.put(
            `/merchants/${merchantId}/entity`,
            {
                businessEntity: entityType,
            }
        );

        return response.data;

    } catch (error) {

        handleMerchantError(error);

    }
};


// ======================================================
// UPDATE BANK DETAILS
// ======================================================

export const updateBankDetails = async (
  merchantId,
  data
) => {
  try {

    const response = await api.put(
      `/merchants/${merchantId}/bank`,
      {
        accountHolderName: data.accountHolderName,
        accountNumber: data.accountNumber,
        ifsc: data.ifsc,
        bankName: data.bankName,
        branchName: data.branchName,
      }
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};


// ======================================================
// UPDATE BUSINESS INFORMATION
// ======================================================

export const updateBusinessInformation = async (
  merchantId,
  data
) => {
  try {
    const response = await api.put(
      `/merchants/${merchantId}/business-information`,
      {
        businessCategory: data.businessCategory,
        businessSubCategory: data.businessSubCategory,
        tradeName: data.tradeName,
        expectedMonthlySales: data.expectedMonthlySales,
        gstin: data.gstin,
        cin: data.cin,

        operatingAddress: data.operatingAddress,
        operatingCity: data.operatingCity,
        operatingState: data.operatingState,
        operatingPincode: data.operatingPincode,

        registrationAddress: data.registrationAddress,
        registrationCity: data.registrationCity,
        registrationState: data.registrationState,
        registrationPincode: data.registrationPincode,
      }
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};



// ======================================================
// CKYC - SEND OTP
// ======================================================

export const sendCKYCOTP = async (
  merchantId,
  aadhaarNumber
) => {
  try {

    const response = await api.post(
      `/merchants/${merchantId}/ckyc/send-otp`,
      {
        aadhaarNumber,
      }
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};


// ======================================================
// CKYC - VERIFY OTP
// ======================================================

export const verifyCKYCOTP = async (
  merchantId,
  otp
) => {
  try {

    const response = await api.post(
      `/merchants/${merchantId}/ckyc/verify-otp`,
      {
        otp,
      }
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};


// ======================================================
// CKYC - GET STATUS
// ======================================================

export const getCKYCStatus = async (
  merchantId
) => {
  try {

    const response = await api.get(
      `/merchants/${merchantId}/ckyc/status`
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};



// ======================================================
// CKYC - SKIP
// ======================================================

export const skipCKYC = async (
  merchantId
) => {
  try {

    const response = await api.post(
      `/merchants/${merchantId}/ckyc/skip`
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};


// ======================================================
// UPDATE WEBSITE DETAILS
// ======================================================

export const updateWebsiteDetails = async (
  merchantId,
  data
) => {
  try {

    const response = await api.put(
      `/merchants/${merchantId}/website`,
      {
        websiteUrl: data.websiteUrl,
        androidUrl: data.androidUrl,
        iosUrl: data.iosUrl,
      }
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};


// ======================================================
// UPDATE SIGNING AUTHORITY DETAILS
// ======================================================

export const addSignatoryDetails = async (
  merchantId,
  data
) => {
  try {

    const response = await api.put(
      `/merchants/${merchantId}/signatory-details`,
      {
        name: data.name,
        email: data.email,
        panNumber: data.panNumber,
      }
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};

// ======================================================
// UBO - ADD / UPDATE
// ======================================================

export const addUBO = async (
  merchantId,
  beneficiaries
) => {
  try {

    const response = await api.put(
      `/merchants/${merchantId}/ubo`,
      {
        beneficiaries,
      }
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};



// ======================================================
// GET PAYU REQUIRED DOCUMENTS
// ======================================================

export const getRequiredDocuments = async (
  merchantId
) => {
  try {

    const response = await api.get(
      `/merchants/${merchantId}/required-documents`
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};



// ======================================================
// UPLOAD KYC DOCUMENT
// ======================================================

export const uploadKYCDocument = async (
  merchantId,
  file,
  documentCategory,
  documentType
) => {
  try {

    const formData = new FormData();

    formData.append(
      "document",
      file
    );

    formData.append(
      "documentCategory",
      String(documentCategory)
    );

    formData.append(
      "documentType",
      String(documentType)
    );

    const response = await api.post(
      `/merchants/${merchantId}/upload-document`,
      formData
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};



// ======================================================
// CREATE VKYC PROFILE
// ======================================================

export const createVKYCProfile = async (
  merchantId
) => {
  try {

    const response = await api.post(
      `/merchants/${merchantId}/vkyc`
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};
// ======================================================
// DIGILOCKER - INITIATE VERIFICATION
// ======================================================

export const initiateDigiLocker = async (
  merchantId
) => {
  try {

    const response = await api.post(
      `/merchants/${merchantId}/digilocker`
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};


// ======================================================
// DIGILOCKER - CHECK STATUS
// ======================================================

export const checkDigiLockerStatus = async (
  merchantId
) => {
  try {

    const response = await api.get(
      `/merchants/${merchantId}/digilocker/status`
    );

    return response.data;

  } catch (error) {

    handleMerchantError(error);

  }
};






export const getMerchantStatus = async (merchantId) => {
  try {
    const response = await api.get(
      `/merchants/${merchantId}/status`
    );

    return response.data;

  } catch (error) {

    console.error(
      "MERCHANT STATUS API ERROR:",
      error
    );

    throw error;
  }
};
// ======================================================
// DELETE / CANCEL DRAFT MERCHANT
// ======================================================
//
// Only if backend supports this route.
// ======================================================

export const cancelMerchant = async (
    merchantId
) => {
    try {

        const response = await api.delete(
            `/merchants/${merchantId}`
        );

        return response.data;

    } catch (error) {

        handleMerchantError(error);

    }
};

// ======================================================
// SHOP VERIFICATION
// ======================================================

export const submitShopVerification = async (
    merchantId,
    formData
) => {
    try {
        const response = await api.post(
            `/merchants/${merchantId}/shop-verification`,
            formData
        );

        return response.data;

    } catch (error) {
        handleMerchantError(error);
    }
};