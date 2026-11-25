import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import registerVideo from "../../assets/videos/auth/register.mp4";
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const { register, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect strictly according to role
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [loading, isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const { name, email, phone, password, confirmPassword } = formData;

    // Validation per User model schema
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setFormError("All fields are required.");
      return;
    }

    if (name.trim().length < 3 || name.trim().length > 50) {
      setFormError("Full Name must be between 3 and 50 characters.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }

    // Phone validation matching User model (/^[6-9]\d{9}$/)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      setFormError("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const result = await register(
      name.trim(),
      email.trim(),
      password,
      phone.trim()
    );
    setIsSubmitting(false);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Section: Video (matching Login.jsx UI) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center overflow-hidden">
        <video
          src={registerVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-[80%] h-[80vh] object-cover rounded-lg"
        />
      </div>

      {/* Right Section: Registration Form (matching Login.jsx UI) */}
      <div className="w-full lg:w-1/2 min-h-[calc(100vh-300px)] lg:min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="max-w-lg w-full space-y-5 text-black relative z-10">
          {/* Header Title */}
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Create an Account
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Join Beyond Interiors for curated luxury furnishings & white-glove services.
            </p>
          </div>

          {/* Error Alert Box */}
          {formError && (
            <div className="flex items-center gap-1.5 text-primary text-xs sm:text-sm animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Registration Form */}
          <form className="space-y-4 pt-1" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-widest">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Aditya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 border border-black/60 rounded-lg text-sm text-black placeholder-stone-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-black/60 rounded-lg text-sm text-black placeholder-stone-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-widest">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-2.5 border border-black/60 rounded-lg text-sm text-black placeholder-stone-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 border border-black/60 rounded-lg text-sm text-black placeholder-stone-500/50 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-widest">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 border border-black/60 rounded-lg text-sm text-black placeholder-stone-500/50 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <div className="text-center space-y-2 pt-2 border-t border-black/10">
            <p className="text-xs text-black">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/60 uppercase font-semibold underline underline-offset-2 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
