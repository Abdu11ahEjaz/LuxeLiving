import express from "express";
import {
  createWantedInquiry,
  getAllWantedInquiries,
  updateInquiryStatus,
} from "../controllers/wantedController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC - Create wanted inquiry
router.post("/wanted", createWantedInquiry);

// ADMIN ONLY - Get all inquiries
router.get("/wanted", protect, adminOnly, getAllWantedInquiries);

// ADMIN ONLY - Update inquiry status
router.patch("/wanted/:id", protect, adminOnly, updateInquiryStatus);

export default router;
