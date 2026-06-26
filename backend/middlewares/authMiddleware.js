import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  // Check for token presence
  if (!token || !token.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    // Extract token from header
    token = token.split(" ")[1];

    // Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database
    const user = await User.findById(decoded.id).select("_id name email role");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request object for downstream handlers
    req.user = user;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please log in again" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
