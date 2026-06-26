import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import AreaManagement from "../components/Admin/AreaManagement.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminDashboard = () => {
  // Tab and data state management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [approving, setApproving] = useState({});
  const [deleting, setDeleting] = useState({});
  const [showMessage, setShowMessage] = useState("");
  const fetchTimeoutRef = useRef(null);

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

        const res = await axios.get(`${API_BASE_URL}/admin/properties?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProperties(res.data || []);
      } else if (activeTab === "users") {
        const res = await axios.get(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, token]);

  // Fetch data when tab changes
  useEffect(() => {
    fetchData();
  }, [activeTab]);

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
      <div className="bg-red-600 text-white p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">PKR {property.price.toLocaleString()}</td>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
