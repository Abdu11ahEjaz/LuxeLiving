import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
} from "../controllers/favoriteController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:propertyId", protect, addToFavorites);
router.delete("/:propertyId", protect, removeFromFavorites);
router.get("/", protect, getUserFavorites);

export default router;
