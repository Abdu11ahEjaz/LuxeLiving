import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import wantedRoutes from "./routes/wantedRoutes.js";
import areaRoutes from "./routes/areaRoutes.js";
      
dotenv.config();    
   
// connectDB();
    
const PORT=process.env.PORT;

const app = express();
 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
console.log("Cloudinary config:", process.env.CLOUDINARY_CLOUD_NAME);

 
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/properties", wantedRoutes);
app.use("/api/areas", areaRoutes);
   
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
 
  