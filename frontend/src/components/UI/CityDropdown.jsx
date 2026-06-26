import { useState, useRef, useEffect } from "react";

const CityDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Islamabad");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

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
    "Wazirabad",
    "Ferozewala",
    "Murree",
    "Kahuta",
    "Kallar Syedan",
    "Taxila",
    "Wah Cantt",
    "Haripur",
    "Gujar Khan",
    "Mandi Faizabad",
    "Jalalpur Jattan",
    "Sarai Alamgir",
    "Pind Dadan Khan",
    "Chunian",
    "Khanqah Dogran",
    "Raiwind",
    "Shahpur",
    "Kot Radha Kishan",
    "Nankana Sahib",
    "Chichawatni",
    "Melsi",
    "Kot Chutta",
    "Darya Khan",
    "Kalat",
    "Khuzdar",
    "Lasbela",
    "Kohlu",
    "Dera Bugti",
    "Nasirabad",
    "Jhal Magsi",
    "Kacchi",
    "Sherani",
    "Zhob",
    "Musakhel",
    "Loralai",
    "Duki",
    "Dera Allah Yar",
    "Kashmore",
    "Shikarpur",
    "Gandhara",
    "Pabbi",
    "Tajaz",
    "Shahmansoor",
    "Pir Sabaq",
    "Kakki",
    "Tangi",
    "Balu",
    "Akora Khattak",
    "Jalalpur",
    "Paharpur",
    "Balkasar",
    "Sakhakot",
    "Malgri",
    "Shahpur",
    "Khatak",
    "Bannu",
    "Kakki",
    "Sadda",
    "Miramshah",
    "Razmak",
    "Spin Wam",
    "Yakmach",
    "Khuzdar",
    "Hub",
    "Gadani",
    "Kotri",
    "Buland Khan",
    "Daro",
    "Hala",
    "Khipro",
    "Samaro",
    "Sui",
    "Zahir Pir",
  ];

  // Filter cities based on search term
  const filteredCities = pakistaniCities.filter((city) =>
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
      >
        {selectedCity}
        <span className="text-red-500">▾</span>
      </button>

      {/* Dropdown menu */}
      {open && (
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

