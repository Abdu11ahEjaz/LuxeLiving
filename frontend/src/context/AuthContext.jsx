import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      // Add profile image to user data - use user-specific key
      if (parsedUser.id) {
        const profileImage = localStorage.getItem(`profileImage_${parsedUser.id}`);
        if (profileImage) {
          parsedUser.profileImage = profileImage;
        }
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    // Get user-specific profile image
    const profileImage = localStorage.getItem(`profileImage_${userData.id}`);
    const userWithImage = profileImage ? { ...userData, profileImage } : userData;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userWithImage));
    setUser(userWithImage);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

