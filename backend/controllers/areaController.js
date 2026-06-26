import Area from "../models/Area.js";
import Property from "../models/property.js";

// ============================
// CREATE AREA (ADMIN)
// ============================
export const createArea = async (req, res) => {
  try {
    const { 
      name, 
      city, 
      description, 
      shortDescription, 
      latitude, 
      longitude,
      rentIncreasePercentage,
      saleIncreasePercentage,
      averageRentPerSqft,
      newListingsForSale
    } = req.body;

    // Validate required fields
    if (!name || !city || !description) {
      return res.status(400).json({ 
        message: "Area name, city, and description are required" 
      });
    }

    // Check if area already exists in the specified city
    const existingArea = await Area.findOne({
      name: name.trim(),
      city: city.trim(),
    });
    
    if (existingArea) {
      return res.status(400).json({ message: "Area already exists in this city" });
    }

    // Process uploaded images for storage
    const images = req.files && req.files.length > 0
      ? req.files.map((file) => ({
          url: file.path,
          public_id: file.filename,
        }))
      : [];

    // Prepare area data with all provided fields and defaults
    const areaData = {
      name: name.trim(),
      city: city.trim(),
      description,
      shortDescription: shortDescription || "",
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      mapEmbedUrl: req.body.mapEmbedUrl || "",
      rentIncreasePercentage: rentIncreasePercentage ? parseFloat(rentIncreasePercentage) : 0,
      saleIncreasePercentage: saleIncreasePercentage ? parseFloat(saleIncreasePercentage) : 0,
      averageRentPerSqft: averageRentPerSqft ? parseFloat(averageRentPerSqft) : 0,
      newListingsForSale: newListingsForSale ? parseInt(newListingsForSale) : 0,
      images,
    };

    // Create new area in database
    const area = await Area.create(areaData);

    res.status(201).json({
      message: "Area created successfully",
      area,
    });
  } catch (error) {
    console.error("Error creating area:", error.message);
    
    res.status(500).json({
      message: "Failed to create area",
      error: error.message,
      details: error.errors || error.stack,
    });
  }
};

// ============================
// GET ALL AREAS (PUBLIC)
// ============================
export const getAllAreas = async (req, res) => {
  try {
    const { city, limit = 100 } = req.query;

    // Build filter query based on city parameter
    let filter = { isActive: true };
    if (city) {
      filter.city = city;
    }

    // Retrieve areas with optional limit
    const areas = await Area.find(filter).limit(Number(limit));

    res.json(areas);
  } catch (error) {
    console.error("Error fetching areas:", error.message);
    res.status(500).json({
      message: "Failed to fetch areas",
      error: error.message,
    });
  }
};

// ============================
// GET SINGLE AREA (PUBLIC)
// ============================
export const getAreaByName = async (req, res) => {
  try {
    const { city, areaName } = req.params;

    // Retrieve area by name and city, only if active
    const area = await Area.findOne({
      name: areaName,
      city: city,
      isActive: true,
    });

    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    // Fetch all approved properties in this area
    const properties = await Property.find({
      area: areaName,
      city: city,
      approvalStatus: "approved",
      isActive: true,
    });

    // Separate properties by purpose (rent vs sale)
    const rentProperties = properties.filter((p) => p.purpose === "rent");
    const saleProperties = properties.filter((p) => p.purpose === "sale");

    // Calculate price ranges for statistics
    const rentPrices = rentProperties.map((p) => p.price);
    const salePrices = saleProperties.map((p) => p.price);

    const stats = {
      totalProperties: properties.length,
      rentProperties: rentProperties.length,
      saleProperties: saleProperties.length,
      rentPriceRange: {
        min: rentPrices.length > 0 ? Math.min(...rentPrices) : 0,
        max: rentPrices.length > 0 ? Math.max(...rentPrices) : 0,
      },
      salePriceRange: {
        min: salePrices.length > 0 ? Math.min(...salePrices) : 0,
        max: salePrices.length > 0 ? Math.max(...salePrices) : 0,
      },
    };

    res.json({
      area,
      stats,
      properties: properties.slice(0, 6), // Return first 6 properties
    });
  } catch (error) {
    console.error("Error fetching area:", error.message);
    
    res.status(500).json({
      message: "Failed to fetch area",
      error: error.message,
    });
  }
};

// ============================
// UPDATE AREA (ADMIN)
// ============================
export const updateArea = async (req, res) => {
  try {
    const { areaId } = req.params;
    const { name, city, description, shortDescription, latitude, longitude } =
      req.body;

    // Prepare update data with provided fields
    let updateData = {
      name,
      city,
      description,
      shortDescription,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      mapEmbedUrl: req.body.mapEmbedUrl || "",
    };

    // Replace images if new ones were uploaded
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    // Update area by ID and return updated document
    const area = await Area.findByIdAndUpdate(areaId, updateData, {
      new: true,
    });

    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    res.json({
      message: "Area updated successfully",
      area,
    });
  } catch (error) {
    console.error("Error updating area:", error.message);
    
    res.status(500).json({
      message: "Failed to update area",
      error: error.message,
    });
  }
};

// ============================
// DELETE AREA (ADMIN)
// ============================
export const deleteArea = async (req, res) => {
  try {
    const { areaId } = req.params;

    // Mark area as inactive instead of hard delete
    const area = await Area.findByIdAndUpdate(
      areaId,
      { isActive: false },
      { new: true }
    );

    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    res.json({ message: "Area deleted successfully" });
  } catch (error) {
    console.error("Error deleting area:", error.message);
    
    res.status(500).json({
      message: "Failed to delete area",
      error: error.message,
    });
  }
};

// ============================
// GET CITIES (PUBLIC)
// ============================
export const getCities = async (req, res) => {
  try {
    // Retrieve distinct cities from active areas and sort alphabetically
    const cities = await Area.distinct("city", { isActive: true });
    
    res.json(cities.sort());
  } catch (error) {
    console.error("Error fetching cities:", error.message);
    res.status(500).json({
      message: "Failed to fetch cities",
      error: error.message,
    });
  }
};

// ============================
// GET AREAS BY CITY (PUBLIC)
// ============================
export const getAreasByCity = async (req, res) => {
  try {
    const { city } = req.params;

    // Retrieve all active areas for specified city, selecting essential fields only
    const areas = await Area.find({
      city: city,
      isActive: true,
    }).select("name city images");

    res.json(areas);
  } catch (error) {
    console.error("Error fetching areas by city:", error.message);
    res.status(500).json({
      message: "Failed to fetch areas",
      error: error.message,
    });
  }
};
