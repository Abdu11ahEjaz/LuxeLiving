import Wanted from "../models/Wanted.js";

// Create a wanted inquiry
export const createWantedInquiry = async (req, res) => {
  try {
    const { type, propertyType, city, area, name, phone, details, agreed } =
      req.body;

    // Validate required fields
    if (!type || !propertyType || !city || !area || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (!agreed) {
      return res.status(400).json({
        success: false,
        message: "You must agree to the terms of service",
      });
    }

    // Create new inquiry
    const wantedInquiry = new Wanted({
      type,
      propertyType,
      city,
      area,
      name,
      phone,
      details,
      agreed,
    });

    await wantedInquiry.save();

    return res.status(201).json({
      success: true,
      message: "Your inquiry has been successfully submitted",
      data: wantedInquiry,
    });
  } catch (error) {
    console.error("Error creating wanted inquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating inquiry",
      error: error.message,
    });
  }
};

// Get all wanted inquiries (admin only)
export const getAllWantedInquiries = async (req, res) => {
  try {
    const inquiries = await Wanted.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching inquiries",
      error: error.message,
    });
  }
};

// Update inquiry status (admin only)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["new", "contacted", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const inquiry = await Wanted.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry status updated",
      data: inquiry,
    });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating inquiry",
      error: error.message,
    });
  }
};
