import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Plus } from "lucide-react";
import MapEmbed from "../UI/MapEmbed.jsx";
import { PAKISTANI_CITIES } from "../../constants/cities.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AreaManagement = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    description: "",
    shortDescription: "",
    latitude: "",
    longitude: "",
    mapSourceUrl: "",
    rentIncreasePercentage: 0,
    saleIncreasePercentage: 0,
    averageRentPerSqft: 0,
    newListingsForSale: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/areas`);
      setAreas(res.data);
    } catch (error) {
      console.error("Error fetching areas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Percentage") || name.includes("Price") || name.includes("Sqft") || name.includes("Listings")
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.city || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("city", formData.city);
      data.append("description", formData.description);
      data.append("shortDescription", formData.shortDescription);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      data.append("mapEmbedUrl", formData.mapSourceUrl);
      data.append("rentIncreasePercentage", formData.rentIncreasePercentage);
      data.append("saleIncreasePercentage", formData.saleIncreasePercentage);
      data.append("averageRentPerSqft", formData.averageRentPerSqft);
      data.append("newListingsForSale", formData.newListingsForSale);

      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      if (editingArea) {
        await axios.put(`${API_BASE_URL}/areas/${editingArea._id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Area updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/areas`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Area created successfully");
      }

      resetForm();
      fetchAreas();
    } catch (error) {
      console.error("Error saving area:", error);
      alert(error.response?.data?.message || "Error saving area");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      city: "",
      description: "",
      shortDescription: "",
      latitude: "",
      longitude: "",
      mapSourceUrl: "",
      rentIncreasePercentage: 0,
      saleIncreasePercentage: 0,
      averageRentPerSqft: 0,
      newListingsForSale: 0,
    });
    setImageFiles([]);
    setPreviewImages([]);
    setEditingArea(null);
    setShowForm(false);
  };

  const handleEdit = (area) => {
    setFormData({
      name: area.name,
      city: area.city,
      description: area.description,
      shortDescription: area.shortDescription || "",
      latitude: area.latitude || "",
      longitude: area.longitude || "",
      mapSourceUrl: "",
      rentIncreasePercentage: area.rentIncreasePercentage || 0,
      saleIncreasePercentage: area.saleIncreasePercentage || 0,
      averageRentPerSqft: area.averageRentPerSqft || 0,
      newListingsForSale: area.newListingsForSale || 0,
    });
    setEditingArea(area);
    setShowForm(true);
  };

  const handleDelete = async (areaId) => {
    if (!window.confirm("Are you sure you want to delete this area?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/areas/${areaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Area deleted successfully");
      fetchAreas();
    } catch (error) {
      console.error("Error deleting area:", error);
      alert("Error deleting area");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading areas...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Areas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add New Area
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {editingArea ? "Edit Area" : "Create New Area"}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Area Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Bahria Enclave"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select a city</option>
                  {PAKISTANI_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter detailed description of the area..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Short Description
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Brief description (optional)"
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>

            {/* Location Information */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Location Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 33.8753"
                    step="0.0001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g., 73.0479"
                    step="0.0001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Google Maps Embed URL
                </label>
                <input
                  type="url"
                  name="mapSourceUrl"
                  value={formData.mapSourceUrl}
                  onChange={handleInputChange}
                  placeholder="Paste the embed URL from Google Maps"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
                />
                <p className="text-xs text-gray-500 mt-2">
                  To get the embed URL: Right-click on map → Share → Copy embed HTML → Extract src URL
                </p>
              </div>

              {/* Map Preview */}
              {formData.mapSourceUrl && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Map Preview:</p>
                  <MapEmbed mapSourceUrl={formData.mapSourceUrl} height={300} />
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Area Statistics
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rent Increase Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="rentIncreasePercentage"
                    value={formData.rentIncreasePercentage}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sale Increase Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="saleIncreasePercentage"
                    value={formData.saleIncreasePercentage}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Average Rent Per Sq Ft
                  </label>
                  <input
                    type="number"
                    name="averageRentPerSqft"
                    value={formData.averageRentPerSqft}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Listings For Sale
                  </label>
                  <input
                    type="number"
                    name="newListingsForSale"
                    value={formData.newListingsForSale}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Area Images
              </h4>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />

              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Existing Images */}
              {editingArea && editingArea.images?.length > 0 && imageFiles.length === 0 && (
                <div>
                  <p className="text-sm text-gray-600 mt-4 mb-2">
                    Current Images:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {editingArea.images.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`Existing ${index}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-semibold"
              >
                {editingArea ? "Update Area" : "Create Area"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-8 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Areas List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            All Areas ({areas.length})
          </h3>

          {areas.length === 0 ? (
            <p className="text-gray-600">No areas created yet</p>
          ) : (
            <div className="grid gap-4">
              {areas.map((area) => (
                <div
                  key={area._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {area.name}
                      </h4>
                      <p className="text-sm text-gray-600">{area.city}</p>
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {area.description}
                      </p>
                      <div className="flex gap-4 mt-3 text-sm text-gray-600">
                        {area.latitude && (
                          <span>
                            Location: {area.latitude.toFixed(4)}, {area.longitude.toFixed(4)}
                          </span>
                        )}
                        {area.rentIncreasePercentage > 0 && (
                          <span>Rent Increase: +{area.rentIncreasePercentage}%</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(area)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(area._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Area Images */}
                  {area.images?.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {area.images.slice(0, 3).map((img, index) => (
                        <img
                          key={index}
                          src={img.url}
                          alt={`${area.name} ${index}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AreaManagement;
