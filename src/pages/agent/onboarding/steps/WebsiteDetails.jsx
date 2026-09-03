import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateWebsiteDetails, getMerchant } from "../../../../services/merchantApi";
import "./WebsiteDetails.css";

export default function WebsiteDetails() {
  const navigate = useNavigate();
   const { id } = useParams();
     useEffect(() => {
    const loadMerchant = async () => {
      if (!id) return;

      try {
        const response = await getMerchant(id);
        const merchantData = response?.data;

        if (!merchantData) return;

        const website = merchantData?.website;

        if (
          website?.websiteUrl ||
          website?.androidUrl ||
          website?.iosUrl
        ) {
          setOption("website");

          setForm({
            websiteUrl: website.websiteUrl || "",
            androidUrl: website.androidUrl || "",
            iosUrl: website.iosUrl || "",
          });
        } else {
          setOption("");
        }
      } catch (error) {
        console.error("LOAD WEBSITE DETAILS ERROR:", error);
      }
    };

    loadMerchant();
  }, [id]);

  const [option, setOption] = useState("");
  const [form, setForm] = useState({
    websiteUrl: "",
    androidUrl: "",
    iosUrl: "",
  });

  const [error, setError] = useState("");
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleContinue = async () => {

  const merchantId = id;

  if (!merchantId) {
    setError(
      "Merchant session not found. Please start the onboarding again."
    );
    return;
  }

  if (!option) {
    setError(
      "Please select whether the merchant has website details."
    );
    return;
  }

  setError("");

  try {

    // ======================================
    // WEBSITE PROVIDED
    // ======================================

    if (option === "website") {

      if (!form.websiteUrl.trim()) {
        setError("Please enter the website URL.");
        return;
      }

      const response = await updateWebsiteDetails(
        merchantId,
        form
      );

      console.log(
        "WEBSITE UPDATE RESPONSE:",
        response
      );

      if (!response?.success) {
        setError(
          response?.message ||
          "Unable to save website details."
        );
        return;
      }

      navigate(
  `/agent/merchant/${merchantId}/signing-authority`
);

      return;
    }

    // ======================================
    // SKIP WEBSITE
    // ======================================

    setShowSkipConfirm(true);

  } catch (error) {

    console.error(
      "WEBSITE DETAILS ERROR:",
      error
    );

    setError(
      error?.response?.data?.message ||
      "Unable to process website details."
    );
  }
};

  const confirmSkip = async () => {

 const merchantId = id;

  if (!merchantId) {
    setError(
      "Merchant session not found. Please start the onboarding again."
    );
    setShowSkipConfirm(false);
    return;
  }

  try {

    const response = await updateWebsiteDetails(
      merchantId,
      {
        websiteUrl: "",
        androidUrl: "",
        iosUrl: ""
      }
    );

    console.log(
      "WEBSITE SKIP RESPONSE:",
      response
    );

    if (!response?.success) {
      setError(
        response?.message ||
        "Unable to skip website step."
      );
      setShowSkipConfirm(false);
      return;
    }

    setShowSkipConfirm(false);

   navigate(
  `/agent/merchant/${merchantId}/signing-authority`
);

  } catch (error) {

    console.error(
      "SKIP WEBSITE ERROR:",
      error
    );

    setShowSkipConfirm(false);

    setError(
      error?.response?.data?.message ||
      "Unable to skip website step."
    );
  }
};

  return (
    <div className="website-page">
      <div className="website-container">

        {/* HEADER */}
        <div className="website-header">
          <p className="website-step">STEP 06 OF 12</p>

          <h1>Website Details</h1>

          <p>
            Provide the merchant's online presence details or skip this step
            when the merchant journey does not require a website.
          </p>
        </div>


        {/* PROGRESS */}
        <div className="website-progress-card">

          {[
            ["✓", "Basic Details", "completed"],
            ["✓", "PAN & DOB", "completed"],
            ["✓", "CKYC", "completed"],
            ["✓", "Bank Details", "completed"],
            ["✓", "Business Details", "completed"],
            ["6", "Website", "active"],
          ].map((item, index) => (
            <div className="website-progress-wrapper" key={item[1]}>

              <div className={`website-progress-item ${item[2]}`}>

                <div className="website-progress-circle">
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

              {index < 5 && (
                <div className="website-progress-line active" />
              )}

            </div>
          ))}

        </div>


        {/* ERROR */}
        {error && (
          <div className="website-alert">

            <div className="website-alert-icon">
              !
            </div>

            <span>{error}</span>

          </div>
        )}


        {/* WEBSITE OPTION */}
        <section className="website-section">

          <div className="website-section-heading">

            <div className="website-section-icon">
              W
            </div>

            <div>
              <h2>Online Presence</h2>

              <p>
                Select how you want to handle website information for this merchant.
              </p>
            </div>

          </div>


          <div className="website-options">

            {/* HAS WEBSITE */}
            <button
              type="button"
              className={`website-option ${
                option === "website" ? "selected" : ""
              }`}
              onClick={() => {
                setOption("website");
                setError("");
              }}
            >

              <div className="website-option-top">

                <div className="website-option-icon blue">
                  W
                </div>

                {option === "website" && (
                  <div className="website-selected">
                    ✓
                  </div>
                )}

              </div>

              <h3>Merchant Has Website</h3>

              <p>
                Enter the merchant website and optional application URLs.
              </p>

            </button>


            {/* SKIP */}
            <button
              type="button"
              className={`website-option ${
                option === "skip" ? "selected skip-selected" : ""
              }`}
              onClick={() => {
                setOption("skip");
                setError("");
              }}
            >

              <div className="website-option-top">

                <div className="website-option-icon grey">
                  →
                </div>

                {option === "skip" && (
                  <div className="website-selected">
                    ✓
                  </div>
                )}

              </div>

              <h3>Skip Website Details</h3>

              <p>
                Continue without website details when permitted for the merchant journey.
              </p>

            </button>

          </div>

        </section>


        {/* WEBSITE FORM */}
        {option === "website" && (
          <section className="website-section">

            <div className="website-section-heading">

              <div className="website-section-icon blue-icon">
                URL
              </div>

              <div>
                <h2>Website Information</h2>

                <p>
                  Enter the merchant's online platform details.
                </p>
              </div>

            </div>


            <div className="website-form-grid">

              <div className="website-form-group full">

                <label>
                  Website URL <span>*</span>
                </label>

                <input
                  type="url"
                  name="websiteUrl"
                  value={form.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://www.example.com"
                  className="website-input"
                />

                <small>
                  Enter the complete website URL including https://
                </small>

              </div>


              <div className="website-form-group">

                <label>
                  Android App URL
                  <em>Optional</em>
                </label>

                <input
                  type="url"
                  name="androidUrl"
                  value={form.androidUrl}
                  onChange={handleChange}
                  placeholder="Google Play Store URL"
                  className="website-input"
                />

              </div>


              <div className="website-form-group">

                <label>
                  iOS App URL
                  <em>Optional</em>
                </label>

                <input
                  type="url"
                  name="iosUrl"
                  value={form.iosUrl}
                  onChange={handleChange}
                  placeholder="Apple App Store URL"
                  className="website-input"
                />

              </div>

            </div>

          </section>
        )}


        {/* OFFLINE INFO */}
        <div className="website-info">

          <div className="website-info-icon">
            i
          </div>

          <div>

            <strong>Offline Merchant</strong>

            <p>
              Website details are not mandatory for eligible offline
              non-re merchants. The website step can be skipped when
              the merchant journey permits it.
            </p>

          </div>

        </div>


        {/* ACTIONS */}
        <div className="website-actions">

          <button
            type="button"
            className="website-btn secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <button
            type="button"
            className="website-btn primary"
            onClick={handleContinue}
          >
            Continue
            <span>→</span>
          </button>

        </div>


        {/* SKIP CONFIRMATION */}
        {showSkipConfirm && (
          <div className="website-modal-overlay">

            <div className="website-modal">

              <div className="website-modal-icon">
                !
              </div>

              <h2>Skip Website Details?</h2>

              <p>
                Website details are optional for eligible offline merchants.
                Do you want to continue to the next onboarding step?
              </p>

              <div className="website-modal-actions">

                <button
                  type="button"
                  className="website-modal-cancel"
                  onClick={() => setShowSkipConfirm(false)}
                >
                  Go Back
                </button>

                <button
                  type="button"
                  className="website-modal-confirm"
                  onClick={confirmSkip}
                >
                  Yes, Continue
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}