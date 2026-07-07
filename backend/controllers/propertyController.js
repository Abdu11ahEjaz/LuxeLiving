import Property from "../models/Property.js";

// ============================
// CREATE PROPERTY (USER)
// ============================
export const createProperty = async (req, res) => {
  try {
    // Parse JSON fields if they are strings
    if (req.body.features && typeof req.body.features === "string") {
      req.body.features = JSON.parse(req.body.features);
    }
    if (req.body.availableDays && typeof req.body.availableDays === "string") {
      req.body.availableDays = JSON.parse(req.body.availableDays);
    }

    // Map Cloudinary uploaded files to image objects
    const images = req.files
      ? req.files.map(file => ({
          url: file.path,
          public_id: file.filename
        }))
      : [];

    // Validate required fields before saving
    const requiredFields = ["title", "description", "purpose", "mainCategory", "subCategory", "city", "price"];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
        error: `Required fields missing: ${missingFields.join(", ")}`
      });
    }

    // Build property data object
    const propertyData = {
      title: req.body.title?.trim(),
      description: req.body.description?.trim(),
      purpose: req.body.purpose,
      mainCategory: req.body.mainCategory,
      subCategory: req.body.subCategory,
      city: req.body.city?.trim(),
      area: req.body.area?.trim(),
      address: req.body.address?.trim(),
      price: Number(req.body.price),
      areaSize: req.body.areaSize ? Number(req.body.areaSize) : undefined,
      areaUnit: req.body.areaUnit,
      bedrooms: req.body.bedrooms ? Number(req.body.bedrooms) : undefined,
      bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : undefined,
      features: Array.isArray(req.body.features) ? req.body.features : [],
      phone: req.body.phone?.trim(),
      availability: req.body.availability === true || req.body.availability === "true",
      availableDays: Array.isArray(req.body.availableDays) ? req.body.availableDays : [],
      images,
      owner: req.user._id,
      approvalStatus: "pending"
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      message: "Property submitted for approval",
      property
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = {};
      for (let field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors
      });
    }

    res.status(500).json({
      message: "Failed to create property",
      error: error.message
    });
  }
};

// ============================
// GET ALL APPROVED PROPERTIES (PUBLIC) - WITH PAGINATION
// ============================
export const getApprovedProperties = async (req, res) => {
  try {
    const { page = 1, limit = 20, purpose } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit))); // Cap at 100 per page

    // Build filter - always approved and active
    let filter = {
      approvalStatus: "approved",
      isActive: true,
    };

    // Add purpose filter if provided (sale or rent)
    if (purpose && ["sale", "rent"].includes(purpose)) {
      filter.purpose = purpose;
    }

    const properties = await Property.find(filter)
      .select("title price city area images bedrooms bathrooms purpose mainCategory subCategory createdAt")
      .populate("owner", "name")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const total = await Property.countDocuments(filter);

    const response = {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
      properties,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch properties",
      error: error.message
    });
  }
};

// ============================
// GET LOGGED-IN USER PROPERTIES - WITH OPTIMIZATION
// ============================
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user.id,
    })
      .select("title price city area images approvalStatus isActive createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json(properties);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user properties",
    });
  }
};

// ============================
// GET FILTERED PROPERTIES (PUBLIC) - WITH OPTIMIZATION
// ============================
export const getRecentApprovedByAreas = async (req, res) => {
  try {
    const { areas: areaList } = req.query;
    const areas = areaList ? areaList.split(',').map(a => a.trim()).filter(Boolean) : [];
    
    if (areas.length === 0) {
      return res.json({});
    }

    // Base query for approved + recent
    const baseQuery = {
      approvalStatus: "approved",
      isActive: true
    };

    // Aggregate: group by area, top 7 recent per area
    // Added $project to shrink documents before grouping for better memory efficiency
    const result = await Property.aggregate([
      { $match: baseQuery },
      { $match: { area: { $in: areas } } },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          title: 1,
          price: 1,
          city: 1,
          area: 1,
          images: 1,
          bedrooms: 1,
          bathrooms: 1,
          purpose: 1,
          mainCategory: 1,
          createdAt: 1
        }
      },
      {
        $group: {
          _id: "$area",
          properties: { $push: "$$ROOT" },
          count: { $sum: 1 }
        }
      },
      {
        $addFields: {
          properties: { $slice: ["$properties", 7] }
        }
      },
      {
        $project: {
          _id: 0,
          area: "$_id",
          properties: 1,
          total: "$count"
        }
      }
    ]);

    // Map to object
    const grouped = {};
    result.forEach(group => {
      grouped[group.area] = group.properties;
    });

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch grouped properties" });
  }
};

export const getFilteredProperties = async (req, res) => {
  try {
    const {
      city,
      area,
      purpose,
      mainCategory,
      subCategory,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit))); // Cap at 100 per page

    // Base filter
    let filter = {
      approvalStatus: "approved",
      isActive: true,
    };

    if (city) filter.city = city;
    if (area) filter.area = area;
    if (purpose) filter.purpose = purpose;
    if (mainCategory) filter.mainCategory = mainCategory;
    if (subCategory) filter.subCategory = subCategory;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter)
      .select("title price city area images bedrooms bathrooms purpose mainCategory subCategory createdAt")
      .populate("owner", "name")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Property.countDocuments(filter);

    res.json({
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch filtered properties",
    });
  }
};

// ============================
// GET SINGLE PROPERTY BY ID (PUBLIC)
// ============================
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id)
      .populate("owner", "name phone email");

    if (!property) {
      return res.status(404).json({
        message: "Property not found"
      });
    }

    // Only show approved properties to public users
    if (property.approvalStatus !== "approved" && (!req.user || req.user._id.toString() !== property.owner._id.toString())) {
      return res.status(403).json({
        message: "This property is not available for viewing"
      });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch property details"
    });
  }
};
