import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TopAreas = () => {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [areasWithStats, setAreasWithStats] = useState([]);

  // Fetch available cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/areas/cities`);
        setCities(res.data);
        if (res.data.length > 0) {
          setSelectedCity(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };

    fetchCities();
  }, []);

  // Fetch areas for selected city with property counts
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        if (selectedCity) {
          const res = await axios.get(
            `${API_BASE_URL}/areas/city/${encodeURIComponent(selectedCity)}`
          );

          console.log("Areas fetched:", res.data);

          // Fetch property statistics for each area
          const areasWithCounts = await Promise.all(
            res.data.map(async (area) => {
              try {
                const statsRes = await axios.get(
                  `${API_BASE_URL}/areas/${encodeURIComponent(selectedCity)}/${encodeURIComponent(area.name)}`
                );
                return {
                  ...area,
                  rentCount: statsRes.data.stats?.rentProperties || 0,
                  saleCount: statsRes.data.stats?.saleProperties || 0,
                };
              } catch (err) {
                console.error(`Failed to fetch stats for ${area.name}:`, err);
                return {
                  ...area,
                  rentCount: 0,
                  saleCount: 0,
                };
              }
            })
          );

          setAreas(res.data);
          setAreasWithStats(areasWithCounts);
          setCurrentIndex(0);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch areas:", err);
        setError("Failed to load areas");
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [selectedCity]);

  // Calculate responsive card count based on screen width
  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
    }
    return 4;
  };

  const [cardsPerView, setCardsPerView] = useState(4);

  // Setup responsive carousel on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };

    setCardsPerView(getCardsPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigate carousel backward
  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : Math.max(0, areasWithStats.length - cardsPerView)
    );
  };

  // Navigate carousel forward
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + cardsPerView < areasWithStats.length ? prev + 1 : 0));
  };

  // Get visible areas for current carousel view
  const visibleAreas = areasWithStats.slice(currentIndex, currentIndex + cardsPerView);

  // Navigate to detailed area guide
  const handleViewAreaGuide = (areaName) => {
    navigate(`/area-guide/${selectedCity}/${areaName}`);
  };

  return (
    <section className="w-full bg-gray-50 py-5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Top areas by city
          </h2>

          {/* City Filter Buttons */}
          {cities.length > 0 && (
            <div className="flex flex-wrap gap-3 items-center">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 border-2 ${
                    selectedCity === city
                      ? "bg-white border-red-400 text-red-600"
                      : "bg-white border-gray-300 text-gray-700 hover:border-red-400"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading areas...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* No Areas State */}
        {!loading && !error && areasWithStats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No areas available yet in {selectedCity}</p>
          </div>
        )}

        {/* Carousel */}
        {!loading && areasWithStats.length > 0 && (
          <div className="relative">
            {/* Areas Grid - Responsive: 1 mobile, 2 tablet, 4 desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {visibleAreas.map((area, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-200 h-40 sm:h-44 lg:h-40">
                    {area.images && area.images.length > 0 ? (
                      <img
                        src={area.images[0].url}
                        alt={area.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col">
                    {/* Area Name */}
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
                      {area.name}
                    </h3>

                    {/* Stats */}
                    <div className="flex gap-3 sm:gap-4 mb-2 sm:mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">on rent</p>
                        <p className="text-sm sm:text-base font-bold text-red-500">
                          {area.rentCount || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">on sale</p>
                        <p className="text-sm sm:text-base font-bold text-red-500">
                          {area.saleCount || 0}
                        </p>
                      </div>
                    </div>

                    {/* View Guide Link */}
                    <button
                      onClick={() => handleViewAreaGuide(area.name)}
                      className="text-red-500 font-semibold text-xs sm:text-xs hover:underline inline-block mt-auto"
                    >
                      VIEW AREA GUIDE →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows - Responsive positioning */}
            {areasWithStats.length > cardsPerView && (
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
                  disabled={currentIndex + cardsPerView >= areasWithStats.length}
                >
                  <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
                </button>
              </>
            )}

            {/* Indicators */}
            {areasWithStats.length > cardsPerView && (
              <div className="flex justify-center gap-2 mt-4 sm:mt-6">
                {Array.from({
                  length: Math.ceil(areasWithStats.length / cardsPerView),
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
        )}
      </div>
    </section>
  );
};

export default TopAreas;
