import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  X,
  Bed,
  Bath,
  Maximize2,
  Phone,
  Mail,
} from "lucide-react";
import { usePageLoad } from "../hooks/usePageLoad.js";
import { getFacilityIconUrl } from "../utils/facilityIcons.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Show loading animation when fetching property data
  usePageLoad(loading);

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/properties/${id}`);

        console.log("Property data received:", res.data);
        console.log("Images:", res.data.images);

        setProperty(res.data);

        // Check if property is in favorites
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const favRes = await axios.get(`${API_BASE_URL}/favorites`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const isFav = favRes.data.some((fav) => fav.propertyId === id);
            setIsFavorite(isFav);
          } catch (favErr) {
            console.log("Could not fetch favorites:", favErr.message);
          }
        }

        // Fetch nearby properties in the same city and area
        if (res.data.city && res.data.area) {
          try {
            const nearbyRes = await axios.get(
              `${API_BASE_URL}/properties?city=${res.data.city}&area=${res.data.area}&limit=10&approvalStatus=approved`,
            );
            const nearby = Array.isArray(
              nearbyRes.data.properties || nearbyRes.data,
            )
              ? (nearbyRes.data.properties || nearbyRes.data)
                  .filter((p) => p._id !== id)
                  .slice(0, 4)
              : [];
            setNearbyProperties(nearby);
          } catch (nearbyErr) {
            console.log(
              "Could not fetch nearby properties:",
              nearbyErr.message,
            );
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // No need for sticky state with CSS sticky positioning
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [id]);

  // Gallery navigation
  const handlePrevImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev > 0 ? prev - 1 : property.images.length - 1,
      );
    }
  };

  const handleNextImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev < property.images.length - 1 ? prev + 1 : 0,
      );
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleFavoriteToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin", { state: { redirectAfterLogin: `/property/${id}` } });
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`${API_BASE_URL}/favorites/${property._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          `${API_BASE_URL}/favorites/${property._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert("Failed to update favorite status");
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Crore`;
    if (price >= 100000) return `${(price / 100000).toFixed(1)} Lac`;
    return `${price}`;
  };

  // Handle inquiry form submission
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.phone || !inquiryForm.message) {
      alert("Please fill in all fields");
      return;
    }

    setSubmittingInquiry(true);
    try {
      // Send inquiry to backend
      const inquiryData = {
        propertyId: property._id,
        propertyTitle: property.title,
        propertyPrice: property.price,
        propertyCity: property.city,
        propertyArea: property.area,
        ...inquiryForm,
      };

      const response = await axios.post(
        `${API_BASE_URL}/inquiries`,
        inquiryData
      );

      if (response.status === 201 || response.status === 200) {
        alert("Inquiry submitted successfully! Admin will contact you soon.");
        setShowInquiryModal(false);
        setInquiryForm({ name: "", email: "", phone: "", message: "" });
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  // Map facility names to custom SVG icons
  const getFacilityIcon = (facility) => {
    const iconUrl = getFacilityIconUrl(facility);
    
    if (!iconUrl) {
      return (
        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
          <span className="text-red-500 text-xs font-bold">?</span>
        </div>
      );
    }
    
    return (
      <img
        src={iconUrl}
        alt={facility}
        className="w-8 h-8 object-contain"
        style={{ imageRendering: 'crisp-edges' }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = '<div class="w-8 h-8 bg-red-100 rounded flex items-center justify-center"><span class="text-red-500 text-xs font-bold">!</span></div>';
        }}
      />
    );
  };

  if (loading) return null;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!property)
    return <div className="text-center py-10">Property not found</div>;

  // Handle images - could be array of strings or array of objects
  const images = property.images
    ? property.images
        .map((img) => {
          if (typeof img === "string") {
            return img;
          } else if (img.url) {
            return img.url;
          }
          return null;
        })
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-white mt-18">
      {/* Breadcrumb Navigation */}
      <div className="max-w-6xl mx-auto md:px-8 px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
        <span className="text-red-500 cursor-pointer hover:underline">
          {property.city}
        </span>
        <span className="mx-2">›</span>
        <span className="cursor-pointer hover:underline">
          {property.purpose}
        </span>
        <span className="mx-2">›</span>
        <span className="cursor-pointer hover:underline">
          {property.mainCategory}
        </span>
        <span className="mx-2">›</span>
        <span className="cursor-pointer hover:underline">{property.area}</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-semibold">{property.title}</span>
      </div>

      {/* Main Image Gallery with Centered Wrapper */}
      <div className="max-w-6xl mx-auto md:px-8 px-4">
        <div className="relative w-full h-[500px] bg-gray-900 rounded-lg overflow-hidden mt-4">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={`Property ${currentImageIndex + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsGalleryOpen(true)}
                onError={(e) => {
                  console.error(
                    "Image failed to load:",
                    images[currentImageIndex],
                  );
                  e.target.src =
                    "https://via.placeholder.com/800x500?text=Image+Not+Available";
                }}
              />

              {/* Image Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>

              {/* Favorite Button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={handleFavoriteToggle}
                  className="p-2 bg-white rounded-full hover:bg-gray-200 transition"
                >
                  <Heart
                    size={24}
                    className={
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                    }
                  />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <p className="text-white">No images available</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="max-w-6xl mx-auto md:px-8 px-4 py-4 bg-gray-100 rounded-lg mt-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                  idx === currentImageIndex
                    ? "border-red-500"
                    : "border-gray-300 hover:border-red-300"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/80x80?text=No+Image";
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Property Title and Main Info - Sticky using CSS */}
      <div 
        className="sticky top-16 z-40 bg-white shadow-md border-b border-gray-200"
        id="property-title-section"
      >
        <div className="max-w-6xl mx-auto md:px-8 px-4 py-3">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {property.title}
              </h1>
              <div className="flex gap-4 text-xs text-gray-600">
                {property.bedrooms && (
                  <div className="flex items-center gap-1">
                    <Bed size={14} />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1">
                    <Bath size={14} />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-1">
                    <Maximize2 size={14} />
                    <span>{property.area} Sqft</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-bold text-gray-900">
                PKR {formatPrice(property.price)}
              </p>
              <p className="text-xs text-gray-500">
                Added {new Date(property.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <a 
              href={`tel:${property.phone}`}
              className="px-4 py-1.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-1 text-sm transition-colors"
            >
              <Phone size={16} />
              CALL
            </a>
            <button 
              onClick={() => setShowInquiryModal(true)}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-1 text-sm transition-colors"
            >
              <Mail size={16} />
              INQUIRE
            </button>
            <a 
              href="https://wa.me/923005115153?text=Hello%20I%20am%20interested%20in%20your%20property%20listing"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 text-sm transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.782 1.14l-.046.027-4.783-.966.985 3.6-.047.06a9.861 9.861 0 00-1.516 5.231c0 5.487 4.144 9.92 9.263 9.92 2.498 0 4.845-.722 6.81-2.088l.046-.027 4.782.965-.983-3.598.047-.06a9.844 9.844 0 001.505-5.203c0-5.487-4.144-9.92-9.262-9.92" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="max-w-6xl mx-auto md:px-8 px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-700 leading-relaxed line-clamp-4">
          {property.description}
        </p>
        <button className="text-red-500 font-semibold mt-2 hover:underline">
          Read more
        </button>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto md:px-8 px-4 py-6 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {property.features && property.features.length > 0 ? (
            property.features.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="mb-2 flex justify-center">
                  {getFacilityIcon(feature)}
                </div>
                <p className="text-sm font-semibold text-gray-900">{feature}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No features listed</p>
          )}
        </div>
      </div>

      {/* Similar Properties Nearby */}
      {nearbyProperties.length > 0 && (
        <div className="max-w-6xl mx-auto md:px-8 px-4 py-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Similar properties nearby
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {nearbyProperties.map((prop) => {
              // Handle images - could be array of strings or objects
              const propImages = prop.images
                ? prop.images
                    .map((img) => {
                      if (typeof img === "string") return img;
                      if (img.url) return img.url;
                      return null;
                    })
                    .filter(Boolean)
                : [];

              const displayImage = propImages.length > 0 ? propImages[0] : null;

              return (
                <div
                  key={prop._id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/property/${prop._id}`)}
                >
                  {displayImage ? (
                    <div className="relative h-40 bg-gray-200">
                      <img
                        src={displayImage}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Image failed to load:", displayImage);
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML =
                            '<div class="w-full h-full bg-gray-300 flex items-center justify-center"><span class="text-gray-500">No image</span></div>';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                  <div className="p-3">
                    <p className="font-semibold text-gray-900 truncate">
                      {prop.title}
                    </p>
                    <p className="text-red-500 font-bold">
                      PKR {formatPrice(prop.price)}
                    </p>
                    <p className="text-xs text-gray-500">{prop.area}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Location and Map Section */}
      <div className="max-w-6xl mx-auto md:px-8 px-4 py-6 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Location and nearby facilities
        </h2>

        {/* Facilities Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button className="px-4 py-2 bg-red-50 border-2 border-red-400 text-red-600 rounded-lg font-semibold">
            ALL
          </button>
          <button className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-600 rounded-lg hover:border-gray-400">
            Schools
          </button>
          <button className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-600 rounded-lg hover:border-gray-400">
            Hospitals
          </button>
          <button className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-600 rounded-lg hover:border-gray-400">
            Restaurants
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="max-w-6xl mx-auto md:px-8 px-4 pb-6">
        <div className="w-full h-96 bg-gray-300 rounded-lg overflow-hidden border border-gray-300">
          {property.mapEmbedUrl ? (
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={property.mapEmbedUrl}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            // Fallback to OpenStreetMap if no embed URL available
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src="https://www.openstreetmap.org/export/embed.html?bbox=70.5,33.5,75,35&layer=mapnik"
              allowFullScreen=""
              loading="lazy"
            />
          )}
        </div>
      </div>

      {/* Image Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Close Button - Top Right */}
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-200 z-60"
          >
            <X size={24} className="text-gray-900" />
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={images[currentImageIndex]}
              alt={`Gallery ${currentImageIndex + 1}`}
              className="max-w-5xl max-h-[80vh] object-contain"
            />

            {/* Image Counter */}
            <div className="absolute bottom-8 right-8 bg-gray-800 text-white px-4 py-2 rounded-lg">
              {currentImageIndex + 1} of {images.length}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 p-3 bg-white rounded-full hover:bg-gray-200 transition"
            >
              <ChevronLeft size={28} className="text-gray-900" />
            </button>

            <button
              onClick={handleNextImage}
              className="absolute right-4 p-3 bg-white rounded-full hover:bg-gray-200 transition"
            >
              <ChevronRight size={28} className="text-gray-900" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 px-4 py-4 overflow-x-auto">
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumb ${idx + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer transition ${
                    idx === currentImageIndex
                      ? "border-2 border-white"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  onClick={() => handleThumbnailClick(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Get in touch</h2>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-6">
                For more information, please fill out the form and our team will get back to you
              </p>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <input
                    type="text"
                    placeholder="Name*"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <input
                    type="email"
                    placeholder="Email*"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <div className="flex">
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                      <span className="text-2xl">🇵🇰</span>
                      <span className="text-gray-600">+92</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number*"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <textarea
                    placeholder={`I am interested in ${property.title} in ${property.area}, ${property.city}. Please contact me at your earliest convenience.`}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingInquiry ? "SENDING..." : "REQUEST INFO"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
