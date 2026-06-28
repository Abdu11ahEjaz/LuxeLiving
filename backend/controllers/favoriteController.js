import Favorite from "../models/Favorite.js";
import mongoose from "mongoose";

// ADD TO FAVORITES
export const addToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Validate propertyId is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      user: req.user.id,
      property: propertyId
    });

    if (existing) {
      return res.status(400).json({ message: "Already in favorites" });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      property: propertyId
    });

    res.status(201).json({
      message: "Property added to favorites",
      favorite
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ message: "Error adding to favorites: " + error.message });
  }
};

// REMOVE FROM FAVORITES
export const removeFromFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Validate propertyId is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const result = await Favorite.findOneAndDelete({
      user: req.user.id,
      property: propertyId
    });

    if (!result) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    res.json({ message: "Property removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ message: "Failed to remove favorite: " + error.message });
  }
};

// GET USER FAVORITES
export const getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate("property");

    res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Failed to fetch favorites: " + error.message });
  }
};
