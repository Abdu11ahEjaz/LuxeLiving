import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import AreaManagement from "../components/Admin/AreaManagement.jsx";
import { usePageLoad } from "../hooks/usePageLoad.js";
import { Mail, MessageSquare, Phone, MapPin, Calendar, Trash2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminDashboard = () => {
  // Tab and data state management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [wanted, setWanted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [approving, setApproving] = useState({});
  const [deleting, setDeleting] = useState({});
  const [deletingInquiry, setDeletingInquiry] = useState({});
  const [deletingWanted, setDeletingWanted] = useState({});
  const [showMessage, setShowMessage] = useState("");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState("");
  const [wantedStatusFilter, setWantedStatusFilter] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [selectedWanted, setSelectedWanted] = useState(null);
  const fetchTimeoutRef = useRef(null);

  // Show loading animation when fetching admin data
  usePageLoad(loading);

  // Filter state
  const [filters, setFilters] = useState({
    purpose: "",
    mainCategory: "",
    city: "",
    area: "",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    maxSize: "",
    approvalStatus: ""
  });

  const token = localStorage.getItem("token");

  // Fetch data with support for different tabs and filters
  const fetchData = useCallback(async (searchValue = searchTerm, filterValues = filters) => {
    setLoading(true);
    try {
      if (activeTab === "dashboard" || activeTab === "properties" || activeTab === "pending") {
        const params = new URLSearchParams();

        Object.keys(filterValues).forEach(key => {
          if (filterValues[key]) params.append(key, filterValues[key]);
        });

        if (searchValue) params.append("search", searchValue);

        if (activeTab === "pending") {
          params.set("approvalStatus", "pending");
        }

        const response = await axios.get(`${API_BASE_URL}/admin/properties?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProperties(response.data || []);
      } else if (activeTab === "users") {
        const response = await axios.get(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data || []);
      } else if (activeTab === "inquiries") {
        const response = await axios.get(`${API_BASE_URL}/inquiries`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInquiries(response.data || []);
      } else if (activeTab === "wanted") {
        const response = await axios.get(`${API_BASE_URL}/properties/wanted`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWanted(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      if (activeTab === "inquiries") {
        setInquiries([]);
      } else if (activeTab === "wanted") {
        setWanted([]);
      } else {
        setProperties([]);
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, token, searchTerm, filters]);

  // Fetch data when tab changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced fetch for filter and search changes
  useEffect(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    fetchTimeoutRef.current = setTimeout(() => {
      fetchData(searchTerm, filters);
    }, 300);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [searchTerm, filters, fetchData]);

  // Update individual filter value
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle property approval/rejection with optimistic update
  const handleApproveProperty = async (propertyId, status) => {
    if (approving[propertyId]) return;

    setApproving(prev => ({ ...prev, [propertyId]: true }));

    try {
      await axios.patch(
        `${API_BASE_URL}/admin/properties/${propertyId}/approval`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowMessage(`Property has been ${status}`);
      setTimeout(() => setShowMessage(""), 2500);
      setProperties(prev => prev.filter(p => p._id !== propertyId));

    } catch (error) {
      console.error("Failed to update property:", error);
      setShowMessage("Operation failed. Please try again.");
      setTimeout(() => setShowMessage(""), 2500);
    } finally {
      setApproving(prev => ({ ...prev, [propertyId]: false }));
    }
  };

  // Delete property with confirmation
  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    setDeleting(prev => ({ ...prev, [propertyId]: true }));

    try {
      await axios.delete(`${API_BASE_URL}/admin/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowMessage("Property has been deleted");
      setTimeout(() => setShowMessage(""), 2500);
      setProperties(prev => prev.filter(p => p._id !== propertyId));

    } catch (error) {
      console.error("Failed to delete property:", error);
      setShowMessage("Failed to delete property");
      setTimeout(() => setShowMessage(""), 2500);
    } finally {
      setDeleting(prev => ({ ...prev, [propertyId]: false }));
    }
  };

  // Delete user with cascade deletion of their properties
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? All their properties will also be deleted.")) return;

    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowMessage("User has been deleted");
      setTimeout(() => setShowMessage(""), 2500);
      setUsers(prev => prev.filter(u => u._id !== userId));

    } catch (error) {
      console.error("Failed to delete user:", error);
      setShowMessage("Failed to delete user");
      setTimeout(() => setShowMessage(""), 2500);
    }
  };

  // Delete inquiry
  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;

    setDeletingInquiry(prev => ({ ...prev, [inquiryId]: true }));

    try {
      await axios.delete(`${API_BASE_URL}/inquiries/${inquiryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowMessage("Inquiry has been deleted");
      setTimeout(() => setShowMessage(""), 2500);
      setInquiries(prev => prev.filter(i => i._id !== inquiryId));
      setSelectedInquiry(null);

    } catch (error) {
      console.error("Failed to delete inquiry:", error);
      setShowMessage("Failed to delete inquiry");
      setTimeout(() => setShowMessage(""), 2500);
    } finally {
      setDeletingInquiry(prev => ({ ...prev, [inquiryId]: false }));
    }
  };

  // Update inquiry status
  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/inquiries/${inquiryId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInquiries(prev =>
        prev.map(i => i._id === inquiryId ? { ...i, status: newStatus } : i)
      );
      
      if (selectedInquiry && selectedInquiry._id === inquiryId) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }

      setShowMessage(`Inquiry status updated to ${newStatus}`);
      setTimeout(() => setShowMessage(""), 2500);

    } catch (error) {
      console.error("Failed to update inquiry:", error);
      setShowMessage("Failed to update inquiry status");
      setTimeout(() => setShowMessage(""), 2500);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
  };

  // Reset all filters and search
  const clearFilters = () => {
    setFilters({
      purpose: "",
      mainCategory: "",
      city: "",
      area: "",
      minPrice: "",
      maxPrice: "",
      minSize: "",
      maxSize: "",
      approvalStatus: ""
    });
    setSearchTerm("");
  };

  // Extract unique values for filter dropdowns
  const categories = [...new Set(properties.map(p => p.mainCategory).filter(Boolean))];
  const cities = [...new Set(properties.map(p => p.city).filter(Boolean))];
  const areas = [...new Set(properties.map(p => p.area).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <div className="bg-red-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">ADMIN DASHBOARD</h1>
      </div>

      <div className="bg-white shadow">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "dashboard" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("properties")}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "properties" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            All Properties
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "pending" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Pending Approval
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "users" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("areas")}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "areas" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Manage Areas
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "inquiries" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab("wanted")}
            className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === "wanted" ? "border-b-2 border-red-600 text-red-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Wanted ({wanted.length})
          </button>
        </div>
      </div>

      {showMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded shadow-lg z-50 animate-pulse">
          {showMessage}
        </div>
      )}

      <div className="p-6">
        {activeTab === "dashboard" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-gray-500 text-sm font-medium">Total Properties</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{properties.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{users.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-gray-500 text-sm font-medium">Pending Approval</h3>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {properties.filter(p => p.approvalStatus === "pending").length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h3 className="text-gray-500 text-sm font-medium">Approved</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {properties.filter(p => p.approvalStatus === "approved").length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-gray-800 mb-4">By Purpose</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">For Sale</span>
                    <span className="font-bold text-gray-800">{properties.filter(p => p.purpose === "sale").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">For Rent</span>
                    <span className="font-bold text-gray-800">{properties.filter(p => p.purpose === "rent").length}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-gray-800 mb-4">By Category</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{cat}</span>
                      <span className="font-bold text-gray-800">{properties.filter(p => p.mainCategory === cat).length}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-gray-800 mb-4">Top Cities</h3>
                <div className="space-y-2">
                  {cities.slice(0, 5).map(city => (
                    <div key={city} className="flex justify-between">
                      <span className="text-gray-600">{city}</span>
                      <span className="font-bold text-gray-800">{properties.filter(p => p.city === city).length}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === "properties" || activeTab === "pending") && (
          <div>
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder="Search by name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
              <button 
                type="submit" 
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Search
              </button>
            </form>

            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <div className="flex flex-wrap gap-3">
                <select
                  value={filters.purpose}
                  onChange={(e) => handleFilterChange("purpose", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm"
                >
                  <option value="">All Purposes</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>

                <select
                  value={filters.mainCategory}
                  onChange={(e) => handleFilterChange("mainCategory", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm"
                >
                  <option value="">All Categories</option>
                  <option value="residential">Residential</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </select>

                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>

                <select
                  value={filters.area}
                  onChange={(e) => handleFilterChange("area", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm"
                >
                  <option value="">All Areas</option>
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>

                <select
                  value={filters.approvalStatus}
                  onChange={(e) => handleFilterChange("approvalStatus", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition font-medium"
                >
                  Clear Filters
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded w-32 focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded w-32 focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm"
                />
                <input
                  type="number"
                  placeholder="Min Size"
                  value={filters.minSize}
                  onChange={(e) => handleFilterChange("minSize", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded w-32 focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm"
                />
                <input
                  type="number"
                  placeholder="Max Size"
                  value={filters.maxSize}
                  onChange={(e) => handleFilterChange("maxSize", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded w-32 focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm"
                />
              </div>
            </div>

            <p className="mb-4 text-gray-600 font-medium">
              Showing {properties.length} properties
            </p>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin">
                  <div className="h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
                </div>
                <p className="text-gray-500 mt-4">Loading properties...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Purpose</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">City</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Owner</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {properties.map((property) => (
                      <tr 
                        key={property._id} 
                        style={{
                          opacity: deleting[property._id] || approving[property._id] ? 0.5 : 1,
                          transform: deleting[property._id] || approving[property._id] ? "scale(0.95)" : "scale(1)",
                          transition: "all 0.3s ease-in-out"
                        }}
                      >
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-xs text-gray-500">{property.area}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            property.purpose === "sale" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }`}>
                            {property.purpose === "sale" ? "Sale" : "Rent"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">{property.mainCategory}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{property.city}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">PKR {(property.price ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            property.approvalStatus === "approved" ? "bg-green-100 text-green-800" : 
                            property.approvalStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {property.approvalStatus === "approved" ? "Approved" : 
                             property.approvalStatus === "pending" ? "Pending" : "Rejected"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div className="font-medium">{property.owner?.name}</div>
                          <div className="text-xs text-gray-500">{property.owner?.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {property.approvalStatus === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApproveProperty(property._id, "approved")}
                                  disabled={approving[property._id] || deleting[property._id]}
                                  className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition font-medium"
                                >
                                  {approving[property._id] ? "..." : "Approve"}
                                </button>
                                <button
                                  onClick={() => handleApproveProperty(property._id, "rejected")}
                                  disabled={approving[property._id] || deleting[property._id]}
                                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition font-medium"
                                >
                                  {approving[property._id] ? "..." : "Reject"}
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteProperty(property._id)}
                              disabled={deleting[property._id] || approving[property._id]}
                              className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition font-medium"
                            >
                              {deleting[property._id] ? "..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {properties.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium">No properties found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <p className="mb-4 text-gray-600 font-medium">Total Users: {users.length}</p>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin">
                  <div className="h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
                </div>
                <p className="text-gray-500 mt-4">Loading users...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Joined</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr 
                        key={user._id}
                        style={{
                          opacity: deleting[user._id] ? 0.5 : 1,
                          transform: deleting[user._id] ? "scale(0.95)" : "scale(1)",
                          transition: "all 0.3s ease-in-out"
                        }}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.email || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.phone || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={deleting[user._id]}
                            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition font-medium"
                          >
                            {deleting[user._id] ? "..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium">No users found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "areas" && (
          <AreaManagement />
        )}

        {activeTab === "inquiries" && (
          <div>
            <div className="mb-4">
              <div className="flex gap-3 items-center">
                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => setInquiryStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition text-sm"
                >
                  <option value="">All Inquiries ({inquiries.length})</option>
                  <option value="new">New ({inquiries.filter(i => i.status === "new").length})</option>
                  <option value="contacted">Contacted ({inquiries.filter(i => i.status === "contacted").length})</option>
                  <option value="resolved">Resolved ({inquiries.filter(i => i.status === "resolved").length})</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin">
                  <div className="h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
                </div>
                <p className="text-gray-500 mt-4">Loading inquiries...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Inquiries List */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden max-h-[600px] overflow-y-auto">
                  {(inquiryStatusFilter ? inquiries.filter(i => i.status === inquiryStatusFilter) : inquiries).length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <p>No inquiries found</p>
                    </div>
                  ) : (
                    (inquiryStatusFilter ? inquiries.filter(i => i.status === inquiryStatusFilter) : inquiries).map(inquiry => (
                      <button
                        key={inquiry._id}
                        onClick={() => setSelectedInquiry(inquiry)}
                        className={`w-full p-4 text-left border-b hover:bg-red-50 transition ${
                          selectedInquiry?._id === inquiry._id ? "bg-red-100 border-l-4 border-l-red-600" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 truncate">{inquiry.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            inquiry.status === "new" ? "bg-blue-100 text-blue-800" :
                            inquiry.status === "contacted" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate mb-1">{inquiry.propertyTitle}</p>
                        <p className="text-xs text-gray-500">{inquiry.email}</p>
                      </button>
                    ))
                  )}
                </div>

                {/* Inquiry Details */}
                {selectedInquiry ? (
                  <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 pb-4 border-b">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{selectedInquiry.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">Inquiry ID: {selectedInquiry._id}</p>
                      </div>
                      <select
                        value={selectedInquiry.status}
                        onChange={(e) => handleUpdateInquiryStatus(selectedInquiry._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>

                    {/* Property Info */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Property Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Property</p>
                          <p className="font-medium text-gray-900">{selectedInquiry.propertyTitle}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Price</p>
                          <p className="font-medium text-gray-900">PKR {selectedInquiry.propertyPrice?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Location</p>
                          <p className="font-medium text-gray-900">{selectedInquiry.propertyArea}, {selectedInquiry.propertyCity}</p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Contact Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Customer Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="text-xs text-gray-600">Email</p>
                            <a href={`mailto:${selectedInquiry.email}`} className="text-sm font-medium text-blue-600 hover:underline">
                              {selectedInquiry.email}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="text-xs text-gray-600">Phone</p>
                            <a href={`tel:+92${selectedInquiry.phone}`} className="text-sm font-medium text-blue-600 hover:underline">
                              +92{selectedInquiry.phone}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-red-600 mt-1" />
                          <div>
                            <p className="text-xs text-gray-600">Submitted</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(selectedInquiry.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Message</h4>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <a
                        href={`mailto:${selectedInquiry.email}?subject=Re: Your Property Inquiry`}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium text-sm"
                      >
                        Reply via Email
                      </a>
                      <a
                        href={`https://wa.me/92${selectedInquiry.phone}?text=Hi%20${encodeURIComponent(selectedInquiry.name)}%2C%20Thank%20you%20for%20your%20inquiry.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center font-medium text-sm"
                      >
                        WhatsApp
                      </a>
                      <button
                        onClick={() => handleDeleteInquiry(selectedInquiry._id)}
                        disabled={deletingInquiry[selectedInquiry._id]}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition font-medium text-sm flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deletingInquiry[selectedInquiry._id] ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="lg:col-span-2 bg-white rounded-lg shadow p-12 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Select an inquiry to view details</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "wanted" && (
          <div>
            <div className="mb-4 flex gap-2">
              <select
                value={wantedStatusFilter}
                onChange={(e) => setWantedStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Wanted List */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Wanted Inquiries</h3>
                  <p className="text-xs text-gray-500 mt-1">Total: {wanted.length}</p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {wanted.filter(w => !wantedStatusFilter || w.status === wantedStatusFilter).length > 0 ? (
                    wanted.filter(w => !wantedStatusFilter || w.status === wantedStatusFilter).map((inquiry) => (
                      <button
                        key={inquiry._id}
                        onClick={() => setSelectedWanted(inquiry)}
                        className={`w-full p-4 text-left border-b hover:bg-red-50 transition ${
                          selectedWanted?._id === inquiry._id ? "bg-red-100 border-l-4 border-l-red-600" : ""
                        }`}
                      >
                        <p className="font-medium text-gray-900">{inquiry.name}</p>
                        <p className="text-xs text-gray-600">{inquiry.type === "buy" ? "Want to Buy" : "Want to Rent"}</p>
                        <p className="text-xs text-gray-500">{inquiry.city}, {inquiry.area}</p>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded font-medium ${
                          inquiry.status === "new" ? "bg-blue-100 text-blue-700" :
                          inquiry.status === "contacted" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No inquiries found
                    </div>
                  )}
                </div>
              </div>

              {/* Wanted Details */}
              {selectedWanted ? (
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6 pb-4 border-b">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedWanted.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Inquiry ID: {selectedWanted._id}</p>
                    </div>
                    <select
                      value={selectedWanted.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        axios.patch(
                          `${API_BASE_URL}/properties/wanted/${selectedWanted._id}`,
                          { status: newStatus },
                          { headers: { Authorization: `Bearer ${token}` } }
                        ).then(() => {
                          setSelectedWanted({...selectedWanted, status: newStatus});
                          setWanted(prev => prev.map(w => w._id === selectedWanted._id ? {...w, status: newStatus} : w));
                          setShowMessage("Status updated successfully");
                        }).catch(err => console.error("Error updating status:", err));
                      }}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-6">
                    {/* What They Want */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-600" />
                        What They're Looking For
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600 text-sm">Type</p>
                          <p className="font-medium text-gray-900">{selectedWanted.type === "buy" ? "Want to Buy" : "Want to Rent"}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Property Type</p>
                          <p className="font-medium text-gray-900">{selectedWanted.propertyType?.charAt(0).toUpperCase() + selectedWanted.propertyType?.slice(1)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Location</p>
                          <p className="font-medium text-gray-900">{selectedWanted.area}, {selectedWanted.city}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Status</p>
                          <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                            selectedWanted.status === "new" ? "bg-blue-100 text-blue-700" :
                            selectedWanted.status === "contacted" ? "bg-yellow-100 text-yellow-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {selectedWanted.status.charAt(0).toUpperCase() + selectedWanted.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-red-600" />
                        Contact Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Phone</p>
                          <a href={`tel:${selectedWanted.phone}`} className="text-sm font-medium text-blue-600 hover:underline">
                            {selectedWanted.phone}
                          </a>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Submitted</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(selectedWanted.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    {selectedWanted.details && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Additional Details</h4>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedWanted.details}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <a
                      href={`tel:${selectedWanted.phone}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${selectedWanted.phone}?text=Hi%20${encodeURIComponent(selectedWanted.name)}%2C%20Thank%20you%20for%20your%20inquiry.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </a>
                    <button
                      onClick={() => {
                        setDeletingWanted(prev => ({...prev, [selectedWanted._id]: true}));
                        axios.delete(
                          `${API_BASE_URL}/properties/wanted/${selectedWanted._id}`,
                          { headers: { Authorization: `Bearer ${token}` } }
                        ).then(() => {
                          setShowMessage("Inquiry deleted successfully");
                          setWanted(prev => prev.filter(w => w._id !== selectedWanted._id));
                          setSelectedWanted(null);
                        }).catch(err => {
                          console.error("Error deleting:", err);
                          setShowMessage("Failed to delete inquiry");
                        }).finally(() => {
                          setDeletingWanted(prev => ({...prev, [selectedWanted._id]: false}));
                        });
                      }}
                      disabled={deletingWanted[selectedWanted._id]}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition font-medium text-sm flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingWanted[selectedWanted._id] ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-12 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Select an inquiry to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
