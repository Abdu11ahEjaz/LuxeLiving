import express from "express";
import * as inquiryController from "../controllers/inquiryController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", inquiryController.createInquiry);

// Admin routes (require authentication)
router.get("/", protect, adminOnly, inquiryController.getInquiries);
router.get("/:id", protect, adminOnly, inquiryController.getInquiry);
router.patch("/:id", protect, adminOnly, inquiryController.updateInquiryStatus);
router.delete("/:id", protect, adminOnly, inquiryController.deleteInquiry);

export default router;
