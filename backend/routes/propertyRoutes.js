import express from "express";
import {
  createProperty,
  getApprovedProperties,
  getMyProperties,
  getFilteredProperties,
} from "../controllers/propertyController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// Public routes for property browsing
router.get("/", getApprovedProperties);
router.get("/filter", getFilteredProperties);

// Middleware logging for debugging
router.use((req, res, next) => {
  console.log("Property route hit:", req.method, req.originalUrl);
  next();
});

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

// Protected route for user's properties
router.get("/my-properties", protect, getMyProperties);

export default router;
