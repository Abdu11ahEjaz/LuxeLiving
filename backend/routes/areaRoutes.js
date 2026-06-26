import express from "express";
import {
  createArea,
  getAllAreas,
  getAreaByName,
  updateArea,
  deleteArea,
  getCities,
  getAreasByCity,
} from "../controllers/areaController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// =====================
// PUBLIC ROUTES (must be before :city parameter routes)
// =====================

// Get all cities - MUST BE BEFORE /:city ROUTES
router.get("/cities", getCities);

// Get all areas (with optional city filter)
router.get("/", getAllAreas);

// Get areas by city - MUST BE BEFORE /:city/:areaName
router.get("/city/:city", getAreasByCity);

// =====================
// ADMIN ROUTES (JWT)
// =====================

// Create area
router.post("/", protect, upload.array("images", 5), createArea);

// Update area
router.put("/:areaId", protect, upload.array("images", 5), updateArea);

// Delete area (soft delete)
router.delete("/:areaId", protect, deleteArea);

// =====================
// PARAMETERIZED ROUTES (MUST BE LAST)
// =====================

// Get single area by name - MUST BE LAST
router.get("/:city/:areaName", getAreaByName);

export default router;
