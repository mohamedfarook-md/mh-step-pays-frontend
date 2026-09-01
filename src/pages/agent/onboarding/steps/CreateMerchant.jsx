import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMerchant } from "../../../../services/merchantApi";
import "./CreateMerchant.css";
const ENTITY_TYPES = [
    {
        value: "Individual",
        label: "Individual",
        description: "For individual",
    },
    {
        value: "Sole Proprietorship",
        label: "Sole Proprietorship",
        description: "For sole proprietorship businesses",
    },
    {
        value: "Partnership",
        label: "Partnership",
        description: "For partnership firms",
    },
    {
        value: "LLP",
        label: "LLP",
        description: "For Limited Liability Partnership",
    },
    {
        value: "Private Limited",
        label: "Private Limited",
        description: "For private limited companies",
    },
    {
        value: "Public Limited",
        label: "Public Limited",
        description: "For public limited companies",
    },
];

const initialForm = {
    name: "",
    email: "",
    mobile: "",
    pan: "",
    dob: "",
    businessEntity: "",
    businessName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
};

export default function CreateMerchant() {
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ==================================================
    // HANDLE INPUT
    // ==================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };


    // ==================================================
    // ENTITY CHANGE
    // ==================================================

    const handleEntityChange = (entity) => {
        setForm((prev) => ({
            ...prev,
            businessEntity: entity,
        }));

        setError("");
    };


    // ==================================================
    // VALIDATION
    // ==================================================

    const validateForm = () => {

        if (!form.name.trim()) {
            return "Merchant name is required.";
        }

        if (!form.email.trim()) {
            return "Email is required.";
        }

        if (!form.mobile.trim()) {
            return "Mobile number is required.";
        }

        if (!form.pan.trim()) {
            return "PAN number is required.";
        }

        if (!form.dob) {
            return "Date of birth is required.";
        }

        if (!form.businessEntity) {
            return "Please select business entity.";
        }

        if (!form.businessName.trim()) {
            return "Business name is required.";
        }

        if (!form.addressLine1.trim()) {
            return "Address is required.";
        }

        if (!form.city.trim()) {
            return "City is required.";
        }

        if (!form.state.trim()) {
            return "State is required.";
        }

        if (!form.pincode.trim()) {
            return "Pincode is required.";
        }

        return null;
    };


    // ==================================================
    // SUBMIT
    // ==================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {

            setLoading(true);

            const response = await createMerchant({
                name: form.name,
                email: form.email,
                mobile: form.mobile,
                pan: form.pan,
                dob: form.dob,
                businessEntity: form.businessEntity,
                businessName: form.businessName,
                addressLine1: form.addressLine1,
                addressLine2: form.addressLine2,
                city: form.city,
                state: form.state,
                pincode: form.pincode,
            });
            const merchantId =
  response?.data?.merchantId ||
  response?.merchantId;

if (!merchantId) {
  throw new Error(
    "Merchant ID was not returned by backend."
  );
}

localStorage.setItem(
  "onboardingMerchantId",
  merchantId
);

localStorage.setItem(
  "onboardingEntityType",
  form.businessEntity
);

console.log(
  "ONBOARDING MERCHANT ID:",
  merchantId
);

console.log(
  "ONBOARDING ENTITY TYPE:",
  form.businessEntity
);

            console.log(
                "CREATE MERCHANT RESPONSE:",
                response
            );

            setSuccess(
                "Merchant created successfully."
            );

            /*
             * Backend response-la actual merchantId
             * vandha udane next step-ku navigate pannuvom.
             *
             * Example:
             *
             * const merchantId =
             *     response?.data?.merchantId;
             *
             * navigate(
             *     `/agent/merchant/${merchantId}/pan`
             * );
             */

           setTimeout(() => {
    navigate(
        `/agent/merchant/${merchantId}/pan`
    );
}, 500);

        }
         catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to create merchant."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="create-merchant-page">

            <div className="mx-auto max-w-5xl">

                {/* =====================================
                    HEADER
                ====================================== */}

                <div className="mb-6">

                    <h1 className="text-2xl font-bold text-gray-900">
                        Create Merchant
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Enter the merchant's basic information
                        to start onboarding.
                    </p>

                </div>


                {/* =====================================
                    PROGRESS
                ====================================== */}

                <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                            1
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Basic Details
                            </p>

                            <p className="text-xs text-gray-500">
                                Merchant creation
                            </p>
                        </div>

                    </div>

                </div>


                {/* =====================================
                    ERROR
                ====================================== */}

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}


                {/* =====================================
                    SUCCESS
                ====================================== */}

                {success && (
                    <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    {/* =================================
                        BASIC DETAILS
                    ================================== */}

                    <br /><div className="merchant-section">

                        <h2 className="mb-5 text-lg font-semibold text-gray-900">
                            Basic Details
                        </h2>


                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


                            {/* NAME */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Merchant Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter merchant name"
                                    className="form-input"
                                />
                            </div>


                            {/* EMAIL */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Email *
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="merchant@example.com"
                                    className="form-input"
                                />
                            </div>


                            {/* MOBILE */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Mobile Number *
                                </label>

                                <input
                                    type="tel"
                                    name="mobile"
                                    value={form.mobile}
                                    onChange={handleChange}
                                    placeholder="10 digit mobile number"
                                    maxLength={10}
                                    className="form-input"
                                />
                            </div>


                            {/* PAN */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    PAN *
                                </label>

                                <input
                                    type="text"
                                    name="pan"
                                    value={form.pan}
                                    onChange={handleChange}
                                    placeholder="ABCDE1234F"
                                    maxLength={10}
                                    className="form-input"
                                />
                            </div>


                            {/* DOB */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Date of Birth *
                                </label>

                                <input
                                    type="date"
                                    name="dob"
                                    value={form.dob}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>


                            {/* BUSINESS NAME */}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Business Name *
                                </label>

                                <input
                                    type="text"
                                    name="businessName"
                                    value={form.businessName}
                                    onChange={handleChange}
                                    placeholder="Enter business name"
                                    className="form-input"
                                />
                            </div>

                        </div>

                    </div><br /><br />


                    {/* =================================
                        ENTITY TYPE
                    ================================== */}

                    <div className="merchant-section">

                        <div className="mb-5">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Business Entity Type
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Select the entity type. This selection
                                controls the documents and onboarding
                                requirements in later steps.
                            </p>

                        </div>


                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                            {ENTITY_TYPES.map((entity) => {

                                const selected =
                                    form.businessEntity === entity.value;

                                return (
                                    <button
                                        type="button"
                                        key={entity.value}
                                        onClick={() =>
                                            handleEntityChange(
                                                entity.value
                                            )
                                        }
                                        className={`entity-card ${selected ? "selected" : ""}`}
                                    >

                                        <div className="flex items-start justify-between">

                                            <div>

                                                <p className="font-semibold text-gray-900">
                                                    {entity.label}
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                                    {entity.description}
                                                </p>

                                            </div>

                                            {selected && (
                                                <div className="ml-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                                                    ✓
                                                </div>
                                            )}

                                        </div>

                                    </button>
                                );

                            })}

                        </div>

                    </div><br /><br />



                    {/* =================================
                        ADDRESS
                    ================================== */}

                    <div className="merchant-section">

                        <h2 className="mb-5 text-lg font-semibold text-gray-900">
                            Address Details
                        </h2>


                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


                            {/* ADDRESS */}

                            <div className="md:col-span-2">

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Address Line 1 *
                                </label>

                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={form.addressLine1}
                                    onChange={handleChange}
                                    placeholder="Door no, street, area"
                                    className="form-input"
                                />

                            </div>


                            {/* ADDRESS 2 */}

                            <div className="md:col-span-2">

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Address Line 2
                                </label>

                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={form.addressLine2}
                                    onChange={handleChange}
                                    placeholder="Landmark / additional address"
                                    className="form-input"
                                />

                            </div>


                            {/* CITY */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    City *
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className="form-input"
                                />

                            </div>


                            {/* STATE */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    State *
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    className="form-input"
                                />

                            </div>


                            {/* PINCODE */}

                            <div>

                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Pincode *
                                </label>

                                <input
                                    type="text"
                                    name="pincode"
                                    value={form.pincode}
                                    onChange={handleChange}
                                    placeholder="6 digit pincode"
                                    maxLength={6}
                                    className="form-input"
                                />

                            </div>

                        </div>

                    </div><br />


                    {/* =================================
                        ACTIONS
                    ================================== */}

                    <div className="flex items-center justify-end gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/agent/dashboard")
                            }
                            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Merchant & Continue"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}