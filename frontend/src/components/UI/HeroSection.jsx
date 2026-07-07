import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/images/Faisal-Mosque.jpg";
import { IoSearchSharp } from "react-icons/io5";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allCitiesAreas, setAllCitiesAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all cities and areas on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Fetch all cities from Area database
        const citiesRes = await axios.get(`${API_BASE_URL}/areas/cities`);
        const cities = citiesRes.data || [];

        const locations = [];

        // Add cities as top-level options
        cities.forEach((city) => {
          locations.push({
            type: "city",
            name: city,
            displayName: city,
            city: city,
            area: null,
          });
        });

        // Fetch areas for each city
        for (const city of cities) {
          try {
            const areasRes = await axios.get(`${API_BASE_URL}/areas/city/${encodeURIComponent(city)}`);
            const areas = areasRes.data || [];

            // Add areas under each city
            areas.forEach((area) => {
              locations.push({
                type: "area",
                name: area.name,
                displayName: `${area.name}, ${city}`,
                city: city,
                area: area.name,
              });
            });
          } catch (error) {
            console.error(`Failed to fetch areas for ${city}:`, error);
          }
        }

        setAllCitiesAreas(locations);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, []);

  // Handle search input change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allCitiesAreas.filter(
      (location) =>
        location.name.toLowerCase().includes(query) ||
        location.city.toLowerCase().includes(query)
    );

    setSearchResults(filtered);
    setShowResults(filtered.length > 0);
  }, [searchQuery, allCitiesAreas]);

  // Handle location selection
  const handleLocationSelect = (location) => {
    if (location.type === "city") {
      // Navigate to area guide with city overview
      navigate(`/area-guide/${location.city}/overview`);
    } else {
      // Navigate to area guide with specific area
      navigate(`/area-guide/${location.city}/${location.area}`);
    }
    setSearchQuery("");
    setShowResults(false);
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchResults.length > 0) {
      handleLocationSelect(searchResults[0]);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle input blur - close dropdown with delay to allow click to register
  const handleInputBlur = () => {
    setTimeout(() => setShowResults(false), 300);
  };

  return (
    <main
      className="pt-16 pb-4 md:pb-0 h-[calc(100vh-70px)] md:h-[calc(100vh-20px)] min-h-fit md:min-h-[calc(100vh-20px)] bg-cover bg-center bg-no-repeat bg-opacity-85 box-border flex items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-0 flex flex-col items-center justify-center gap-4 md:gap-6">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)] [-webkit-text-stroke:0.3px_rgba(0,0,0,0.4)]">
          Buy or rent vetted properties at the most trusted online real estate portal
        </h1>

        {/* Buy and Rent Buttons */}
        <div className="flex gap-3 md:gap-4">
          <button
            onClick={() => navigate("/buy")}
            className="px-4 py-2 sm:px-6 sm:py-2.5 text-center border-none rounded-md bg-white hover:opacity-80 hover:cursor-pointer hover:text-red-900 hover:underline hover:underline-offset-2 opacity-90 font-semibold text-sm sm:text-base md:text-lg text-gray-600 transition-all duration-200"
          >
            Buy
          </button>
          <button
            onClick={() => navigate("/rent")}
            className="px-4 py-2 sm:px-6 sm:py-2.5 text-center border-none rounded-md bg-white hover:opacity-80 hover:cursor-pointer hover:text-red-900 hover:underline hover:underline-offset-2 opacity-90 font-semibold text-sm sm:text-base md:text-lg text-gray-600 transition-all duration-200"
          >
            Rent
          </button>
        </div>

        {/* Search Bar with Dropdown */}
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl relative z-40">
          <div className="h-11 sm:h-12 md:h-14 flex shadow-lg rounded-lg md:rounded-xl overflow-hidden">
            <input
              type="text"
              className="flex-1 p-2 sm:p-3 md:p-4 border-none bg-white text-sm sm:text-base outline-none rounded-l-lg md:rounded-l-xl"
              placeholder="Search by city or area"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => searchQuery && setShowResults(true)}
              onBlur={handleInputBlur}
            />
            <button
              onClick={handleSearch}
              className="bg-red-500 w-10 sm:w-12 md:w-16 h-full border-none flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer rounded-r-lg md:rounded-r-xl"
            >
              <IoSearchSharp className="text-xl sm:text-2xl md:text-3xl text-white" />
            </button>
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.type}-${result.city}-${result.area}-${index}`}
                  onClick={() => handleLocationSelect(result)}
                  className="w-full px-4 py-3 sm:py-4 text-left hover:bg-red-50 transition-colors border-b border-gray-100 last:border-b-0 flex flex-col text-xs sm:text-sm cursor-pointer"
                >
                  <span className="font-semibold text-gray-800">{result.displayName}</span>
                  <span className="text-xs text-gray-500 mt-0.5">
                    {result.type === "city" ? "City" : "Area"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {showResults && searchResults.length === 0 && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 text-center text-gray-500 text-sm">
              No cities or areas found
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
