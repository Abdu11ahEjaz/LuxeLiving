import express from "express";
import {
  createProperty,
  getApprovedProperties,
  getMyProperties,
  getFilteredProperties,
  getPropertyById,
} from "../controllers/propertyController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// Protected route for user's properties (must come before /:id)
router.get("/my-properties", protect, getMyProperties);

// Public routes for property browsing (must come before /:id)
router.get("/filter", getFilteredProperties);
router.get("/", getApprovedProperties);

// Get single property by ID (must be last)
router.get("/:id", getPropertyById);

// Protected route for property creation with file upload
router.post(
  "/",
  protect,
  (req, res, next) => {
    console.log("Processing file upload...");
    next();
  },
  upload.array("images", 5),
  (err, req, res, next) => {
    // Multer error handler
    if (err) {
      console.error("Upload error:", err.message);
      return res.status(400).json({
        message: "File upload error",
        error: err.message
      });
    }
    next();
  },
  createProperty
);

export default router;
