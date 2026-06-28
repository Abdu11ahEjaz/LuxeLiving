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
            <button className="px-4 py-1.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-1 text-sm">
              <Phone size={16} />
              CALL
            </button>
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-1 text-sm">
              <Mail size={16} />
              INQUIRE
            </button>
            <button className="px-4 py-1.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 text-sm">
              WhatsApp
            </button>
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
    </div>
  );
};

export default PropertyDetail;
