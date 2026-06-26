import express from "express";
import {
  getAllPropertiesAdmin,
  getPendingProperties,
  updatePropertyApproval,
  deletePropertyAdmin,
  searchProperties
} from "../controllers/adminPropertyController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  deleteUser
} from "../controllers/adminController.js";

const router = express.Router();

// ADMIN ONLY - Properties
router.get("/properties", protect, adminOnly, getAllPropertiesAdmin);
router.get("/properties/pending", protect, adminOnly, getPendingProperties);
router.get("/properties/search", protect, adminOnly, searchProperties);
router.patch(
  "/properties/:id/approval",
  protect,
  adminOnly,
  updatePropertyApproval
);
router.delete(
  "/properties/:id",
  protect,
  adminOnly,
  deletePropertyAdmin
);

// ADMIN ONLY - Users
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
