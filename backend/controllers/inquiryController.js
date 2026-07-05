import Inquiry from "../models/Inquiry.js";
import nodemailer from "nodemailer";

// Get admin email from environment
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@luxeliving.com";

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Create new inquiry
export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, propertyId, propertyTitle, propertyPrice, propertyCity, propertyArea } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message || !propertyId) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // Create inquiry
    const inquiry = new Inquiry({
      name,
      email,
      phone,
      message,
      propertyId,
      propertyTitle,
      propertyPrice,
      propertyCity,
      propertyArea,
    });

    await inquiry.save();

    // Send email to admin
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: ADMIN_EMAIL,
        subject: `New Property Inquiry - ${propertyTitle}`,
        html: `
          <h2>New Inquiry Received</h2>
          <p><strong>Property:</strong> ${propertyTitle}</p>
          <p><strong>Location:</strong> ${propertyArea}, ${propertyCity}</p>
          <p><strong>Price:</strong> PKR ${propertyPrice?.toLocaleString()}</p>
          <hr>
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <hr>
          <h3>Message</h3>
          <p>${message}</p>
          <hr>
          <p><small>Inquiry ID: ${inquiry._id}</small></p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Inquiry email sent to admin");
    } catch (emailErr) {
      console.error("Error sending inquiry email:", emailErr);
      // Don't fail the request if email sending fails
    }

    res.status(201).json({
      message: "Inquiry submitted successfully",
      inquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    res.status(500).json({ message: "Error submitting inquiry", error: err.message });
  }
};

// Get all inquiries (admin only)
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("propertyId", "title images")
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({ message: "Error fetching inquiries", error: err.message });
  }
};

// Get single inquiry
export const getInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findById(id).populate("propertyId");

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json(inquiry);
  } catch (err) {
    console.error("Error fetching inquiry:", err);
    res.status(500).json({ message: "Error fetching inquiry", error: err.message });
  }
};

// Update inquiry status (admin only)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!["new", "contacted", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json(inquiry);
  } catch (err) {
    console.error("Error updating inquiry:", err);
    res.status(500).json({ message: "Error updating inquiry", error: err.message });
  }
};

// Delete inquiry (admin only)
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (err) {
    console.error("Error deleting inquiry:", err);
    res.status(500).json({ message: "Error deleting inquiry", error: err.message });
  }
};
