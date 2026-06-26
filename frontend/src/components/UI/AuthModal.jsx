import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api/auth";

export const AuthModal = ({ isOpen, onClose, initialMode = "signin" }) => {
  const [mode, setMode] = useState(initialMode); // "signin" or "signup"
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl">
        {mode === "signin" ? (
          <SignInForm 
            onClose={onClose} 
            onSwitchToSignup={() => setMode("signup")}
          />
        ) : (
          <SignUpForm 
            onClose={onClose}
            onSwitchToSignin={() => setMode("signin")}
          />
        )}
      </div>
    </div>
  );
};

// Sign In Form Component
const SignInForm = ({ onClose, onSwitchToSignup }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(""); // Can be phone or email
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Determine if input is email or phone
      const isEmail = identifier.includes("@");
      const loginData = isEmail 
        ? { email: identifier }
        : { phone: "+92" + identifier };
      
      const res = await axios.post(`${API_BASE_URL}/login`, {
        ...loginData,
        password,
      });
      console.log("Login success:", res.data);
      
      // Store user data using AuthContext
      login(res.data.token, res.data.user);
      
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  return (
    <div className="p-5">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition text-sm"
      >
        ✕
      </button>

      <h1 className="text-xl font-bold text-gray-900 mb-1">Sign in to your account</h1>
      <p className="text-gray-500 mb-4">Welcome back!</p>

      {error && (
        <div className="mb-3 p-2 rounded-lg bg-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-3">
        {/* Email or Phone Number */}
        <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-red-500">
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-3 py-2.5 bg-transparent text-gray-900 placeholder:text-gray-400 outline-none rounded-lg text-sm"
            required
          />
        </div>

        {/* Password */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-500">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 px-3 py-2.5 bg-transparent text-gray-900 placeholder:text-gray-400 outline-none text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-3 text-xs font-medium text-red-500 hover:text-red-600 transition"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-bold uppercase tracking-wider text-xs hover:from-red-600 hover:to-red-700 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>
      </form>

      {/* Forgot Password */}
      <div className="text-center mt-3">
        <button className="text-xs font-medium text-red-500 hover:text-red-600 transition">
          Forgot Password?
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Social Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => handleSocialLogin("facebook")}
          className="w-full flex items-center rounded-lg py-2 px-3 bg-blue-600 text-white font-semibold text-xs hover:opacity-90 transition"
        >
          <span className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-md mr-2 text-sm">f</span>
          <span className="flex-1 text-center">Continue with Facebook</span>
        </button>

        <button
          onClick={() => handleSocialLogin("google")}
          className="w-full flex items-center rounded-lg py-2 px-3 border border-gray-300 bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50 transition"
        >
          <span className="w-6 h-6 flex items-center justify-center mr-2">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </span>
          <span className="flex-1 text-center">Continue with Google</span>
        </button>
      </div>

      {/* Register Link */}
      <div className="text-center mt-4">
        <button
          onClick={onSwitchToSignup}
          className="text-xs text-red-500 hover:text-red-600 font-medium underline transition"
        >
          Don't have an account? Register Now
        </button>
      </div>
    </div>
  );
};

// Sign Up Form Component
const SignUpForm = ({ onClose, onSwitchToSignin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+92");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!email && !phone) {
      setError("Please provide either email or phone number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/register`, {
        name,
        email: email || undefined,
        phone: phone ? phoneCode + phone : undefined,
        password,
      });
      console.log("Register success:", res.data);
      setShowSuccess(true);
      // Auto-switch to signin after 2 seconds to show success message
      setTimeout(() => {
        setShowSuccess(false);
        onSwitchToSignin();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  // Show success message overlay
  if (showSuccess) {
    return (
      <div className="p-5 min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h2>
        <p className="text-gray-500 mb-4">Your account has been created successfully.</p>
        <p className="text-sm text-gray-400">Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition text-sm"
      >
        ✕
      </button>

      <h1 className="text-xl font-bold text-gray-900 mb-1">Create an account</h1>
      <p className="text-gray-500 mb-4">Experience the full power of LuxeLiving</p>

      {error && (
        <div className="mb-3 p-2 rounded-lg bg-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-3">
        {/* Name */}
        <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-red-500">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 bg-transparent text-gray-900 placeholder:text-gray-400 outline-none rounded-lg text-sm"
            required
          />
        </div>

        {/* Email (Optional) */}
        <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-red-500">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 bg-transparent text-gray-900 placeholder:text-gray-400 outline-none rounded-lg text-sm"
          />
        </div>

        {/* Phone Number */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-500">
          <div className="flex items-center gap-1 px-2 bg-gray-50 border-r border-gray-300 shrink-0">
            <span className="text-base">🇵🇰</span>
            <span className="text-xs text-gray-500">▾</span>
            <span className="text-xs font-medium text-gray-700">{phoneCode}</span>
          </div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 px-3 py-2.5 bg-transparent text-gray-900 placeholder:text-gray-400 outline-none text-sm"
            required
          />
        </div>

        {/* Password */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-500">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 px-3 py-2.5 bg-transparent text-gray-900 placeholder:text-gray-400 outline-none text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-3 text-xs font-medium text-red-500 hover:text-red-600 transition"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-500">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="flex-1 px-3 py-2.5 bg-transparent text-gray-900 placeholder:text-gray-400 outline-none text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="px-3 text-xs font-medium text-red-500 hover:text-red-600 transition"
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-bold uppercase tracking-wider text-xs hover:from-red-600 hover:to-red-700 transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "CREATE ACCOUNT"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Social Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => handleSocialLogin("facebook")}
          className="w-full flex items-center rounded-lg py-2 px-3 bg-blue-600 text-white font-semibold text-xs hover:opacity-90 transition"
        >
          <span className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-md mr-2 text-sm">f</span>
          <span className="flex-1 text-center">Continue with Facebook</span>
        </button>

        <button
          onClick={() => handleSocialLogin("google")}
          className="w-full flex items-center rounded-lg py-2 px-3 border border-gray-300 bg-white text-gray-700 font-semibold text-xs hover:bg-gray-50 transition"
        >
          <span className="w-6 h-6 flex items-center justify-center mr-2">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </span>
          <span className="flex-1 text-center">Continue with Google</span>
        </button>
      </div>

      {/* Login Link */}
      <div className="text-center mt-4">
        <button
          onClick={onSwitchToSignin}
          className="text-xs text-red-500 hover:text-red-600 font-medium underline transition"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
};

export default AuthModal;

