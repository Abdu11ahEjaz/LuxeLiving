import Property from "../models/property.js";

// GET ALL PROPERTIES (ADMIN) with filtering
export const getAllPropertiesAdmin = async (req, res) => {
  try {
    const {
      purpose,
      mainCategory,
      city,
      area,
      areaUnit,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      approvalStatus,
      search
    } = req.query;

    let query = {};

    // Filter by purpose (sale/rent)
    if (purpose) {
      query.purpose = purpose;
    }

    // Filter by category
    if (mainCategory) {
      query.mainCategory = mainCategory;
    }

    // Filter by city
    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    // Filter by area/location
    if (area) {
      query.area = { $regex: area, $options: "i" };
    }

    // Filter by area unit
    if (areaUnit) {
      query.areaUnit = areaUnit;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by size range
    if (minSize || maxSize) {
      query.areaSize = {};
      if (minSize) query.areaSize.$gte = Number(minSize);
      if (maxSize) query.areaSize.$lte = Number(maxSize);
    }

    // Filter by approval status
    if (approvalStatus) {
      query.approvalStatus = approvalStatus;
    }

    // Search by title, description, city, or area
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } }
      ];
    }

    const properties = await Property.find(query)
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

// GET PENDING PROPERTIES (ADMIN)
export const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      approvalStatus: "pending"
    }).populate("owner", "name email phone");

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending properties" });
  }
};

// APPROVE OR REJECT PROPERTY
export const updatePropertyApproval = async (req, res) => {
  try {
    const { status } = req.body; // approved | rejected
    const { id } = req.params;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const property = await Property.findByIdAndUpdate(
      id,
      { approvalStatus: status },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({
      message: `Property ${status}`,
      property
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update property" });
  }
};

// DELETE PROPERTY (ADMIN)
export const deletePropertyAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete property" });
  }
};

// SEARCH PROPERTIES (ADMIN)
export const searchProperties = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: "Search term required" });
    }

    const properties = await Property.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } }
      ]
    })
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Failed to search properties" });
  }
};
