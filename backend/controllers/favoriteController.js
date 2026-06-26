import Favorite from "../models/Favorite.js";

// ADD TO FAVORITES
export const addToFavorites = async (req, res) => {
  try {
    const favorite = await Favorite.create({
      user: req.user.id,
      property: req.params.propertyId
    });

    res.status(201).json({
      message: "Property added to favorites",
      favorite
    });
  } catch (error) {
    res.status(400).json({ message: "Already in favorites" });
  }
};

// REMOVE FROM FAVORITES
export const removeFromFavorites = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user.id,
      property: req.params.propertyId
    });

    res.json({ message: "Property removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};

// GET USER FAVORITES
export const getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate("property");

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};
