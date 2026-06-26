import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import Nav_Logo from "../../assets/images/Nav_Logo.png";
import AuthModal from "./AuthModal.jsx";
import { useAuth } from "../../context/AuthContext";

export const Headers = () => {
  const [show, setShow] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleButtonToggle = () => setShow(!show);
  const handleLinkClick = () => setShow(false);

  const openSignIn = () => {
    setAuthMode("signin");
    setShowAuthModal(true);
    setShow(false);
  };

  const closeAuthModal = () => setShowAuthModal(false);

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setShow(false);
    setShowProfileDropdown(false);
  };

  const dropdownOptions = {
    buy: [
      { label: "Buy a Residential Property", path: "/buy?type=residential" },
      { label: "Buy a Commercial Property", path: "/buy?type=commercial" },
      { label: "Buy a Plot", path: "/buy?type=plot" },
    ],
    sell: [
      { label: "Sell a Property", path: "/sell?purpose=sell" },
      { label: "Rent out a Property", path: "/sell?purpose=rent" },
    ],
    rent: [
      { label: "Residential Property for Rent", path: "/rent?type=residential" },
      { label: "Commercial Property for Rent", path: "/rent?type=commercial" },
    ],
    invest: [
      { label: "Investment Properties", path: "/invest?type=properties" },
      { label: "Investment Projects", path: "/invest?type=projects" },
    ],
  };

  const NavItemWithDropdown = ({ to, label, options, onClick }) => (
    <li className="relative group">
      <div className="flex items-center">
        <NavLink
          to={to}
          onClick={onClick}
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out ${
              isActive
                ? "text-red-500 bg-red-50"
                : "text-gray-600 hover:text-red-500 hover:bg-gray-50"
            }`
          }
        >
          {label}
        </NavLink>
      </div>
      <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <ul className="py-2">
          {options.map((option, index) => (
            <li key={index}>
              <NavLink
                to={option.path}
                onClick={onClick}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:text-red-500 hover:bg-red-50 transition-colors duration-150"
              >
                {option.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );

  return (
    <>
      <header className="py-3 px-4 md:px-8 flex justify-between items-center bg-white/80 backdrop-blur-lg shadow-md fixed top-0 left-0 w-full z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
            src={Nav_Logo}
            alt="LOGO"
          />
          <h1 className="text-[18px] md:text-2xl lg:text-3xl text-gray-800 font-bold tracking-tight">
            <NavLink to="/" className="hover:text-red-500 transition-colors duration-200">
              LuxeLiving
            </NavLink>
          </h1>
        </div>

        <div className="md:hidden">
          <button onClick={handleButtonToggle} className="text-2xl text-gray-700 p-1">
            {show ? <IoClose /> : <GiHamburgerMenu />}
          </button>
        </div>

        <nav
          className={`${
            show
              ? "flex flex-col absolute top-16 left-0 w-full bg-white z-50 p-6 shadow-xl md:hidden"
              : "hidden"
          } md:flex md:items-center md:gap-1 lg:gap-3`}
        >
          <ul className="flex flex-col md:flex-row gap-4 md:gap-1 lg:gap-2 text-base md:text-sm lg:text-base">
            <NavItemWithDropdown to="/" label="Buy" options={dropdownOptions.buy} onClick={handleLinkClick} />
            <NavItemWithDropdown to="/sell" label="Sell" options={dropdownOptions.sell} onClick={handleLinkClick} />
            <NavItemWithDropdown to="/rent" label="Rent" options={dropdownOptions.rent} onClick={handleLinkClick} />
            <NavItemWithDropdown to="/invest" label="Invest" options={dropdownOptions.invest} onClick={handleLinkClick} />
          </ul>
          <button onClick={openSignIn} className="mt-4 md:hidden px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-full">
            Sign In
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div 
              className="relative group"
              onMouseEnter={() => setShowProfileDropdown(true)}
              onMouseLeave={() => setShowProfileDropdown(false)}
            >
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:border-gray-400 transition-all">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold overflow-hidden">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </button>
              
              <div className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 ${showProfileDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                {user?.role === "admin" && (
                  <button
                    onClick={() => { navigate("/admin"); setShowProfileDropdown(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={handleProfileClick}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                >
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={openSignIn}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={closeAuthModal}
        initialMode={authMode}
      />
    </>
  );
};
