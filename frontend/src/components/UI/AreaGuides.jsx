import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/images/ground.jpg";
import mapImage from "../../assets/images/map.jpg";
import { IoSearchSharp } from "react-icons/io5";
import CityDropdown from "./CityDropdown.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AreaGuides = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allAreas, setAllAreas] = useState([]);

  // Fetch areas when city changes
  useEffect(() => {
    if (!selectedCity) return;

    const fetchAreas = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/areas/city/${encodeURIComponent(selectedCity)}`);
        const areas = res.data || [];
        setAllAreas(areas);
        setSearchResults([]);
        setSearchQuery("");
      } catch (error) {
        console.error("Failed to fetch areas:", error);
        setAllAreas([]);
      }
    };

    fetchAreas();
  }, [selectedCity]);

  // Filter areas based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allAreas.filter((area) =>
      area.name.toLowerCase().includes(query)
    );

    setSearchResults(filtered);
    setShowResults(filtered.length > 0);
  }, [searchQuery, allAreas]);

  // Handle area selection
  const handleAreaSelect = (area) => {
    navigate(`/area-guide/${selectedCity}/${area.name}`);
    setSearchQuery("");
    setShowResults(false);
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchResults.length > 0) {
      handleAreaSelect(searchResults[0]);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle blur - close dropdown after delay
  const handleInputBlur = () => {
    setTimeout(() => setShowResults(false), 300);
  };
  return (
        <section
            className="w-full bg-cover bg-center"
            style={{
                backgroundImage: `url(${bgImage})`,
            }}
        >
            <div className="max-w-7xl mx-auto my-1.5 px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-7">

                    {/* LEFT COLUMN */}
                    <div className="mb-13 mx-4 sm:mx-8 md:mx-20" >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
                            Area Guides
                        </h2>

                        <p className="text-sm sm:text-base text-gray-600 max-w-md mb-4">
                            View schools, health services, parks, security index and other
                            details of any area
                        </p>

                        {/* Search Bar with City Dropdown */}
                        <div className="relative">
                          <div className="flex items-center bg-white border rounded-lg px-2 py-2 w-full sm:max-w-sm md:max-w-md shadow-sm">

                              <button className="py-2 px-2 flex-shrink-0 h-[100%] place-items-center border-none">
                                  <IoSearchSharp className="text-xl sm:text-2xl md:text-3xl text-black" />
                              </button>

                              <input
                                  type="text"
                                  placeholder="Search area"
                                  className="flex-1 outline-none text-sm sm:text-base text-gray-700 min-w-0"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  onKeyPress={handleKeyPress}
                                  onFocus={() => searchQuery && setShowResults(true)}
                                  onBlur={handleInputBlur}
                              />
                              <CityDropdown onCityChange={setSelectedCity} />
                          </div>

                          {/* Search Results Dropdown */}
                          {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-40">
                              {searchResults.map((area, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleAreaSelect(area)}
                                  className="px-4 py-3 text-left hover:bg-red-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer text-sm"
                                >
                                  <span className="font-semibold text-gray-800">{area.name}</span>
                                  <span className="text-xs text-gray-500 block mt-0.5">{selectedCity}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* No Results Message */}
                          {showResults && searchResults.length === 0 && searchQuery.trim() && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center text-gray-500 text-sm z-40">
                              No areas found
                            </div>
                          )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN (MAP IMAGE) */}
                    <div className="hidden lg:flex justify-center mb-10">
                        <img
                            src= {mapImage}
                            alt="Map"
                            className="max-w-md w-full"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AreaGuides;
