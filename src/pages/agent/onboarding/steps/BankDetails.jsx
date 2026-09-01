import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BankDetails.css";
import { updateBankDetails, getMerchant } from "../../../../services/merchantApi";
export default function BankDetails() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifsc: "",
    bankName: "",
    branchName: "",
  });

  const [error, setError] = useState("");
  const [merchant, setMerchant] = useState(null);
const [loadingMerchant, setLoadingMerchant] = useState(true);

useEffect(() => {
  const loadMerchant = async () => {
    try {
      const merchantId = localStorage.getItem(
        "onboardingMerchantId"
      );

      if (!merchantId) {
        setError(
          "Merchant session not found. Please start the onboarding again."
        );
        return;
      }

      const response = await getMerchant(merchantId);

      console.log(
        "BANK PAGE MERCHANT:",
        response
      );

      if (response?.success) {
        setMerchant(response.data);
      } else {
        setError(
          response?.message ||
          "Unable to load merchant details."
        );
      }

    } catch (error) {
      console.error(
        "BANK MERCHANT LOAD ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Unable to load merchant details."
      );

    } finally {
      setLoadingMerchant(false);
    }
  };

  loadMerchant();
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "ifsc"
          ? value.toUpperCase()
          : value,
    }));

    setError("");
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!form.accountHolderName.trim()) {
      setError("Account holder name is required.");
      return;
    }

    if (!form.accountNumber.trim()) {
      setError("Account number is required.");
      return;
    }

    if (
      form.accountNumber !== form.confirmAccountNumber
    ) {
      setError("Account numbers do not match.");
      return;
    }

    if (!form.ifsc.trim()) {
      setError("IFSC code is required.");
      return;
    }

    if (!form.bankName.trim()) {
      setError("Bank name is required.");
      return;
    }

    if (!form.branchName.trim()) {
      setError("Branch name is required.");
      return;
    }

    setError("");

