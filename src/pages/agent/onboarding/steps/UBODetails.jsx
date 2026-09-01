import { useEffect, useState } from "react";
import { getMerchant, addUBO, } from "../../../../services/merchantApi";
import { useNavigate } from "react-router-dom";
import "./UBODetails.css";

export default function UBODetails() {
  const navigate = useNavigate();

 const [merchant, setMerchant] = useState(null);
 const merchantId = localStorage.getItem(
  "onboardingMerchantId"
);
const [loadingMerchant, setLoadingMerchant] = useState(true);

const [entityType, setEntityType] = useState("");

const [requiresUBO, setRequiresUBO] = useState(false);
const [requiresBusinessMembers, setRequiresBusinessMembers] =
  useState(false);

  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
  const loadMerchant = async () => {
    try {
      

      if (!merchantId) {
        setError(
          "Merchant session not found. Please start the onboarding again."
        );
        return;
      }

      const response = await getMerchant(merchantId);

      console.log("UBO PAGE MERCHANT:", response);

      if (!response?.success || !response?.data) {
        setError(
          response?.message ||
            "Unable to load merchant details."
        );
        return;
      }

      const merchantData = response.data;

      const entity = merchantData.entityType;

      setMerchant(merchantData);
      setEntityType(entity || "");

      // ======================================
      // UBO REQUIREMENT
      // ======================================

      const uboRequiredEntities = [
        "Partnership",
        "Pvt Ltd",
        "Public Limited",
        "LLP",
        "Trust",
        "Society",
      ];

      // ======================================
      // BUSINESS MEMBER REQUIREMENT
      // ======================================

      const businessMemberEntities = [
        "Partnership",
        "Pvt Ltd",
        "Public Limited",
        "LLP",
      ];

      setRequiresUBO(
        uboRequiredEntities.includes(entity)
      );

      setRequiresBusinessMembers(
        businessMemberEntities.includes(entity)
      );

    } catch (err) {
      console.error(
        "UBO MERCHANT LOAD ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load merchant details."
      );
    } finally {
      setLoadingMerchant(false);
    }
  };

  loadMerchant();
}, []);

  const [form, setForm] = useState({
  beneficiaryName: "",
  panNumber: "",
  ownershipPercent: "",
  dob: "",
  nationality: "IN",
  email: "",
  addressLine: "",
  pincode: "",
});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

 const addMember = () => {

  if (!form.beneficiaryName.trim()) {
    setError("Please enter the beneficiary name.");
    return;
  }

  if (!form.panNumber.trim()) {
    setError("Please enter the UBO PAN number.");
    return;
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

  if (!panRegex.test(form.panNumber)) {
    setError("Please enter a valid PAN number.");
    return;
  }

  if (!form.ownershipPercent) {
    setError("Please enter ownership percentage.");
    return;
  }

  const ownership = Number(form.ownershipPercent);

  if (ownership <= 0 || ownership > 100) {
    setError("Ownership percentage must be between 1 and 100.");
    return;
  }

  if (!form.dob) {
    setError("Please select the date of birth.");
    return;
  }

  if (!form.nationality.trim()) {
    setError("Please enter nationality.");
    return;
  }

  if (!form.addressLine.trim()) {
    setError("Please enter the address.");
    return;
  }

  if (!/^\d{6}$/.test(form.pincode)) {
    setError("Please enter a valid 6-digit pincode.");
    return;
  }

  if (members.length >= 4) {
    setError("Maximum 4 UBOs can be added.");
    return;
  }

  const newUBO = {
    ...form,
    ownershipPercent: ownership,
    id: Date.now(),
  };

  setMembers((prev) => [
    ...prev,
    newUBO,
  ]);

  setForm({
    beneficiaryName: "",
    panNumber: "",
    ownershipPercent: "",
    dob: "",
    nationality: "IN",
    email: "",
    addressLine: "",
    pincode: "",
  });

  setShowForm(false);
  setError("");
};
  const removeMember = (id) => {
    setMembers((prev) =>
      prev.filter((member) => member.id !== id)
    );
  };

 const handleContinue = async () => {

  setError("");

  // ======================================
  // UBO NOT REQUIRED
  // ======================================

  if (!requiresUBO) {

    if (requiresBusinessMembers) {
      navigate(
  `/agent/merchant/${merchantId}/business-members`
);
      return;
    }

   navigate(
  `/agent/merchant/${merchantId}/shop-verification`
);
    return;
  }

  // ======================================
  // UBO REQUIRED
  // ======================================

  if (members.length === 0) {
    setError(
      "Please add at least one Ultimate Beneficial Owner."
    );
    return;
  }

  try {



    if (!merchantId) {
      setError(
        "Merchant session not found."
      );
      return;
    }

    const beneficiaries = members.map((ubo) => ({
      beneficiaryName:
        ubo.beneficiaryName,

      panNumber:
        ubo.panNumber,

      ownershipPercent:
        Number(ubo.ownershipPercent),

      dob:
        ubo.dob,

      nationality:
        ubo.nationality || "IN",

      email:
        ubo.email || "",

      address: {
        addressLine:
          ubo.addressLine,

        pincode:
          ubo.pincode,
      },
    }));

    console.log(
      "UBO PAYLOAD:",
      beneficiaries
    );

    const response = await addUBO(
      merchantId,
      beneficiaries
    );

    console.log(
      "UBO API RESPONSE:",
      response
    );

    if (!response?.success) {
      setError(
        response?.message ||
        "Unable to submit UBO details."
      );
      return;
    }

    // ======================================
    // NEXT STEP
    // ======================================

    if (requiresBusinessMembers) {

  navigate(
    `/agent/merchant/${merchantId}/business-members`
  );

} else {

  navigate(
    `/agent/merchant/${merchantId}/shop-verification`
  );

}

  } catch (err) {

    console.error(
      "UBO SUBMIT ERROR:",
      err
    );

    setError(
      err?.response?.data?.message ||
      err?.message ||
      "Unable to submit UBO details."
    );
  }
};

  const handleSkip = () => {
  setError("");

  navigate(
    `/agent/merchant/${merchantId}/shop-verification`
  );
};

  return (
    <div className="ubo-page">
      <div className="ubo-container">

        {/* HEADER */}
        <div className="ubo-header">

          <p className="ubo-step">
            STEP 09 OF 12
          </p>

          <h1>UBO & Business Members</h1>

          <p>
            Add the beneficial owners and business members when
            required for the merchant's entity type.
          </p>

        </div>


        {/* PROGRESS */}
        <div className="ubo-progress-card">

          {[
            ["✓", "Basic Details", "completed"],
            ["✓", "PAN & DOB", "completed"],
            ["✓", "CKYC", "completed"],
            ["✓", "Bank Details", "completed"],
            ["✓", "Business Details", "completed"],
            ["✓", "Website", "completed"],
            ["✓", "Signing Authority", "completed"],
            ["✓", "DigiLocker", "completed"],
            ["9", "UBO / Members", "active"],
          ].map((item, index) => (

            <div
              className="ubo-progress-wrapper"
              key={item[1]}
            >

              <div
                className={`ubo-progress-item ${item[2]}`}
              >

                <div className="ubo-progress-circle">
                  {item[0]}
                </div>

                <div>
                  <strong>{item[1]}</strong>

                  <span>
                    {item[2] === "active"
                      ? "Current step"
                      : "Completed"}
                  </span>
                </div>

              </div>

              {index < 8 && (
                <div className="ubo-progress-line active" />
              )}

            </div>

          ))}

        </div>


        {/* ALERT */}
        {error && (
          <div className="ubo-alert">

            <div className="ubo-alert-icon">
              !
            </div>

            <span>{error}</span>

          </div>
        )}


        {/* ENTITY STATUS */}
        <section className="ubo-section">

          <div className="ubo-section-heading">

            <div className="ubo-section-icon">
              E
            </div>

            <div>
              <h2>Entity Requirement</h2>

              <p>
                UBO requirements depend on the merchant entity type.
              </p>
            </div>

          </div>


          <div className="ubo-entity-card">

            <div className="ubo-entity-left">

              <div className="ubo-entity-icon">
                I
              </div>

              <div>

                <span className="ubo-label">
                  Merchant Entity
                </span>

                <strong>
                  {entityType}
                </strong>

              </div>

            </div>


            <div
              className={`ubo-requirement-badge ${
                requiresUBO
                  ? "required"
                  : "not-required"
              }`}
            >
              {requiresUBO
                ? "Required"
                : "Not Required"}
            </div>

          </div>

        </section>


        {/* NOT REQUIRED */}
        {!requiresUBO && (

          <section className="ubo-section">

            <div className="ubo-skip-card">

              <div className="ubo-skip-icon">
                ✓
              </div>

              <div>

                <h2>UBO Details Not Required</h2>

                <p>
  This merchant is registered as{" "}
  <strong>{entityType || "this entity"}</strong>.
  UBO / business member details are not required
  for this journey.
</p>

              </div>

            </div>

          </section>

        )}


        {/* REQUIRED */}
        {requiresUBO && (

          <section className="ubo-section">

            <div className="ubo-section-heading">

              <div className="ubo-section-icon">
                U
              </div>

              <div>
                <h2>Ultimate Beneficial Owners</h2>

<p>
  Add the beneficial owners required for this merchant entity.
</p>
              </div>

            </div>


            {members.length > 0 && (

              <div className="ubo-member-list">

                {members.map((member) => (

                  <div
                    className="ubo-member-card"
                    key={member.id}
                  >

                    <div className="ubo-member-avatar">
                      {member.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="ubo-member-details">

                      <strong>
                        {member.name}
                      </strong>

                      <span>
                        PAN: {member.pan}
                      </span>

                      <span>
                        Ownership:{" "}
                        {member.ownershipPercentage}%
                      </span>

                    </div>

                    <button
                      type="button"
                      className="ubo-remove-btn"
                      onClick={() =>
                        removeMember(member.id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                ))}

              </div>

            )}


            {!showForm && (

              <button
                type="button"
                className="ubo-add-btn"
                onClick={() => {
                  setShowForm(true);
                  setError("");
                }}
              >
                + Add UBO
              </button>

            )}


            {showForm && (

              <div className="ubo-member-form">

                <div className="ubo-form-grid">

                  <div className="ubo-form-group full">

                    <label>
                      Full Name <span>*</span>
                    </label>

                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="ubo-input"
                    />

                  </div>


                  <div className="ubo-form-group">

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      className="ubo-input"
                    />

                  </div>


                  <div className="ubo-form-group">

                    <label>
                      Mobile Number
                    </label>

                    <input
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      className="ubo-input"
                    />

                  </div>


                  <div className="ubo-form-group">

                    <label>
                      PAN Number <span>*</span>
                    </label>

                    <input
                      name="pan"
                      value={form.pan}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          pan: e.target.value
                            .toUpperCase()
                            .slice(0, 10),
                        }))
                      }
                      placeholder="ABCDE1234F"
                      className="ubo-input"
                    />

                  </div>


                  <div className="ubo-form-group">

                    <label>
                      Ownership % <span>*</span>
                    </label>

                    <input
                      type="number"
                      name="ownershipPercentage"
                      value={form.ownershipPercentage}
                      onChange={handleChange}
                      placeholder="e.g. 25"
                      min="0"
                      max="100"
                      className="ubo-input"
                    />

                  </div>


                  <div className="ubo-form-group full">

                    <label>
                      Role
                    </label>

                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="ubo-input"
                    >

                      <option value="">
                        Select role
                      </option>

                      <option value="UBO">
                        Ultimate Beneficial Owner
                      </option>

                      <option value="Director">
                        Director
                      </option>

                      <option value="Partner">
                        Partner
                      </option>

                      <option value="Business Member">
                        Business Member
                      </option>

                    </select>

                  </div>

                </div>


                <div className="ubo-form-actions">

                  <button
                    type="button"
                    className="ubo-cancel-btn"
                    onClick={() => {
                      setShowForm(false);
                      setError("");
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="ubo-save-btn"
                    onClick={addMember}
                  >
                    Save Member
                  </button>

                </div>

              </div>

            )}

          </section>

        )}


        {/* INFO */}
        <div className="ubo-info">

          <div className="ubo-info-icon">
            i
          </div>

          <div>

            <strong>
              Entity-based requirement
            </strong>

            <p>
              UBO and business member requirements will be determined
              from the merchant entity selected during the initial
              onboarding step.
            </p>

          </div>

        </div>


        {/* ACTIONS */}
        <div className="ubo-actions">

          <button
            type="button"
            className="ubo-btn secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          {!requiresUBO && (
            <button
              type="button"
              className="ubo-btn skip"
              onClick={handleSkip}
            >
              Skip
            </button>
          )}

          <button
            type="button"
            className="ubo-btn primary"
            onClick={handleContinue}
          >
            Continue
            <span>→</span>
          </button>

        </div>

      </div>
    </div>
  );
}