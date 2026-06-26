import User from "../models/User.js";
import Property from "../models/Property.js";

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// DELETE USER (also deletes their properties)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all properties owned by this user
    await Property.deleteMany({ owner: id });

    // Delete the user
    await User.findByIdAndDelete(id);

    res.json({ message: "User and their properties deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