try {
  const merchantId = localStorage.getItem(
    "onboardingMerchantId"
  );

  if (!merchantId) {
    setError(
      "Merchant session not found. Please start the onboarding again."
    );
    return;
  }

  const response = await updateBankDetails(
    merchantId,
    {
      accountHolderName: form.accountHolderName,
      accountNumber: form.accountNumber,
      ifsc: form.ifsc,
      bankName: form.bankName,
      branchName: form.branchName,
    }
  );

  console.log(
    "BANK DETAILS RESPONSE:",
    response
  );

  if (!response?.success) {
    setError(
      response?.message ||
      "Unable to save bank details."
    );
    return;
  }

 navigate(
  `/agent/merchant/${merchantId}/business`
);

} catch (error) {

  console.error(
    "BANK DETAILS ERROR:",
    error
  );

  setError(
    error?.response?.data?.message ||
    "Unable to save bank details. Please try again."
  );
}
  };

  return (
    <div className="bank-page">
      <div className="bank-container">

        {/* HEADER */}
        <div className="bank-header">

          <p className="bank-step">
            STEP 04 OF 12
          </p>

          <h1>Bank Details</h1>

          <p>
            Add the merchant's bank account details for verification and settlement.
          </p>

        </div>


        {/* PROGRESS */}
        <div className="bank-progress-card">

          <div className="bank-progress-item completed">
            <div className="bank-progress-circle">✓</div>

            <div>
              <strong>Basic Details</strong>
              <span>Completed</span>
            </div>
          </div>

          <div className="bank-progress-line active" />

          <div className="bank-progress-item completed">
            <div className="bank-progress-circle">✓</div>

            <div>
              <strong>PAN & DOB</strong>
              <span>Completed</span>
            </div>
          </div>

          <div className="bank-progress-line active" />

          <div className="bank-progress-item completed">
            <div className="bank-progress-circle">✓</div>

            <div>
              <strong>CKYC</strong>
              <span>Completed / Skipped</span>
            </div>
          </div>

          <div className="bank-progress-line active" />

          <div className="bank-progress-item active">
            <div className="bank-progress-circle">4</div>

            <div>
              <strong>Bank Details</strong>
              <span>Current step</span>
            </div>
          </div>

        </div>


        {/* ERROR */}
        {error && (
          <div className="bank-alert">

            <div className="bank-alert-icon">
              !
            </div>

            <span>{error}</span>

          </div>
        )}


{/* MERCHANT SUMMARY */}
<section className="bank-section">

  <div className="bank-section-heading">

    <div className="bank-section-icon">
      M
    </div>

    <div>
      <h2>Merchant Information</h2>

      <p>
        Details associated with this merchant onboarding.
      </p>
    </div>

  </div>

  <div className="bank-summary">

    <div className="bank-summary-item">
      <span>Merchant Name : </span>

      <strong>
        {loadingMerchant
          ? "Loading..."
          : merchant?.merchantName || "-"}
      </strong>
    </div>

    <div className="bank-summary-item">
      <span>Business Entity : </span>

      <strong>
        {loadingMerchant
          ? "Loading..."
          : merchant?.entityType || "-"}
      </strong>
    </div>

    <div className="bank-summary-item">
      <span>PAN Number : </span>

      <strong>
        {loadingMerchant
          ? "Loading..."
          : merchant?.panNumber || "-"}
      </strong>
    </div>

  </div>

</section>

        {/* BANK DETAILS */}
        <form onSubmit={handleContinue}>

          <section className="bank-section">

            <div className="bank-section-heading">

              <div className="bank-section-icon">
                ₹
              </div>

              <div>
                <h2>Account Information</h2>

                <p>
                  Enter the bank account details exactly as provided by the merchant.
                </p>
              </div>

            </div>


            <div className="bank-form-grid">

              {/* ACCOUNT HOLDER */}
              <div className="bank-form-group">

                <label>
                  Account Holder Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="accountHolderName"
                  value={form.accountHolderName}
                  onChange={handleChange}
                  placeholder="Enter account holder name"
                  className="bank-input"
                />

                <small>
                  Name should match the bank account records.
                </small>

              </div>


              {/* ACCOUNT NUMBER */}
              <div className="bank-form-group">

                <label>
                  Account Number <span>*</span>
                </label>

                <input
                  type="password"
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                  placeholder="Enter account number"
                  className="bank-input"
                />

              </div>


              {/* CONFIRM ACCOUNT */}
              <div className="bank-form-group">

                <label>
                  Confirm Account Number <span>*</span>
                </label>

                <input
                  type="text"
                  name="confirmAccountNumber"
                  value={form.confirmAccountNumber}
                  onChange={handleChange}
                  placeholder="Re-enter account number"
                  className="bank-input"
                />

              </div>


              {/* IFSC */}
              <div className="bank-form-group">

                <label>
                  IFSC Code <span>*</span>
                </label>

                <input
                  type="text"
                  name="ifsc"
                  value={form.ifsc}
                  onChange={handleChange}
                  placeholder="Example: ESFB0001078"
                  maxLength={11}
                  className="bank-input"
                />

                <small>
                  Enter the 11-character IFSC code.
                </small>

              </div>


              {/* BANK NAME */}
              <div className="bank-form-group">

                <label>
                  Bank Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  className="bank-input"
                />

              </div>


              {/* BRANCH */}
              <div className="bank-form-group">

                <label>
                  Branch Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="branchName"
                  value={form.branchName}
                  onChange={handleChange}
                  placeholder="Enter branch name"
                  className="bank-input"
                />

              </div>

            </div>

          </section>


          {/* VERIFICATION INFO */}
          <div className="bank-info-card">

            <div className="bank-info-icon">
              ✓
            </div>

            <div>

              <strong>Bank Verification</strong>

              <p>
                The submitted bank account will be verified during the
                onboarding process. Make sure the account number, IFSC
                and account holder name are accurate.
              </p>

            </div>

          </div>


          {/* ACTIONS */}
          <div className="bank-actions">

            <button
              type="button"
              className="bank-btn secondary"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            <button
              type="submit"
              className="bank-btn primary"
            >
              Continue
              <span>→</span>
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}