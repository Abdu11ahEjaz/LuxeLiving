import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

// These values can be changed and re-run the script
const adminEmail = "admin@luxeliving.com";
const adminPassword = "admin123";
const adminName = "Abdullah Admin";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if any admin role exists
    const existingAdmin = await User.findOne({ role: "admin" });
    
    if (existingAdmin) {
      console.log("⚠️  Admin account already exists!");
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log("\n📝 To update admin credentials:");
      console.log("   1. Edit adminEmail, adminPassword, adminName at top of seedAdmin.js");
      console.log("   2. Delete the existing admin from database");
      console.log("   3. Run: npm run seed");
      console.log("\n   Or manually update admin in database using MongoDB client");
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

      console.log("✅ Admin account created successfully!");
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log(`👤 Name: ${adminName}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();

