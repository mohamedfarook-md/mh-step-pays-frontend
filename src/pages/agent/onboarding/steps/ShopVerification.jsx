import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { submitShopVerification } from "../../../../services/merchantApi";
import "./ShopVerification.css";

const ShopVerification = () => {
  const navigate = useNavigate();
  const { id: merchantId } = useParams();

  const [photos, setPhotos] = useState({
    banner: null,
    inside: null,
    fullShop: null,
    business: null,
  });

  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // PHOTO CONFIG
  // =====================================================

  const photoConfig = [
    {
      key: "banner",
      title: "Shop Banner Photo",
      description: "Capture the shop name / banner clearly.",
    },
    {
      key: "inside",
      title: "Inside Shop Photo",
      description: "Capture the interior of the shop.",
    },
    {
      key: "fullShop",
      title: "Full Shop Photo",
      description: "Capture the complete shop from outside.",
    },
    {
      key: "business",
      title: "Business Photo",
      description: "Capture another clear photo showing the business.",
    },
  ];

  // =====================================================
  // PHOTO CHANGE
  // =====================================================

  const handlePhotoChange = (key, event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Each image should not exceed 5 MB.");
      return;
    }

    setPhotos((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  // =====================================================
  // REMOVE PHOTO
  // =====================================================

  const handleRemovePhoto = (key) => {
    setPhotos((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  // =====================================================
  // GET CURRENT LOCATION
  // =====================================================

  const handleGetLocation = () => {
    setError("");
    setSuccess("");

    if (!navigator.geolocation) {
      setError(
        "Location service is not supported by this browser."
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setLocation({
          latitude: latitude.toFixed(8),
          longitude: longitude.toFixed(8),
        });

        setLocationLoading(false);

        setSuccess(
          "Current shop location captured successfully."
        );
      },

      (error) => {
        console.error(
          "Location Error:",
          error
        );

        setLocationLoading(false);

        if (error.code === 1) {
          setError(
            "Location permission denied. Please allow location access and try again."
          );
        } else if (error.code === 2) {
          setError(
            "Unable to detect your current location."
          );
        } else if (error.code === 3) {
          setError(
            "Location request timed out. Please try again."
          );
        } else {
          setError(
            "Unable to get current location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // =====================================================
  // VALIDATE
  // =====================================================

  const validateForm = () => {
    const missingPhotos = photoConfig.filter(
      (item) => !photos[item.key]
    );

    if (missingPhotos.length > 0) {
      setError(
        "Please upload all 4 shop photos."
      );
      return false;
    }

    if (
      !location.latitude ||
      !location.longitude
    ) {
      setError(
        "Please capture the shop location before continuing."
      );
      return false;
    }

    return true;
  };

  // =====================================================
  // SAVE & CONTINUE
  // =====================================================

  const handleSaveAndContinue = async () => {
    setError("");
    setSuccess("");

    if (!merchantId) {
      setError(
        "Merchant session not found."
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "bannerPhoto",
        photos.banner
      );

      formData.append(
        "insidePhoto",
        photos.inside
      );

      formData.append(
        "fullShopPhoto",
        photos.fullShop
      );

      formData.append(
        "businessPhoto",
        photos.business
      );

      formData.append(
        "latitude",
        location.latitude
      );

      formData.append(
        "longitude",
        location.longitude
      );

      console.log(
        "========== SHOP VERIFICATION =========="
      );

      console.log(
        "Merchant ID:",
        merchantId
      );

      console.log(
        "Latitude:",
        location.latitude
      );

      console.log(
        "Longitude:",
        location.longitude
      );

      console.log(
        "Banner:",
        photos.banner?.name
      );

      console.log(
        "Inside:",
        photos.inside?.name
      );

      console.log(
        "Full Shop:",
        photos.fullShop?.name
      );

      console.log(
        "Business:",
        photos.business?.name
      );

      console.log(
        "========================================"
      );

      // =================================================
      // BACKEND API
      // =================================================
const data = await submitShopVerification(
  merchantId,
  formData
);

console.log(
  "SHOP VERIFICATION RESPONSE:",
  data
);

if (!data?.success) {
  throw new Error(
    data?.message ||
    "Unable to save shop verification."
  );
}
      setSuccess(
        "Shop details saved successfully."
      );

      // =================================================
      // GO TO DOCUMENTS
      // =================================================

      
        navigate(
          `/agent/merchant/${merchantId}/documents`
        );
      

    } catch (error) {
      console.error(
        "SHOP VERIFICATION ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to save shop details."
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="shop-verification-page">

      <div className="shop-verification-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="shop-verification-header">

          <div>
            <span className="shop-step-label">
              STEP 10 of 12
            </span>

            <h1>
              Shop Verification
            </h1>

            <p>
              Capture the shop photos and current
              location before proceeding to document
              verification.
            </p>
          </div>

        </div>

        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (
          <div className="shop-alert shop-alert-error">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="shop-alert shop-alert-success">
            <span>✓</span>
            <p>{success}</p>
          </div>
        )}

        {/* =================================================
            SHOP PHOTOS
        ================================================= */}

        <section className="shop-section">

          <div className="section-heading">

            <div className="section-number">
              01
            </div>

            <div>
              <h2>
                Shop Photos
              </h2>

              <p>
                Upload all four required photos of
                the merchant's shop.
              </p>
            </div>

          </div>

          <div className="photo-grid">

            {photoConfig.map((item) => {

              const selectedFile =
                photos[item.key];

              const previewUrl =
                selectedFile
                  ? URL.createObjectURL(
                      selectedFile
                    )
                  : null;

              return (
                <div
                  className="photo-card"
                  key={item.key}
                >

                  <div className="photo-card-header">

                    <div>
                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.description}
                      </p>
                    </div>

                    <span className="required-tag">
                      Required
                    </span>

                  </div>

                  {!selectedFile ? (
                    <label className="photo-upload-box">

                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          handlePhotoChange(
                            item.key,
                            event
                          )
                        }
                      />

                      <div className="upload-icon">
                        +
                      </div>

                      <strong>
                        Upload Photo
                      </strong>

                      <span>
                        JPG, PNG or WEBP · Max 5 MB
                      </span>

                    </label>
                  ) : (
                    <div className="photo-preview-box">

                      <img
                        src={previewUrl}
                        alt={item.title}
                      />

                      <div className="photo-preview-footer">

                        <span>
                          {selectedFile.name}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemovePhoto(
                              item.key
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>
                  )}

                </div>
              );

            })}

          </div>

        </section>

        {/* =================================================
            LOCATION
        ================================================= */}

        <section className="shop-section">

          <div className="section-heading">

            <div className="section-number">
              02
            </div>

            <div>
              <h2>
                Shop Location
              </h2>

              <p>
                Stand at the merchant's shop and
                capture the current location.
              </p>
            </div>

          </div>

          <div className="location-card">

            <div className="location-top">

              <div className="location-icon">
                ◎
              </div>

              <div>
                <h3>
                  Current Shop Location
                </h3>

                <p>
                  Click the button below and allow
                  browser location permission.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="location-button"
              onClick={handleGetLocation}
              disabled={locationLoading}
            >
              {locationLoading
                ? "Getting Location..."
                : "Get Current Location"}
            </button>

            <div className="coordinates-grid">

              <div className="coordinate-box">

                <span>
                  Latitude
                </span>

                <strong>
                  {location.latitude ||
                    "Not captured"}
                </strong>

              </div>

              <div className="coordinate-box">

                <span>
                  Longitude
                </span>

                <strong>
                  {location.longitude ||
                    "Not captured"}
                </strong>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="shop-actions">

          <button
            type="button"
            className="shop-back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <button
            type="button"
            className="shop-save-button"
            onClick={handleSaveAndContinue}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save & Continue →"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ShopVerification;