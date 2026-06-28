import Property from "../models/Property.js";

// ============================
// CREATE PROPERTY (USER)
// ============================
// export const createProperty = async (req, res) => {
//   try {
//     console.log("Uploaded files:", req.files);
//     // Handle Cloudinary images
//     // const images = req.files?.map((file) => ({
//     //   url: file.path,
//     //   public_id: file.filename
//     // }));

//     // Handle Cloudinary images
//     const images = req.files
//       ? req.files.map((file) => ({
//           url: file.path,
//           public_id: file.filename,
//         }))
//       : [];

//     const property = await Property.create({
//       ...req.body,
//       images, // Cloudinary images
//       owner: req.user.id, // from JWT
//       approvalStatus: "pending",
//     });

//     console.log("User from token:", req.user);
//     console.log("Request body:", req.body);
//     console.log("Uploaded files:", req.files);

//     res.status(201).json({
//       message: "Property submitted for approval",
//       property,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to create property",
//       error: error.message,
//     });
//   }
// };


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
      console.error("Missing required fields:", missingFields);
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

    console.log("Creating property with data:", propertyData);

    const property = await Property.create(propertyData);

    console.log("Property created successfully:", property._id);

    res.status(201).json({
      message: "Property submitted for approval",
      property
    });
  } catch (error) {
    console.error("Failed to create property:", error.message);

    if (error.name === "ValidationError") {
      const validationErrors = {};
      for (let field in error.errors) {
        validationErrors[field] = error.errors[field].message;
        console.error(`Validation error on ${field}: ${error.errors[field].message}`);
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
// GET ALL APPROVED PROPERTIES (PUBLIC)
// ============================
export const getApprovedProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      approvalStatus: "approved",
      isActive: true,
    }).populate("owner", "name");

    res.json(properties);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch properties",
    });
  }
};

// ============================
// GET LOGGED-IN USER PROPERTIES
// ============================
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user.id,
    });

    res.json(properties);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user properties",
    });
  }
};

// ============================
// GET FILTERED PROPERTIES (PUBLIC)
// ============================
export const getRecentApprovedByAreas = async (req, res) => {
  try {
    const { areas: areaList } = req.query; // comma-separated: Peshawar,Rawalpindi
    const areas = areaList ? areaList.split(',') : [];
    
    if (areas.length === 0) {
      return res.json({});
    }

    // Base query for approved + recent
    const baseQuery = {
      approvalStatus: "approved",
      isActive: true
    };

    // Aggregate: group by area, top 7 recent per area
    const result = await Property.aggregate([
      { $match: baseQuery },
      { $match: { area: { $in: areas } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$area",
          properties: { $push: "$$ROOT" },
          count: { $sum: 1 }
        }
      },
      {
        $addFields: {
          properties: { $slice: ["$properties", 7] } // top 7
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
    console.error("Group by area error:", error);
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
      limit = 10,
    } = req.query;


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
      .populate("owner", "name")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      properties,
    });
  } catch (error) {
    console.error(error);
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
    console.error("Error fetching property by ID:", error);
    res.status(500).json({
      message: "Failed to fetch property details"
    });
  }
};

// import Property from "../models/property.js";

// // CREATE PROPERTY (USER)
// export const createProperty = async (req, res) => {
//   try {
//     const property = await Property.create({
//       ...req.body,
//       owner: req.user.id,   // from JWT
//       approvalStatus: "pending"
//     });

//     res.status(201).json({
//       message: "Property submitted for approval",
//       property
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create property" });
//   }
// };

// // GET ALL APPROVED PROPERTIES (PUBLIC)
// export const getApprovedProperties = async (req, res) => {
//   try {
//     const properties = await Property.find({
//       approvalStatus: "approved",
//       isActive: true
//     }).populate("owner", "name");

//     res.json(properties);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch properties" });
//   }
// };

// // GET LOGGED-IN USER PROPERTIES
// export const getMyProperties = async (req, res) => {
//   try {
//     const properties = await Property.find({
//       owner: req.user.id
//     });

//     res.json(properties);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch user properties" });
//   }
// };

// // GET FILTERED PROPERTIES (PUBLIC)
// export const getFilteredProperties = async (req, res) => {
//   try {
//     const {
//       city,
//       area,
//       purpose,
//       mainCategory,
//       subCategory,
//       minPrice,
//       maxPrice,
//       page = 1,
//       limit = 10
//     } = req.query;

//     // Build filter object dynamically
//     let filter = {
//       approvalStatus: "approved",
//       isActive: true
//     };

//     if (city) filter.city = city;
//     if (area) filter.area = area;
//     if (purpose) filter.purpose = purpose;
//     if (mainCategory) filter.mainCategory = mainCategory;
//     if (subCategory) filter.subCategory = subCategory;
//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = Number(minPrice);
//       if (maxPrice) filter.price.$lte = Number(maxPrice);
//     }

//     const properties = await Property.find(filter)
//       .populate("owner", "name")
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .sort({ createdAt: -1 });

//     const total = await Property.countDocuments(filter);

//     res.json({
//       total,
//       page: Number(page),
//       pages: Math.ceil(total / limit),
//       properties
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch filtered properties" });
//   }
// };
