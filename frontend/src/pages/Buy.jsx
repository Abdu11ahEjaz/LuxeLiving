import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

// Property category configuration
const CATEGORIES = [
  { id: "residential", label: "Residential Properties" },
  { id: "commercial", label: "Commercial Properties" },
  { id: "plot", label: "Plots" },
];

export const Buy = () => {
  // Data and UI state
  const [cities, setCities] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [carousels, setCarousels] = useState({});
  const [imageIndices, setImageIndices] = useState({});
  const [cardsPerView, setCardsPerView] = useState(4);

  // Fetch approved sale properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/properties?purpose=sale&limit=1000`
        );
        const propertiesData = res.data.properties || res.data;

        // Filter to only approved sale properties
        const saleProperties = Array.isArray(propertiesData)
          ? propertiesData.filter(
              (p) => p.purpose === "sale" && p.approvalStatus === "approved"
            )
          : [];

        setProperties(saleProperties);

        // Extract and sort unique cities
        const uniqueCities = [
          ...new Set(saleProperties.map((p) => p.city)),
        ].sort();
        setCities(uniqueCities);

        // Initialize all categories as selected by default
        const categoriesObj = {};
        uniqueCities.forEach((city) => {
          categoriesObj[city] = ["residential", "commercial", "plot"];
        });
        setSelectedCategories(categoriesObj);

        // Initialize carousel indices and image indices
        const carouselIndices = {};
        const imgIndices = {};
        saleProperties.forEach((prop) => {
          carouselIndices[prop._id] = 0;
          imgIndices[prop._id] = 0;
        });
        setCarousels(carouselIndices);
        setImageIndices(imgIndices);

        setError(null);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Handle responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 640) setCardsPerView(1);
        else if (window.innerWidth < 1024) setCardsPerView(2);
        else setCardsPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle category filter toggle
  const handleCategoryToggle = (city, category) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [city]: prev[city].includes(category)
        ? prev[city].filter((c) => c !== category)
        : [...prev[city], category],
    }));
  };

  // Handle image carousel navigation
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

  // Handle carousel navigation
  const handleCarouselPrev = (city, filteredProps) => {
    setCarousels((prev) => ({
      ...prev,
      [city]:
        prev[city] > 0
          ? prev[city] - 1
          : Math.max(0, filteredProps.length - cardsPerView),
    }));
  };

  const handleCarouselNext = (city, filteredProps) => {
    setCarousels((prev) => ({
      ...prev,
      [city]:
        prev[city] + cardsPerView < filteredProps.length ? prev[city] + 1 : 0,
    }));
  };

  // Format price
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(1) + " Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(1) + " L";
    }
    return price.toLocaleString();
  };

  if (loading) {
    return (
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-50 pt-14">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* City Sections */}
        {cities.map((city) => {
          const cityProperties = properties.filter((p) => p.city === city);
          const filteredProperties = cityProperties.filter((p) =>
            selectedCategories[city]?.includes(p.mainCategory)
          );
          const visibleProperties = filteredProperties.slice(
            carousels[city] || 0,
            (carousels[city] || 0) + cardsPerView
          );

          return (
            <div key={city} className="mb-16">
              {/* City Title */}
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                Properties for Sale in {city}
              </h2>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-3 mb-8">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(city, category.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 border-2 text-xs sm:text-sm ${
                      selectedCategories[city]?.includes(category.id)
                        ? "bg-white border-red-400 text-red-600"
                        : "bg-white border-gray-300 text-gray-700 hover:border-red-400"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Carousel */}
              {filteredProperties.length > 0 ? (
                <div className="relative">
                  {/* Properties Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    {visibleProperties.map((property, index) => {
                      const currentImageIndex =
                        imageIndices[property._id] || 0;
                      const hasImages =
                        property.images && property.images.length > 0;
                      const displayImage = hasImages
                        ? property.images[currentImageIndex].url
                        : "/images/ground.jpg";

                      return (
                        <div
                          key={property._id || index}
                          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                        >
                          {/* Image with Carousel */}
                          <div className="relative overflow-hidden bg-gray-200 h-40 sm:h-44 lg:h-40 group">
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
                          <div className="p-3 sm:p-4 flex-1 flex flex-col">
                            {/* Price */}
                            <p className="text-xs sm:text-sm font-bold text-red-500 mb-1">
                              PKR {formatPrice(property.price)}
                            </p>

                            {/* Category Badge */}
                            <div className="inline-block text-red-500 text-xs mb-2 w-fit font-semibold">
                              {property.subCategory}
                            </div>

                            {/* Area Name */}
                            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                              {property.area}
                            </h3>

                            {/* Details */}
                            <div className="flex gap-2 text-xs text-gray-600 mb-2">
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

                            {/* Address */}
                            {property.address && (
                              <p className="text-xs text-gray-500 mb-2">
                                {property.address}
                              </p>
                            )}

                            {/* Time Added */}
                            <p className="text-xs text-gray-400">
                              Added recently
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Arrows */}
                  {filteredProperties.length > cardsPerView && (
                    <>
                      <button
                        className="absolute left-0 top-1/3 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-red-400 text-white flex items-center justify-center hover:bg-red-500 transition-colors z-20 -ml-3 sm:-ml-5"
                        onClick={() =>
                          handleCarouselPrev(city, filteredProperties)
                        }
                        disabled={(carousels[city] || 0) === 0}
                      >
                        <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
                      </button>
                      <button
                        className="absolute right-0 top-1/3 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-red-400 text-white flex items-center justify-center hover:bg-red-500 transition-colors z-20 -mr-3 sm:-mr-5"
                        onClick={() =>
                          handleCarouselNext(city, filteredProperties)
                        }
                        disabled={
                          (carousels[city] || 0) + cardsPerView >=
                          filteredProperties.length
                        }
                      >
                        <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
                      </button>
                    </>
                  )}

                  {/* Indicators */}
                  {filteredProperties.length > cardsPerView && (
                    <div className="flex justify-center gap-2 mt-4 sm:mt-6">
                      {Array.from({
                        length: Math.ceil(
                          filteredProperties.length / cardsPerView
                        ),
                      }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setCarousels((prev) => ({
                              ...prev,
                              [city]: index * cardsPerView,
                            }))
                          }
                          className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-colors ${
                            (carousels[city] || 0) === index * cardsPerView
                              ? "bg-red-400"
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-600">
                    No properties found for the selected filters in {city}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* No Cities */}
        {cities.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-gray-600">
              No properties for sale available yet
            </p>
          </div>
        )}
      </div>
    </section>
  );
};