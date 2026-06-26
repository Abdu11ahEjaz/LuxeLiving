import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI ;

const adminEmail = "admin@estateedge.com";
const adminPassword = "admin123";
const adminName = "Admin";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log("Admin account already exists!");
      console.log(`Email: ${adminEmail}`);
      console.log("Password: admin123");
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const admin = await User.create({
        name: adminName,
        email: adminEmail,
        phone: "+923000000000",
        password: hashedPassword,
        role: "admin"
      });

      console.log("Admin account created successfully!");
      console.log(`Email: ${adminEmail}`);
      console.log("Password: admin123");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();

