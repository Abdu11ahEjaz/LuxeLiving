import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const PropertiesForRent = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndices, setImageIndices] = useState({});
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch properties for rent
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/properties?purpose=rent&limit=100`
        );
        const propertiesData = res.data.properties || res.data;

        // Filter only rent properties
        const rentProperties = Array.isArray(propertiesData)
          ? propertiesData.filter((p) => p.purpose === "rent")
          : [];

        setProperties(rentProperties);

        // Get unique cities and sort them
        const uniqueCities = [
          ...new Set(rentProperties.map((p) => p.city)),
        ].sort();
        setCities(uniqueCities);

        // Set first city as default
        if (uniqueCities.length > 0) {
          setSelectedCity(uniqueCities[0]);
        }

        // Initialize image indices
        const indices = {};
        rentProperties.forEach((prop) => {
          indices[prop._id] = 0;
        });
        setImageIndices(indices);

        setError(null);
      } catch (err) {
        console.error("Error fetching rent properties:", err);
        setError("Failed to load properties");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Handle image carousel
  const handlePrevImage = (e, propertyId, totalImages) => {
    e.stopPropagation();
    setImageIndices((prev) => ({
      ...prev,
      [propertyId]:
        prev[propertyId] > 0 ? prev[propertyId] - 1 : totalImages - 1,
    }));
  };

  const handleNextImage = (e, propertyId, totalImages) => {
    e.stopPropagation();
    setImageIndices((prev) => ({
      ...prev,
      [propertyId]:
        prev[propertyId] < totalImages - 1 ? prev[propertyId] + 1 : 0,
    }));
  };

  // Filter properties by selected city
  const filteredProperties = properties.filter((p) => p.city === selectedCity);

  // Responsive card count
  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // mobile
      if (window.innerWidth < 1024) return 2; // tablet
    }
    return 4; // desktop
  };

  const [cardsPerView, setCardsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };

    setCardsPerView(getCardsPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carousel handlers
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : Math.max(0, filteredProperties.length - cardsPerView)
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev + cardsPerView < filteredProperties.length ? prev + 1 : 0
    );
  };

  // Get properties to display based on screen size
  const visibleProperties = filteredProperties.slice(
    currentIndex,
    currentIndex + cardsPerView
  );

  // Format price
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(1) + " Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(1) + " L";
    }
    return price.toLocaleString();
  };

  // Reset carousel on city change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCity]);

  if (loading) {
    return (
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </section>
    );
  }

  if (error || properties.length === 0) {
    return null; // Don't show section if no data
  }

  return (
    <section className="w-full py-5 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          Recent Properties for Rent
        </h2>

        {/* City Filter Buttons */}
        {cities.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 border-2 ${
                  selectedCity === city
                    ? "bg-red-50 border-red-400 text-red-600"
                    : "bg-white border-gray-300 text-gray-700 hover:border-red-400"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}

        {/* Carousel */}
        {filteredProperties.length > 0 ? (
          <div className="relative">
            {/* Properties Grid - Responsive: 1 mobile, 2 tablet, 4 desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {visibleProperties.map((property, index) => {
                const currentImageIndex = imageIndices[property._id] || 0;
                const hasImages =
                  property.images && property.images.length > 0;
                const displayImage = hasImages
                  ? property.images[currentImageIndex].url
                  : "/images/ground.jpg";

                return (
                  <div
                    key={property._id || index}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image with Carousel */}
                    <div className="relative overflow-hidden bg-gray-200 h-40 sm:h-44 lg:h-48 group">
                      <img
                        src={displayImage}
                        alt={property.area}
                        className="w-full h-full object-cover"
                      />

                      {/* Favorite Button */}
                      <button className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-5">
                        <Heart className="w-5 h-5 text-red-500" />
                      </button>

                      {/* Image Navigation */}
                      {hasImages && property.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) =>
                              handlePrevImage(
                                e,
                                property._id,
                                property.images.length
                              )
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) =>
                              handleNextImage(
                                e,
                                property._id,
                                property.images.length
                              )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Image Indicators */}
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {property.images.map((_, imgIndex) => (
                              <button
                                key={imgIndex}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImageIndices((prev) => ({
                                    ...prev,
                                    [property._id]: imgIndex,
                                  }));
                                }}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  imgIndex === currentImageIndex
                                    ? "bg-white"
                                    : "bg-white/50"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4">
                      {/* Price */}
                      <p className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                        PKR {formatPrice(property.price)}
                      </p>

                      {/* Category Badge */}
                      <div className="inline-block bg-red-50 text-red-600 text-xs px-3 py-1 rounded mb-3">
                        {property.mainCategory}
                      </div>

                      {/* Details */}
                      <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                        {property.bedrooms && (
                          <span>🛏️ {property.bedrooms}</span>
                        )}
                        {property.bathrooms && (
                          <span>🚿 {property.bathrooms}</span>
                        )}
                        {property.areaSize && (
                          <span>
                            📐 {property.areaSize} {property.areaUnit}
                          </span>
                        )}
                      </div>

                      {/* Location */}
                      <p className="text-sm text-gray-700 font-semibold mb-2">
                        {property.area}
                      </p>

                      {/* Address */}
                      {property.address && (
                        <p className="text-xs text-gray-500 mb-2">
                          {property.address}
                        </p>
                      )}

                      {/* Time Added */}
                      <p className="text-xs text-gray-400">
                        Added 2 hours ago
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows - Responsive positioning */}
            {filteredProperties.length > cardsPerView && (
              <>
                <button
                  className="absolute left-0 top-1/3 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-red-400 text-white flex items-center justify-center hover:bg-red-500 transition-colors z-20 -ml-3 sm:-ml-5"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
                </button>
                <button
                  className="absolute right-0 top-1/3 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-red-400 text-white flex items-center justify-center hover:bg-red-500 transition-colors z-20 -mr-3 sm:-mr-5"
                  onClick={handleNext}
                  disabled={currentIndex + cardsPerView >= filteredProperties.length}
                >
                  <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
                </button>
              </>
            )}

            {/* Indicators */}
            {filteredProperties.length > cardsPerView && (
              <div className="flex justify-center gap-2 mt-4 sm:mt-6">
                {Array.from({
                  length: Math.ceil(filteredProperties.length / cardsPerView),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * cardsPerView)}
                    className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-colors ${
                      currentIndex === index * cardsPerView
                        ? "bg-red-400"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No rental properties in {selectedCity} yet
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertiesForRent;
