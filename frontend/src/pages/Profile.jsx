import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Heart, Home, Edit2, Save, X, Camera } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [myProperties, setMyProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("properties");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(() => {
    if (user?.id) {
      return localStorage.getItem(`profileImage_${user.id}`) || null;
    }
    return null;
  });
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const [propertiesRes, favoritesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/properties/my-properties`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setMyProperties(propertiesRes.data || []);
      setFavorites(favoritesRes.data || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/auth/profile`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateUser(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatPrice = (price) => {
    if (!price) return "Price on request";
    const num = parseFloat(price);
    if (isNaN(num)) return "Price on request";
    
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(num % 10000000 === 0 ? 0 : 1)} Crore`;
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)} Lac`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)} Thousand`;
    }
    return num.toLocaleString();
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && user?.id) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        localStorage.setItem(`profileImage_${user.id}`, base64Image);
        setProfileImage(base64Image);
        updateUser({ ...user, profileImage: base64Image });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div 
                onClick={handleProfileImageClick}
                className="w-24 h-24 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden cursor-pointer"
              >
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white cursor-pointer hover:bg-gray-700">
                <Camera className="w-4 h-4" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                  <p className="text-gray-500">{user?.email || "No email"}</p>
                  <p className="text-gray-500">{user?.phone || "No phone"}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-3 flex items-center gap-1 text-red-500 hover:text-red-600"
                  >
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("properties")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "properties"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              My Properties ({myProperties.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "favorites"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Favorites ({favorites.length})
            </div>
          </button>
        </div>

        {/* Content */}
        {activeTab === "properties" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProperties.length > 0 ? (
              myProperties.map((property) => (
                <PropertyCard 
                  key={property._id} 
                  property={property} 
                  formatPrice={formatPrice}
                  isOwner={true}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-500 mb-4">Start selling your property</p>
                <button
                  onClick={() => navigate("/sell")}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Post Property
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.length > 0 ? (
              favorites.map((fav) => (
                <PropertyCard 
                  key={fav._id} 
                  property={fav.property} 
                  formatPrice={formatPrice}
                  isOwner={false}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-500">Browse properties and add them to favorites</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PropertyCard = ({ property, formatPrice, isOwner }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate(`/property/${property._id}`)}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Image */}
      <div className="h-48 bg-gray-200 relative">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0].url}
            alt={property.propertyName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {isOwner && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
            My Listing
          </span>
        )}
        <span className="absolute top-2 right-2 px-2 py-1 bg-gray-900/70 text-white text-xs rounded capitalize">
          {property.purpose}
        </span>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-xl font-bold text-red-500 mb-1">
          {formatPrice(property.price)}
        </p>
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">
          {property.propertyName || "Property"}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-1">
          {property.area}, {property.city}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{property.bedrooms} Bed</span>
          <span>{property.bathrooms} Bath</span>
          <span>{property.size} {property.sizeUnit}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;

