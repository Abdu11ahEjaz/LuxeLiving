import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
import {
  Search,
  Home,
  Building2,
  Layers,
  ChevronDown,
  Upload,
  Phone,
  Wifi,
  Check,
} from "lucide-react";
import { Input } from "./Input.jsx";
import { Textarea } from "./TextArea.jsx";
import { Switch } from "./Switch.jsx";
import Button from "./Button.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select.jsx";
import SellPageTop from "./SellPageTop.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import AuthModal from "./AuthModal.jsx";
import FeaturesAmenitiesModal from "./FeaturesAmenitiesModal.jsx";

const SellProperty = ({ initialPurpose = "sell" }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [listingType, setListingType] = useState(initialPurpose);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);

  // Loading and error states for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize formData FIRST (before useEffect uses it)
  const [propertyCategory, setPropertyCategory] = useState("residential");
  const [selectedPropertyType, setSelectedPropertyType] = useState("house");
  const [selectedBedrooms, setSelectedBedrooms] = useState("1");
  const [selectedBathrooms, setSelectedBathrooms] = useState("1");
  const [features, setFeatures] = useState([]);
  const [formData, setFormData] = useState({
    propertyName: "",
    description: "",
    city: "",
    area: "",
    size: "",
    sizeUnit: "marla",
    price: "",
    condition: "",
    phone: "+92",
    name: "",
    availability: false,
  });

  // Update listingType when initialPurpose changes (e.g., when navigating from query param)
  useEffect(() => {
    if (initialPurpose) {
      setListingType(initialPurpose);
    }
  }, [initialPurpose]);

  // Fetch areas when city changes (NOW formData is initialized)
  useEffect(() => {
    if (formData.city) {
      setLoadingAreas(true);
      axios
        .get(`${API_BASE_URL}/areas/city/${encodeURIComponent(formData.city)}`)
        .then((res) => {
          setAvailableAreas(res.data.map((area) => area.name));
          setAreaDropdownOpen(true);
        })
        .catch((err) => {
          console.error("Error fetching areas:", err);
          setAvailableAreas([]);
        })
        .finally(() => setLoadingAreas(false));
    } else {
      setAvailableAreas([]);
    }
  }, [formData.city]);

  // Pakistani cities list
  const pakistaniCities = [
    "Islamabad",
    "Rawalpindi",
    "Lahore",
    "Karachi",
    "Peshawar",
    "Faisalabad",
    "Multan",
    "Gujranwala",
    "Hyderabad",
    "Quetta",
    "Sialkot",
    "Bahawalpur",
    "Sukkur",
    "Larkana",
    "Kohat",
    "Dera Ghazi Khan",
    "Abbottabad",
    "Muzaffarabad",
    "Gilgit",
    "Skardu",
    "Mardan",
    "Nowshera",
    "Chakwal",
    "Jhelum",
    "Sargodha",
    "Mianwali",
    "Bhakkar",
    "Layyah",
    "Khushab",
    "Toba Tek Singh",
    "Gujrat",
    "Mandi Bahauddin",
    "Hafizabad",
    "Narowal",
    "Kasur",
    "Okara",
    "Pakpattan",
    "Vehari",
    "Lodhran",
    "Khanewal",
    "Bahawalnagar",
    "Rahim Yar Khan",
    "Sanghar",
    "Mirpurkhas",
    "Umerkot",
    "Tharparkar",
    "Badin",
    "Thatta",
    "Dadu",
    "Naushahro Feroze",
    "Kashmore",
    "Ghotki",
    "Jacobabad",
    "Kamber Ali Khan",
    "Khanpur",
    "Zhob",
    "Dera Ismail Khan",
    "Tank",
    "Karak",
    "Bannu",
    "Lakki Marwat",
    "North Waziristan",
    "South Waziristan",
    "Kurram",
    "Orakzai",
    "Khyber",
    "Mohmand",
    "Bajaur",
    "Malakand",
    "Swat",
    "Shangla",
    "Buner",
    "Kohistan",
    "Mansehra",
    "Haripur",
    "Torghar",
    "Attock",
    "Kamoke",
    "Muridke",
    "Nankana Sahib",
    "Sheikhupura",
    "Sahiwal",
    "Muzaffargarh",
    "Rajanpur",
    "Khewat",
    "Talagang",
    "Ahmadpur",
    "Jhang",
    "Tarnab",
    "Jamshoro",
    "Matiari",
    "Tando Allahyar",
    "Tando Muhammad Khan",
    "Sujawal",
    "Shikarpur",
    "Shaheed Benazirabad",
    "Qambar Shahdadkot",
    "Mirpur",
    "Swabi",
    "Charsadda",
    "Waziristan",
    "Hangu",
    "Ziarat",
    "Chagai",
    "Nushki",
    "Kharan",
    "Washuk",
    "Awaran",
    "Kech",
    "Gwadar",
    "Ormara",
    "Pasni",
    "Jiwani",
    "Turbat",
  ];

  // Filter cities based on search term
  const filteredCities = pakistaniCities.filter((city) =>
    city.toLowerCase().includes(formData.city.toLowerCase()),
  );

  const propertyTypes = [
    { id: "house", label: "House", icon: Home },
    { id: "flat", label: "Flat", icon: Building2 },
    { id: "lower-portion", label: "Lower Portion", icon: Home },
    { id: "upper-portion", label: "Upper Portion", icon: Home },
    { id: "room", label: "Room", icon: Home },
    { id: "farm-house", label: "Farm House", icon: Home },
    { id: "guest-house", label: "Guest House", icon: Home },
    { id: "pent-house", label: "Pent House", icon: Building2 },
    { id: "annexe", label: "Annexe", icon: Layers },
    { id: "hostel", label: "Hostel", icon: Building2 },
    { id: "hotel-suites", label: "Hotel Suites", icon: Building2 },
  ];

  const bedroomOptions = [
    "Studio",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10+",
  ];
  const bathroomOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [selectedDays, setSelectedDays] = useState([]);

  // Image upload state
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);

  // Format price for display below input
  const formatPriceInput = (price) => {
    if (!price || price === "") return "PKR 0";

    const num = parseFloat(price);
    if (isNaN(num)) return "PKR 0";

    if (num >= 10000000) {
      return `PKR ${(num / 10000000).toFixed(num % 10000000 === 0 ? 0 : 1)} Crore`;
    } else if (num >= 100000) {
      return `PKR ${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)} Lac`;
    } else if (num >= 1000) {
      return `PKR ${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)} Thousand`;
    }
    return `PKR ${num.toLocaleString()}`;
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setUploadedImages((prev) => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    }
  };

  // Remove uploaded image
  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  // Submit property to backend
  const handleSubmitProperty = async () => {
    if (!user) {
      setAuthMode("signin");
      setShowAuthModal(true);
      return;
    }

    // Validate required fields
    if (
      !formData.city ||
      !formData.area ||
      !formData.price ||
      !formData.propertyName
    ) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSubmitError("You must be logged in to submit a property");
        return;
      }

      // Map "sell" to "sale" for backend enum
      const purposeMap = { sell: "sale", rent: "rent" };

      // Map frontend subCategory values to backend enum values
      const subCategoryMap = {
        house: "house",
        flat: "flat",
        "lower-portion": "lower Portion",
        "upper-portion": "upper Portion",
        room: "room",
        "farm-house": "farm house",
        "guest-house": "guest house",
        "pent-house": "pent house",
        annexe: "annexe",
        hostel: "hostel",
        "hotel-suites": "hostel suites",
      };

      // Prepare form data with mapped fields matching backend schema
      const propertyData = {
        title: formData.propertyName,
        description: formData.description || "No description provided",
        purpose: purposeMap[listingType] || listingType, // Map "sell" to "sale"
        mainCategory: propertyCategory, // "residential", "plot", "commercial"
        subCategory:
          subCategoryMap[selectedPropertyType] || selectedPropertyType,
        city: formData.city,
        area: formData.area,
        address: formData.area,
        price: parseFloat(formData.price),
        areaSize: formData.size ? parseFloat(formData.size) : null,
        areaUnit: formData.sizeUnit,
        bedrooms: selectedBedrooms
          ? selectedBedrooms === "Studio"
            ? 0
            : selectedBedrooms === "10+"
              ? 10
              : parseInt(selectedBedrooms)
          : undefined,
        bathrooms: selectedBathrooms
          ? selectedBathrooms === "10+"
            ? 10
            : parseInt(selectedBathrooms)
          : undefined,
        features: features,
        phone: formData.phone,
        availability: formData.availability,
        availableDays: selectedDays,
      };

      // Validate required fields
      const requiredFields = {
        title: propertyData.title,
        description: propertyData.description,
        purpose: propertyData.purpose,
        mainCategory: propertyData.mainCategory,
        subCategory: propertyData.subCategory,
        city: propertyData.city,
        price: propertyData.price
      };

      const missingFields = Object.keys(requiredFields).filter(
        (key) => !requiredFields[key] && requiredFields[key] !== 0
      );

      if (missingFields.length > 0) {
        setSubmitError(
          `Missing required fields: ${missingFields.join(", ")}`
        );
        console.error("Missing required fields:", missingFields);
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Append all property fields
      Object.keys(propertyData).forEach((key) => {
        if (propertyData[key] !== undefined && propertyData[key] !== null) {
          if (Array.isArray(propertyData[key])) {
            formDataToSend.append(key, JSON.stringify(propertyData[key]));
          } else {
            formDataToSend.append(key, propertyData[key]);
          }
        }
      });

      // Append images
      uploadedImages.forEach((img) => {
        if (img.file) {
          formDataToSend.append("images", img.file);
        }
      });

      console.log("📤 Sending property data...");

      const response = await axios.post(
        `${API_BASE_URL}/api/properties`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.property) {
        setSubmitSuccess(true);
        // Reset form after successful submission
        setFormData({
          propertyName: "",
          description: "",
          city: "",
          area: "",
          size: "",
          sizeUnit: "marla",
          price: "",
          condition: "",
          phone: "+92",
          name: "",
          availability: false,
        });
        setSelectedBedrooms("1");
        setSelectedBathrooms("1");
        setSelectedDays([]);
        setFeatures([]);
        setUploadedImages([]);
        setPropertyCategory("residential");
        setSelectedPropertyType("house");

        // Navigate to profile after 2 seconds
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit property. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* <SellPageTop /> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start justify-center">
          {/* Left Side - Form */}
          <div className="w-full lg:flex-1 max-w-xl mx-auto lg:mx-0">
            {/* What do you want to do? */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                What do you want to do?
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setListingType("sell")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                    listingType === "sell"
                      ? "border-gray-900 bg-white text-gray-900"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Sell
                </button>
                <button
                  onClick={() => setListingType("rent")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                    listingType === "rent"
                      ? "border-gray-900 bg-white text-gray-900"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Rent
                </button>
              </div>
            </div>

            {/* Property Category & Type */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                What kind of property do you have?
              </h3>

              {/* Category Tabs - dropdown on small screens, tabs on md+ */}
              <div className="block md:hidden mb-6">
                <Select
                  value={propertyCategory}
                  onValueChange={(value) => setPropertyCategory(value)}
                >
                  <SelectTrigger className="w-full border-gray-300 rounded-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border border-gray-200 shadow-lg">
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="hidden md:flex gap-0 mb-6 border-b border-gray-200">
                {["residential", "plot", "commercial"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPropertyCategory(cat)}
                    className={`px-6 py-3 text-sm font-medium capitalize transition-all ${
                      propertyCategory === cat
                        ? "text-gray-900 border-b-2 border-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Property Types Grid */}
              <div className="grid grid-cols-3 gap-3">
                {propertyTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedPropertyType(type.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                        selectedPropertyType === type.id
                          ? "border-gray-900 bg-white text-gray-900"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* City Selection */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Which city is your property in?
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Select your city"
                  value={formData.city}
                  onChange={(e) => {
                    handleInputChange("city", e.target.value);
                    setCityDropdownOpen(true);
                  }}
                  onFocus={() => setCityDropdownOpen(true)}
                  className="pl-10 py-3 border-gray-300 rounded-lg"
                />
                {/* City Dropdown */}
                {cityDropdownOpen && formData.city && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCities.length > 0 ? (
                      filteredCities.slice(0, 10).map((city, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            handleInputChange("city", city);
                            setCityDropdownOpen(false);
                          }}
                          className="px-4 py-2 hover:bg-red-50 cursor-pointer text-gray-700"
                        >
                          {city}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        No cities found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Area Selection */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Which area is your property in?
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Address, block, phase, city etc."
                  value={formData.area}
                  onChange={(e) => {
                    handleInputChange("area", e.target.value);
                    // Filter available areas based on input
                    const filtered = availableAreas.filter((area) =>
                      area.toLowerCase().includes(e.target.value.toLowerCase())
                    );
                    setFilteredAreas(filtered);
                    // Only show dropdown if user has typed something
                    if (e.target.value.length > 0) {
                      setAreaDropdownOpen(true);
                    } else {
                      setAreaDropdownOpen(false);
                    }
                  }}
                  onFocus={() => {
                    // Only show dropdown if user has typed something
                    if (formData.area.length > 0 && availableAreas.length > 0) {
                      setAreaDropdownOpen(true);
                    }
                  }}
                  className="pl-10 py-3 border-gray-300 rounded-lg"
                  disabled={!formData.city}
                />
                {/* Area Dropdown */}
                {areaDropdownOpen && formData.city && formData.area && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredAreas.length > 0 ? (
                      filteredAreas.slice(0, 10).map((area, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            handleInputChange("area", area);
                            setAreaDropdownOpen(false);
                          }}
                          className="px-4 py-2 hover:bg-red-50 cursor-pointer text-gray-700"
                        >
                          {area}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        No areas found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Helper text */}
              {formData.city && availableAreas.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Select from available areas or enter a custom area name
                </p>
              )}
            </div>

            {/* Property Size */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center mb-4">
              {/* Size Input */}
              <div className="sm:col-span-2 w-full">
                <Input
                  type="number"
                  placeholder="Enter size"
                  value={formData.size}
                  onChange={(e) => handleInputChange("size", e.target.value)}
                  className="w-full border-gray-300 text-black bg-white h-14 text-lg 
      pr-10 appearance-textfield"
                  style={{
                    MozAppearance: "textfield",
                  }}
                />
              </div>

              {/* Size Unit Select */}
              <div className="w-full">
                <Select
                  value={formData.sizeUnit}
                  onValueChange={(value) =>
                    handleInputChange("sizeUnit", value)
                  }
                >
                  <SelectTrigger className="h-14 text-lg w-full border-gray-300">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="sqft">Sq Ft</SelectItem>
                    <SelectItem value="sqm">Sq Meter</SelectItem>
                    <SelectItem value="marla">Marla</SelectItem>
                    <SelectItem value="kanal">Kanal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Asking Price */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                What is the asking price?
              </h3>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="pr-16 border-gray-300"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E85A50] font-medium text-sm">
                  PKR
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formData.price ? formatPriceInput(formData.price) : "PKR 0"}
              </p>
            </div>

            {/* Bedrooms */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                How many bedrooms does it have?
              </h3>
              <div className="flex flex-wrap gap-2">
                {bedroomOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedBedrooms(option)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                      selectedBedrooms === option
                        ? "border-gray-900 bg-white text-gray-900"
                        : "border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                How many bathrooms does it have?
              </h3>
              <div className="flex flex-wrap gap-2">
                {bathroomOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedBathrooms(option)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                      selectedBathrooms === option
                        ? "border-gray-900 bg-white text-gray-900"
                        : "border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Name */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Name your property
              </h3>
              <Input
                placeholder="Name your property"
                value={formData.propertyName}
                onChange={(e) =>
                  handleInputChange("propertyName", e.target.value)
                }
                className="border-gray-300"
              />
            </div>

            {/* Property Condition */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                What is the condition of your property?
              </h3>
              <Select
                value={formData.condition}
                onValueChange={(value) => handleInputChange("condition", value)}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select the condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand-new">Brand New</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="needs-renovation">
                    Needs Renovation
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                What amenities are available?
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Add additional features e.g balcony, utilities, security details
                etc. (Optional)
              </p>
              <button
                onClick={() => setShowFeaturesModal(true)}
                className="text-[#2B8A6E] font-medium text-sm flex items-center gap-1"
              >
                + ADD FEATURES
              </button>
              {/* Selected features display */}
              {features.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                What do you love about the place?
              </h3>
              <Textarea
                placeholder="Describe your property in detail"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="border-gray-300 min-h-[120px]"
              />
              <p className="text-sm text-gray-500 mt-1">Optional</p>
            </div>

            {/* Upload Images Section */}
            <div className="mb-8 border-t border-gray-200 pt-8">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Upload images of your property
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                Properties with images of good quality generate{" "}
                <span className="font-semibold">8X more leads.</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supported file formats: png, jpeg, jpg (Max 5 images)
              </p>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/png,image/jpeg,image/jpg"
                multiple
                className="hidden"
              />

              {/* Upload button */}
              <button
                onClick={triggerFileInput}
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 font-medium hover:border-gray-400 transition-colors"
              >
                <Upload className="w-4 h-4" />
                UPLOAD IMAGES
              </button>

              {/* Image previews */}
              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className="mb-6 border-t border-gray-200 pt-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Tell us how to contact you
              </h3>
              <div className="flex">
                <div className="flex items-center gap-2 px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                  <Phone className="w-4 h-4 text-[#2B8A6E]" />
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </div>
                <Input
                  placeholder="+92"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="flex-1 rounded-l-none border-gray-300"
                />
              </div>
            </div>

            {/* Name */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                What is your name?
              </h3>
              <Input
                placeholder="What is your name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="border-gray-300"
              />
            </div>

            {/* Availability */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Specify availability
                  </h3>
                  <p className="text-sm text-gray-500">
                    Let us know when you are available for site visits
                    (Optional)
                  </p>
                </div>
                {/* Custom Toggle Button */}
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange("availability", !formData.availability)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.availability ? "bg-[#2B8A6E]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.availability ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Day Selection - Shows when toggle is ON */}
              {formData.availability && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Select days:</p>
                  <div className="flex flex-wrap gap-2">
                    {weekdays.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                          selectedDays.includes(day)
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-300 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              {/* Error/Success Messages */}
              {submitError && (
                <div className="w-full mb-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="w-full mb-2 p-3 bg-green-50 text-green-600 text-sm rounded-lg">
                  Property submitted successfully! Redirecting to profile...
                </div>
              )}

              <button
                onClick={() => {
                  if (!user) {
                    setAuthMode("signin");
                    setShowAuthModal(true);
                  } else {
                    handleSubmitProperty();
                  }
                }}
                disabled={isSubmitting}
                className="bg-[#2D3436] w-fit hover:bg-[#1e2526] text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT FOR REVIEW"}
              </button>
            </div>
          </div>

          {/* Right Side - Phone Preview */}
          <div className="w-full lg:w-auto flex justify-center lg:sticky lg:top-10 lg:h-fit">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4 text-center lg:text-left">
                Preview
              </h3>
              <PhonePreview
                formData={formData}
                selectedPropertyType={selectedPropertyType}
                features={features}
                uploadedImages={uploadedImages}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal for login prompt */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      {/* Features & Amenities Modal */}
      <FeaturesAmenitiesModal
        isOpen={showFeaturesModal}
        onClose={() => setShowFeaturesModal(false)}
        initialFeatures={features}
        onConfirm={(selectedFeatures) => {
          setFeatures(selectedFeatures);
        }}
      />
    </>
  );
};

// Phone Preview Component
const PhonePreview = ({
  formData,
  selectedPropertyType,
  features,
  uploadedImages = [],
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  // Format price in Pakistani Rupee format (thousand, lakh, crore)
  const formatPrice = (price) => {
    if (!price || price === "") return "Enter Price";

    const num = parseFloat(price);
    if (isNaN(num)) return "Enter Price";

    if (num >= 10000000) {
      // Crore/Arab
      return `${(num / 10000000).toFixed(num % 10000000 === 0 ? 0 : 1)} Crore`;
    } else if (num >= 100000) {
      // Lakh
      return `${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)} Lac`;
    } else if (num >= 1000) {
      // Thousand
      return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)} Thousand`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="w-[220px] sm:w-[240px] md:w-[260px] lg:w-[280px] h-[460px] sm:h-[500px] md:h-[540px] lg:h-[580px] bg-white border-[8px] border-gray-800 rounded-[40px] overflow-hidden shadow-xl">
      {/* Phone Status Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 py-1 sm:py-2 bg-white">
        <span className="text-[10px] sm:text-xs font-medium text-gray-900">
          {formatTime(currentTime)}
        </span>
        <div className="flex items-center gap-1">
          <Wifi className="text-gray-900 ml-1 w-4 h-4 sm:w-4 sm:h-4" />
          <div className="w-5 h-2.5 sm:w-6 sm:h-3 bg-gray-900 rounded-sm ml-1 relative">
            <div className="absolute right-0.5 top-0.5 w-1 h-2 bg-gray-900 rounded-sm"></div>
          </div>
        </div>
      </div>
      {/* Preview Content */}
      <div className="p-4 h-full overflow-y-auto scrollbar-hide">
        {/* Property Image - Show uploaded images or placeholder */}
        {uploadedImages.length > 0 ? (
          <div className="w-full h-32 rounded-lg mb-4 overflow-hidden">
            <img
              src={uploadedImages[0].preview}
              alt="Property"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-400">
              <Home className="w-10 h-10 mx-auto mb-1" />
            </div>
          </div>
        )}

        {/* Price & Type */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-bold text-gray-900">
              {formatPrice(formData.price)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Home className="w-3.5 h-3.5 text-gray-500" />
              <Building2 className="w-3.5 h-3.5 text-gray-500" />
              <Layers className="w-3.5 h-3.5 text-gray-500" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#E85A50] rounded-sm"></div>
            <span className="text-xs text-gray-600 capitalize">
              {selectedPropertyType.replace("-", " ")}
            </span>
          </div>
        </div>

        {/* Property Title */}
        <p className="text-sm font-medium text-gray-700 mb-3">
          {formData.propertyName || "Property title"}
        </p>

        <div className="border-t border-gray-200 pt-3 mb-3">
          <p className="text-sm font-bold text-gray-900 mb-1">Description</p>
          <p className="text-xs text-gray-500">
            {formData.description || "Description comes here"}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-3 mb-3">
          <p className="text-sm font-bold text-gray-900 mb-1">Size</p>
          <p className="text-xs text-gray-500">
            {formData.size
              ? `${formData.size} ${formData.sizeUnit}`
              : "Property size"}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-3 mb-3">
          <p className="text-sm font-bold text-gray-900 mb-1">Condition</p>
          <p className="text-xs text-gray-500">
            {formData.condition
              ? formData.condition.replace("-", " ")
              : "Your property's condition"}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <p className="text-sm font-bold text-gray-900 mb-3">Features</p>
          <div className="grid grid-cols-3 gap-2">
            {features && features.length > 0 ? (
              features.slice(0, 5).map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg mx-auto mb-1 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-[10px] text-gray-500 truncate px-1">
                    {feature}
                  </p>
                </div>
              ))
            ) : (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg mx-auto mb-1"></div>
                    <p className="text-[10px] text-gray-500">Feature {i}</p>
                  </div>
                ))}
              </>
            )}
            {features && features.length > 5 && (
              <div className="text-center">
                <p className="text-[10px] text-[#E85A50] font-medium mt-3">
                  More
                </p>
                <p className="text-[10px] text-[#E85A50]">Features</p>
              </div>
            )}
            {(!features || features.length === 0) && (
              <div className="text-center">
                <p className="text-[10px] text-[#E85A50] font-medium mt-3">
                  More
                </p>
                <p className="text-[10px] text-[#E85A50]">Features</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellProperty;
