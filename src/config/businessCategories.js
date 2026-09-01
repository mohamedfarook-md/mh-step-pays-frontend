// ======================================================
// PAYU BUSINESS CATEGORIES & SUB CATEGORIES
// ======================================================

export const BUSINESS_CATEGORIES = [
    {
        name: "Professional Services",
        subcategories: [
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
    },

    {
        name: "Real Estate",
        subcategories: [
            "Booking amount",
            "Repayment (Loans)",
            "Others",
            "Rental/Sales - housing and commercial",
        ],
    },

    {
        name: "Educational Services",
        subcategories: [
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
    },

    {
        name: "Government",
        subcategories: [
            "Property Tax",
            "Water Tax",
            "Recruitment",
            "Political Party",
            "Fees",
            "Tax and Fines",
            "Government Services",
            "Others",
        ],
    },

    {
        name: "Financial Services",
        subcategories: [
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
    },

    {
        name: "Donations/Crowdfunding",
        subcategories: [
            "Membership Organisations",
            "Political Organisations",
            "Religious Organisations",
            "NGO",
        ],
    },

    {
        name: "Entertainment",
        subcategories: [
            "Movie Theatres / Tickets",
            "Dance Halls",
            "OTT",
            "Amusement Parks",
            "Game Arcades",
        ],
    },

    {
        name: "Personal Services",
        subcategories: [
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
    },

    {
        name: "Online MarketPlace",
        subcategories: [
            "Online MarketPlace",
        ],
    },

    {
        name: "Fashion and Accessories",
        subcategories: [
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
    },

    {
        name: "Food and Groceries",
        subcategories: [
            "Meat Stores",
            "Restaurants/Food Delivery/Takeaways",
            "Bakeries",
            "Confectionery",
            "Grocery/Supermarket",
            "Bars and Nightclubs",
            "Gourmet and Other food stores",
            "Dairy Products",
        ],
    },

    {
        name: "Automobiles",
        subcategories: [
            "Bicycle Shops - Sales and Service",
            "Motorcycle Shops and Dealers",
            "Cars Sales",
            "Farm Automobile and Accessories",
            "Parts and Accessories",
        ],
    },

    {
        name: "Electronics Furniture and Home Products",
        subcategories: [
            "Household Appliance Stores",
            "Furniture Store",
            "Nursery Supplies",
            "Home Furnishing",
            "Electronics",
            "Furniture leasing",
        ],
    },

    {
        name: "Construction and Industrial Products",
        subcategories: [
            "Chemicals Products",
            "Plumbing and Heating Equipment",
            "Construction Materials",
            "Hardware Stores",
            "Paints Supplies",
            "Industrial Supplies",
            "Electrical Parts",
            "Glass and Wallpaper Stores",
        ],
    },

    {
        name: "Arts Gifts and Stationery",
        subcategories: [
            "Florists",
            "Art and Craft Supply",
            "Hobby Toy and Game Shops",
            "Sporting Goods Stores",
            "Art Dealers and Galleries",
            "Gifts and Souvenir Shops",
            "Stationery and School Supply Stores",
            "Book Stores",
        ],
    },

    {
        name: "Digital Products",
        subcategories: [
            "Digital Media - Books Magazines etc",
            "Online games",
        ],
    },

    {
        name: "Events",
        subcategories: [
            "Events and Conferences",
            "Caterers",
        ],
    },

    {
        name: "Healthcare",
        subcategories: [
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
    },

    {
        name: "Travel and Transportation",
        subcategories: [
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
    },

    {
        name: "IT Services",
        subcategories: [
            "Computer Maintenance",
            "Computers Equipment and Software",
            "Web hosting and IT Services",
            "Mobile Applications",
            "Computer Software Stores",
        ],
    },

    {
        name: "Bill Payments",
        subcategories: [
            "Internet service Providers",
            "Mobile Recharge and Landline Bills",
            "Cable TV services",
            "Other Bill Payments",
        ],
    },
];


// ======================================================
// GET CATEGORY
// ======================================================

export const getBusinessCategory = (categoryName) => {
    return BUSINESS_CATEGORIES.find(
        (category) => category.name === categoryName
    );
};


// ======================================================
// GET SUB CATEGORIES
// ======================================================

export const getBusinessSubCategories = (categoryName) => {
    const category = getBusinessCategory(categoryName);

    return category?.subcategories || [];
};


// ======================================================
// CATEGORY OPTIONS
// ======================================================

export const BUSINESS_CATEGORY_OPTIONS =
    BUSINESS_CATEGORIES.map((category) => ({
        value: category.name,
        label: category.name,
    }));


// ======================================================
// SUB CATEGORY OPTIONS
// ======================================================

export const getBusinessSubCategoryOptions = (categoryName) => {
    return getBusinessSubCategories(categoryName).map(
        (subcategory) => ({
            value: subcategory,
            label: subcategory,
        })
    );
};