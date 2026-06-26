import express from "express";
import { register, login, updateProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/profile", protect, updateProfile);

// Seed admin account (run once)
router.post("/seed-admin", async (req, res) => {
  try {
    const adminEmail = "admin@estateedge.com";
    const adminPassword = "admin123";
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      return res.json({ message: "Admin already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await User.create({
      name: "Admin",
      email: adminEmail,
      phone: "+923000000000",
      password: hashedPassword,
      role: "admin"
    });
    
    res.json({ 
      message: "Admin created successfully",
      email: adminEmail,
      password: adminPassword
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
