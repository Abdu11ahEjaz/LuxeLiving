import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight, MapPin, Home, TrendingUp, DollarSign, FileText } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AreaGuide = () => {
  const { city, area } = useParams();
  const navigate = useNavigate();
  const [areaData, setAreaData] = useState(null);
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filterType, setFilterType] = useState("ALL"); // ALL, Schools, Hospitals, Restaurants

  useEffect(() => {
    const fetchAreaData = async () => {
      try {
        setLoading(true);
        
        const url = `${API_BASE_URL}/areas/${encodeURIComponent(city)}/${encodeURIComponent(area)}`;
        
        const res = await axios.get(url);
        
        setAreaData(res.data.area);
        setStats(res.data.stats);
        setProperties(res.data.properties || []);
      } catch (error) {
        console.error("Error fetching area data:", error.message);
        alert("Error loading area. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    if (city && area) {
      fetchAreaData();
    }
  }, [city, area]);

  const handlePrevImage = () => {
    if (areaData?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev > 0 ? prev - 1 : areaData.images.length - 1
      );
    }
  };

  const handleNextImage = () => {
    if (areaData?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev < areaData.images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + " Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + " L";
    }
    return price.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading area information...</p>
      </div>
    );
  }

  if (!areaData) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4">
        <p className="text-red-600 text-lg">Area not found</p>
        <p className="text-gray-600">City: {city}, Area: {area}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const displayImage = areaData.images?.[currentImageIndex]?.url || "/images/ground.jpg";

  return (
    <div className="min-h-screen bg-white mt-16">
      {/* Header with Search Bar */}
      <div className="bg-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Explore Societies in Pakistan
            </h1>
            
            {/* Search Bar */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm text-gray-600 mb-2 block">City</label>
                <input
                  type="text"
                  value={city}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600 mb-2 block">Area</label>
                <input
                  type="text"
                  value={area}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              {/* <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-semibold">
                SEARCH
              </button> */}
            </div>

            {/* House Icon */}
            <div className="absolute -top-10 right-6 text-red-500 text-6xl">
              <Home className="w-20 h-20" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Title and See All Photos Link */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">{areaData.name}</h2>
              {areaData.images?.length > 1 && (
                <a href="#" className="text-red-500 font-semibold text-sm hover:underline">
                  SEE ALL PHOTOS →
                </a>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-6">
              {areaData.description}
            </p>

            {/* Image Carousel */}
            <div className="relative mb-8 rounded-lg overflow-hidden bg-gray-200 h-80">
              <img
                src={displayImage}
                alt={areaData.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {areaData.images?.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-200 text-gray-800 p-3 rounded-full shadow-lg transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-200 text-gray-800 p-3 rounded-full shadow-lg transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Highlights Section */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Properties for Sale */}
                <div className="flex items-start gap-4 pb-6 border-b">
                  <div className="text-3xl"><Home className="w-8 h-8" /></div>
                  <div>
                    <p className="text-gray-700 font-semibold">Properties for sale</p>
                    <p className="text-red-500 font-bold text-lg mt-1">
                      {stats?.saleProperties || 0} Properties →
                    </p>
                  </div>
                </div>

                {/* Properties for Rent */}
                <div className="flex items-start gap-4 pb-6 border-b">
                  <div className="text-3xl">🔑</div>
                  <div>
                    <p className="text-gray-700 font-semibold">Properties for rent</p>
                    <p className="text-red-500 font-bold text-lg mt-1">
                      {stats?.rentProperties || 0} Properties →
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Area Overview Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Area Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Rent Increase */}
                <div className="pb-8">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {areaData.rentIncreasePercentage || 0}% Increase in Rent
                      </p>
                      <p className="text-gray-600 text-sm">
                        Price increase on listings for rent in last 3 months
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="pb-8">
                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {formatPrice(stats?.salePriceRange?.min || 0)} -{" "}
                        {formatPrice(stats?.salePriceRange?.max || 0)}
                      </p>
                      <p className="text-gray-600 text-sm">Price range of Listings</p>
                    </div>
                  </div>
                </div>

                {/* Avg Rent per Sq ft */}
                <div className="pb-8">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        PKR {areaData.averageRentPerSqft || 0}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Average Rent per Sq ft in last month
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sale Increase & Total Properties */}
                <div className="pb-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-2xl font-bold text-gray-800">
                          {areaData.saleIncreasePercentage || 0}%
                        </p>
                        <p className="text-gray-600 text-sm">Increase in Sale Price</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-2xl font-bold text-gray-800">
                          {stats?.totalProperties || 0}
                        </p>
                        <p className="text-gray-600 text-sm">Total Properties</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location and Nearby Facilities */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Location and nearby facilities
              </h3>

              {/* Filter Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setFilterType("ALL")}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    filterType === "ALL"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setFilterType("Schools")}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    filterType === "Schools"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  🎓 Schools
                </button>
                <button
                  onClick={() => setFilterType("Hospitals")}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    filterType === "Hospitals"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  🏥 Hospitals
                </button>
                <button
                  onClick={() => setFilterType("Restaurants")}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    filterType === "Restaurants"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  🍽️ Restaurants
                </button>
              </div>

              {/* Google Map - Placeholder */}
              <div className="rounded-lg overflow-hidden h-96 bg-gray-300 mb-8">
                {areaData.mapEmbedUrl ? (
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={areaData.mapEmbedUrl}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-600">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p className="font-semibold">{areaData.name}, {city}</p>
                      <p className="text-sm text-gray-500">Location Map</p>
                      {areaData.latitude && areaData.longitude && (
                        <p className="text-xs text-gray-500 mt-2">
                          Coordinates: {areaData.latitude.toFixed(4)}, {areaData.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Available Properties
              </h3>

              {properties.length > 0 ? (
                <div className="space-y-4">
                  {properties.slice(0, 4).map((property) => (
                    <div
                      key={property._id}
                      className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      {property.images && property.images.length > 0 && (
                        <div className="mb-3 h-24 bg-gray-200 rounded overflow-hidden">
                          <img
                            src={property.images[0].url}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <p className="font-bold text-gray-800 text-sm mb-1">
                        PKR {formatPrice(property.price)}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {property.purpose === "rent" ? "For Rent" : "For Sale"} •{" "}
                        {property.mainCategory}
                      </p>
                      <p className="text-xs text-gray-700">{property.title}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No properties available</p>
              )}

              {properties.length > 4 && (
                <a
                  href={`/buy?area=${area}&city=${city}`}
                  className="mt-4 inline-block text-red-500 font-semibold text-sm hover:underline"
                >
                  View All Properties →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaGuide;
