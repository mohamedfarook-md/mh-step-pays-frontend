import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BusinessDetails.css";
import { getMerchant, updateBusinessInformation, } from "../../../../services/merchantApi";

const categories = {
  "Professional Services": [
    "Legal",
    "Jobs",
    "Business Consulting",
    "Astrology",
    "Photography",
    "Architects Interior designers etc.",
    "Matrimony",
    "Visa Services",
    "Reports Survey etc",
    "Career Counselling",
    "Appointments (Salons Spa etc.)",
    "Advertising",
    "Accounting and Tax",
    "Therapists",
    "Maintenance and Repair services",
    "Others",
    "Pest Control",
    "Counselling Services",
    "Accounting Services",
    "Legal Services",
    "Cleaning Services",
    "Advertising Services",
    "Other Professional Services",
    "Publishing and Printing",
    "Architecture and Interior Design",
    "Security and Surveillance",
  ],

  "Real Estate": [
    "Booking amount",
    "Repayment (Loans)",
    "Others",
    "Rental/Sales - housing and commercial",
  ],

  "Educational Services": [
    "Schools",
    "Colleges",
    "Universities",
    "Courses Training and Workshops",
    "Tutorials",
    "ERP for schools and colleges",
    "Others",
    "Other Educational Services",
    "Colleges and Universities",
  ],

  Government: [
    "Property Tax",
    "Water Tax",
    "Recruitment",
    "Political Party",
    "Fees",
    "Tax and Fines",
    "Government Services",
    "Others",
  ],

  "Financial Services": [
    "Wallet",
    "Banks",
    "Loans (Repayment)",
    "Forex",
    "Money Transfer",
    "Mutual Funds",
    "Stock broking and advisory",
    "Others",
    "Banks loans/credit etc.",
    "Stock Brokers and Mutual Funds",
    "Insurance",
    "Forex services money orders",
    "Insurance - Marketing",
    "Wallet loading services",
  ],

  "Donations/Crowdfunding": [
    "Membership Organisations",
    "Political Organisations",
    "Religious Organisations",
    "NGO",
  ],

  Entertainment: [
    "Movie Theatres / Tickets",
    "Dance Halls",
    "OTT",
    "Amusement Parks",
    "Game Arcades",
  ],

  "Personal Services": [
    "Astrologers",
    "Heating Plumbing AC Services",
    "Pet Shops and Pet Foods",
    "Farm Management Services",
    "Beauty and Barber Shops",
    "Photographic Studios",
    "Matrimonial Services",
    "Gardening Services",
    "Other Personal Services",
    "Funeral Services and Crematories",
  ],

  "Online MarketPlace": ["Online MarketPlace"],

  "Fashion and Accessories": [
    "Kids clothing and accessories",
    "Cosmetics",
    "Womens clothing",
    "Jewellery",
    "Shoes",
    "Family Clothing Stores",
    "Clothing and Accessories",
    "Luggage and Leather goods",
    "Mens clothing",
    "Sunglasses and eyewear",
    "Sports Apparel",
  ],

  "Food and Groceries": [
    "Meat Stores",
    "Restaurants/Food Delivery/Takeaways",
    "Bakeries",
    "Confectionery",
    "Grocery/Supermarket",
    "Bars and Nightclubs",
    "Gourmet and Other food stores",
    "Dairy Products",
  ],

  Automobiles: [
    "Bicycle Shops - Sales and Service",
    "Motorcycle Shops and Dealers",
    "Cars Sales",
    "Farm Automobile and Accessories",
    "Parts and Accessories",
  ],

  "Electronics Furniture and Home Products": [
    "Household Appliance Stores",
    "Furniture Store",
    "Nursery Supplies",
    "Home Furnishing",
    "Electronics",
    "Furniture leasing",
  ],

  "Construction and Industrial Products": [
    "Chemicals Products",
    "Plumbing and Heating Equipment",
    "Construction Materials",
    "Hardware Stores",
    "Paints Supplies",
    "Industrial Supplies",
    "Electrical Parts",
    "Glass and Wallpaper Stores",
  ],

  "Arts Gifts and Stationery": [
    "Florists",
    "Art and Craft Supply",
    "Hobby Toy and Game Shops",
    "Sporting Goods Stores",
    "Art Dealers and Galleries",
    "Gifts and Souvenir Shops",
    "Stationery and School Supply Stores",
    "Book Stores",
  ],

  "Digital Products": [
    "Digital Media - Books Magazines etc",
    "Online games",
  ],

  Events: [
    "Events and Conferences",
    "Caterers",
  ],

  Healthcare: [
    "Veterinary Services",
    "Nutrition and Supplements",
    "Optical Goods",
    "Doctors and Physicians",
    "Hospital Equipments and Supplies",
    "Other Healthcare services",
    "Laboratories and diagnostics services",
    "Hospitals",
    "Drug Stores and Pharmacies",
  ],

  "Travel and Transportation": [
    "Cabs",
    "Movers and Packers",
    "Travel Agencies",
    "Cruises",
    "Metros/Railways",
    "Courier Services",
    "Hotels and Lodges",
    "Airlines",
    "Bus",
    "Other Transportation Services",
  ],

  "IT Services": [
    "Computer Maintenance",
    "Computers Equipment and Software",
    "Web hosting and IT Services",
    "Mobile Applications",
    "Computer Software Stores",
  ],

  "Bill Payments": [
    "Internet service Providers",
    "Mobile Recharge and Landline Bills",
    "Cable TV services",
    "Other Bill Payments",
  ],
};

