import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CityDropdown = ({ onCityChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Fetch cities from Area database on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/areas/cities`);
        const citiesList = res.data || [];
        setCities(citiesList);
        
        // Set first city as default if available
        if (citiesList.length > 0) {
          setSelectedCity(citiesList[0]);
          onCityChange(citiesList[0]);
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [onCityChange]);

  // Filter cities based on search term
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative ml-3" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-gray-700 font-medium"
        disabled={loading}
      >
        {loading ? "Loading..." : (selectedCity || "Select City")}
        <span className="text-red-500">▾</span>
      </button>

      {/* Dropdown menu */}
      {open && !loading && (
        <div className="absolute mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-red-500"
              autoFocus
            />
          </div>
          
          {/* Cities list */}
          <ul className="overflow-y-auto max-h-60">
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedCity(city);
                    setOpen(false);
                    setSearchTerm("");
                    onCityChange(city);
                  }}
                  className={`px-4 py-2 hover:bg-red-50 cursor-pointer ${
                    selectedCity === city ? "bg-red-50 text-red-500 font-medium" : "text-gray-700"
                  }`}
                >
                  {city}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-gray-500 text-sm">
                No cities found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CityDropdown;