export default function BusinessDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    businessCategory: "",
    businessSubCategory: "",
    expectedMonthlySales: "",
    gstin: "",
    cin: "",
        tradeName: "",

    operatingAddress: "",
    operatingCity: "",
    operatingState: "",
    operatingPincode: "",

    registrationAddress: "",
    registrationCity: "",
    registrationState: "",
    registrationPincode: "",
  });

  const [sameAddress, setSameAddress] = useState(false);
  const [error, setError] = useState("");
  const [merchant, setMerchant] = useState(null);
const [loadingMerchant, setLoadingMerchant] = useState(true);

useEffect(() => {
  const loadMerchant = async () => {
    try {
     const merchantId = id;

      if (!merchantId) {
        setError(
          "Merchant session not found. Please start the onboarding again."
        );
        return;
      }

      const response = await getMerchant(merchantId);

      console.log(
        "BUSINESS PAGE MERCHANT:",
        response
      );

    if (response?.success) {
  const merchantData = response.data;

  setMerchant(merchantData);

  const business = merchantData?.businessInformation;

  if (business) {
    setForm({
      businessCategory: business.businessCategory || "",
      businessSubCategory: business.businessSubCategory || "",
      expectedMonthlySales: business.expectedMonthlySales || "",
      gstin: business.gstin || "",
      cin: business.cin || "",
      tradeName: business.tradeName || "",

      operatingAddress: business.operatingAddress || "",
      operatingCity: business.operatingCity || "",
      operatingState: business.operatingState || "",
      operatingPincode: business.operatingPincode || "",

      registrationAddress: business.registrationAddress || "",
      registrationCity: business.registrationCity || "",
      registrationState: business.registrationState || "",
      registrationPincode: business.registrationPincode || "",
    });

    const isSame =
  business.registrationAddress === business.operatingAddress &&
  business.registrationCity === business.operatingCity &&
  business.registrationState === business.operatingState &&
  business.registrationPincode === business.operatingPincode;

setSameAddress(isSame);
  }

} else {
        setError(
          response?.message ||
          "Unable to load merchant details."
        );
      }

    } catch (error) {

      console.error(
        "BUSINESS MERCHANT LOAD ERROR:",
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
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleCategoryChange = (e) => {
    setForm((prev) => ({
      ...prev,
      businessCategory: e.target.value,
      businessSubCategory: "",
    }));

    setError("");
  };

  const handleSameAddress = (e) => {
    const checked = e.target.checked;

    setSameAddress(checked);

    if (checked) {
      setForm((prev) => ({
        ...prev,
        registrationAddress: prev.operatingAddress,
        registrationCity: prev.operatingCity,
        registrationState: prev.operatingState,
        registrationPincode: prev.operatingPincode,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        registrationAddress: "",
        registrationCity: "",
        registrationState: "",
        registrationPincode: "",
      }));
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!form.businessCategory) {
      setError("Please select a business category.");
      return;
    }

    if (!form.businessSubCategory) {
      setError("Please select a business sub-category.");
      return;
    }
//     if (!form.tradeName.trim()) {
//   setError("Please enter the trade name.");
//   return;
// }

    if (!form.expectedMonthlySales) {
      setError("Please enter the expected monthly sales.");
      return;
    }

    if (!form.operatingAddress.trim()) {
      setError("Operating address is required.");
      return;
    }

    if (!form.operatingCity.trim()) {
      setError("Operating city is required.");
      return;
    }

    if (!form.operatingState.trim()) {
      setError("Operating state is required.");
      return;
    }

    if (!form.operatingPincode.trim()) {
      setError("Operating pincode is required.");
      return;
    }

    if (!sameAddress) {
      if (!form.registrationAddress.trim()) {
        setError("Registration address is required.");
        return;
      }

      if (!form.registrationCity.trim()) {
        setError("Registration city is required.");
        return;
      }

      if (!form.registrationState.trim()) {
        setError("Registration state is required.");
        return;
      }

      if (!form.registrationPincode.trim()) {
        setError("Registration pincode is required.");
        return;
      }
    }

    setError("");

try {
 const merchantId = id;

  if (!merchantId) {
    setError(
      "Merchant session not found. Please start the onboarding again."
    );
    return;
  }

  const response = await updateBusinessInformation(
    merchantId,
    form
  );

  console.log(
    "BUSINESS DETAILS RESPONSE:",
    response
  );

  if (!response?.success) {
    setError(
      response?.message ||
      "Unable to save business details."
    );
    return;
  }

 navigate(
  `/agent/merchant/${merchantId}/website`
);

} catch (error) {

  console.error(
    "BUSINESS DETAILS ERROR:",
    error
  );

  setError(
    error?.response?.data?.message ||
    "Unable to save business details. Please try again."
  );
}
  };

  const subCategories =
    categories[form.businessCategory] || [];

  return (
    <div className="business-page">
      <div className="business-container">

        {/* HEADER */}
        <div className="business-header">
          <p className="business-step">STEP 05 OF 12</p>

          <h1>Business Details</h1>

          <p>
            Provide the merchant's business information and address details.
          </p>
        </div>


        {/* PROGRESS */}
        <div className="business-progress-card">

          {[
            ["✓", "Basic Details", "completed"],
            ["✓", "PAN & DOB", "completed"],
            ["✓", "CKYC", "completed"],
            ["✓", "Bank Details", "completed"],
            ["5", "Business Details", "active"],
          ].map((item, index) => (
            <div className="business-progress-wrapper" key={item[1]}>

              <div className={`business-progress-item ${item[2]}`}>

                <div className="business-progress-circle">
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

              {index < 4 && (
                <div className="business-progress-line active" />
              )}

            </div>
          ))}

        </div>


        {/* ERROR */}
        {error && (
          <div className="business-alert">
            <div className="business-alert-icon">!</div>
            <span>{error}</span>
          </div>
        )}
        {/* MERCHANT SUMMARY */}
<section className="business-section">

  <div className="business-section-heading">

    <div className="business-section-icon">
      M
    </div>

    <div>
      <h2>Merchant Information</h2>

      <p>
        Details associated with this merchant onboarding.
      </p>
    </div>

  </div>

  <div className="business-summary">

    <div className="business-summary-item">
      <span>Merchant Name</span>

      <strong>
        {loadingMerchant
          ? "Loading..."
          : merchant?.merchantName || "-"}
      </strong>
    </div>

    <div className="business-summary-item">
      <span>Business Entity</span>

      <strong>
        {loadingMerchant
          ? "Loading..."
          : merchant?.entityType || "-"}
      </strong>
    </div>

    <div className="business-summary-item">
      <span>PAN Number</span>

      <strong>
        {loadingMerchant
          ? "Loading..."
          : merchant?.panNumber || "-"}
      </strong>
    </div>

    <div className="business-summary-item">
      <span>Shop Name</span>

      <strong>
        {loadingMerchant
          ? "Loading..."
          : merchant?.shopName || "-"}
      </strong>
    </div>

  </div>

</section>


        <form onSubmit={handleContinue}>

          {/* BUSINESS INFORMATION */}
          <section className="business-section">

            <div className="business-section-heading">

              <div className="business-section-icon">
                B
              </div>

              <div>
                <h2>Business Information</h2>

                <p>
                  Enter the business category and expected transaction volume.
                </p>
              </div>

            </div>


            <div className="business-form-grid">

              {/* CATEGORY */}
              <div className="business-form-group">

                <label>
                  Business Category <span>*</span>
                </label>

                <select
                  name="businessCategory"
                  value={form.businessCategory}
                  onChange={handleCategoryChange}
                  className="business-input"
                >
                  <option value="">
                    Select business category
                  </option>

                  {Object.keys(categories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

              </div>


              {/* SUB CATEGORY */}
              <div className="business-form-group">

                <label>
                  Business Sub Category <span>*</span>
                </label>

                <select
                  name="businessSubCategory"
                  value={form.businessSubCategory}
                  onChange={handleChange}
                  className="business-input"
                  disabled={!form.businessCategory}
                >
                  <option value="">
                    {form.businessCategory
                      ? "Select sub category"
                      : "Select category first"}
                  </option>

                  {subCategories.map((subCategory) => (
                    <option
                      key={subCategory}
                      value={subCategory}
                    >
                      {subCategory}
                    </option>
                  ))}
                </select>

              </div>


{/* <div className="business-form-group">
  <label>
    Trade Name <span>*</span>
  </label>

  <input
    type="text"
    name="tradeName"
    value={form.tradeName}
    onChange={handleChange}
    placeholder="Enter business / trade name"
    className="business-input"
  />
</div> */}

              {/* MONTHLY SALES */}
              <div className="business-form-group">

                <label>
                  Expected Monthly Sales <span>*</span>
                </label>

                <div className="business-money-input">
                  <span>₹</span>

                  <input
                    type="number"
                    name="expectedMonthlySales"
                    value={form.expectedMonthlySales}
                    onChange={handleChange}
                    placeholder="500000"
                  />
                </div>

                <small>
                  Expected monthly transaction volume.
                </small>

              </div>


              {/* GSTIN */}
              <div className="business-form-group">

                <label>
                  GSTIN
                  <em>Optional</em>
                </label>

                <input
                  type="text"
                  name="gstin"
                  value={form.gstin}
                  onChange={handleChange}
                  placeholder="Enter GSTIN"
                  className="business-input"
                  maxLength={15}
                />

              </div>


              {/* CIN */}
              <div className="business-form-group full">

                <label>
                  CIN
                  <em>Optional</em>
                </label>

                <input
                  type="text"
                  name="cin"
                  value={form.cin}
                  onChange={handleChange}
                  placeholder="Enter Corporate Identification Number"
                  className="business-input"
                />

              </div>

            </div>

          </section>


          {/* OPERATING ADDRESS */}
          <section className="business-section">

            <div className="business-section-heading">

              <div className="business-section-icon">
                O
              </div>

              <div>
                <h2>Operating Address</h2>

                <p>
                  Address where the merchant's business operates.
                </p>
              </div>

            </div>


            <div className="business-form-grid">

              <div className="business-form-group full">

                <label>
                  Address <span>*</span>
                </label>

                <textarea
                  name="operatingAddress"
                  value={form.operatingAddress}
                  onChange={handleChange}
                  placeholder="Enter complete operating address"
                  className="business-textarea"
                  rows="3"
                />

              </div>


              <div className="business-form-group">

                <label>
                  City <span>*</span>
                </label>

                <input
                  type="text"
                  name="operatingCity"
                  value={form.operatingCity}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="business-input"
                />

              </div>


              <div className="business-form-group">

                <label>
                  State <span>*</span>
                </label>

                <input
                  type="text"
                  name="operatingState"
                  value={form.operatingState}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="business-input"
                />

              </div>


              <div className="business-form-group">

                <label>
                  Pincode <span>*</span>
                </label>

                <input
                  type="text"
                  name="operatingPincode"
                  value={form.operatingPincode}
                  onChange={handleChange}
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                  className="business-input"
                />

              </div>

            </div>

          </section>


          {/* REGISTRATION ADDRESS */}
          <section className="business-section">

            <div className="business-section-heading">

              <div className="business-section-icon">
                R
              </div>

              <div>
                <h2>Registration Address</h2>

                <p>
                  Registered business address as per merchant records.
                </p>
              </div>

            </div>


            <label className="business-checkbox">

              <input
                type="checkbox"
                checked={sameAddress}
                onChange={handleSameAddress}
              />

              <span>
                Same as operating address
              </span>

            </label>


            {!sameAddress && (
              <div className="business-form-grid">

                <div className="business-form-group full">

                  <label>
                    Address <span>*</span>
                  </label>

                  <textarea
                    name="registrationAddress"
                    value={form.registrationAddress}
                    onChange={handleChange}
                    placeholder="Enter complete registration address"
                    className="business-textarea"
                    rows="3"
                  />

                </div>


                <div className="business-form-group">

                  <label>
                    City <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="registrationCity"
                    value={form.registrationCity}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="business-input"
                  />

                </div>


                <div className="business-form-group">

                  <label>
                    State <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="registrationState"
                    value={form.registrationState}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="business-input"
                  />

                </div>


                <div className="business-form-group">

                  <label>
                    Pincode <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="registrationPincode"
                    value={form.registrationPincode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                    className="business-input"
                  />

                </div>

              </div>
            )}

          </section>


          {/* INFO */}
          <div className="business-info">

            <div className="business-info-icon">
              i
            </div>

            <div>

              <strong>Business Information</strong>

              <p>
                Make sure the category and sub-category accurately describe
                the merchant's business. These details are used during
                PayU merchant onboarding and verification.
              </p>

            </div>

          </div>


          {/* ACTIONS */}
          <div className="business-actions">

            <button
              type="button"
              className="business-btn secondary"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            <button
              type="submit"
              className="business-btn primary"
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