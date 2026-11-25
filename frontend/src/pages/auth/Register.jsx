import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Compass,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      setFormError("All fields are required.");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    // Phone validation (Indian 10-digit standard starting with 6-9 as per user model)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setFormError("Please enter a valid 10-digit mobile number (e.g. 9876543210).");
      return;
    }

    setIsSubmitting(true);
    const result = await register(
      formData.name.trim(),
      formData.email.trim(),
      formData.password,
      formData.phone.trim()
    );
    setIsSubmitting(false);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden py-10">
      <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-stone-900 to-amber-950/40 opacity-90 pointer-events-none" />

      <div className="max-w-md w-full space-y-6 bg-stone-850/90 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-2xl border border-stone-750 relative z-10 text-white">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-600/20 text-amber-500 border border-amber-500/30 mb-1">
            <Compass className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
            BEYOND INTERIORS
          </h1>
          <p className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
            Customer Registration
          </p>
          <p className="text-xs text-stone-400">
            Create an account to book bespoke installations & order luxury interior products
          </p>
        </div>

        {/* Error Alert Box */}
        {formError && (
          <div className="flex items-center gap-2.5 p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-200 text-xs sm:text-sm animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{formError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form className="space-y-4 pt-1" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <UserIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full pl-10 pr-4 py-2 bg-stone-800/90 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="w-full pl-10 pr-4 py-2 bg-stone-800/90 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Mobile Phone */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1 uppercase tracking-wider">
              Mobile Phone (10 digits)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Phone className="h-4 w-4" />
              </div>
              <input
                type="tel"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full pl-10 pr-4 py-2 bg-stone-800/90 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1 uppercase tracking-wider">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2 bg-stone-800/90 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2 bg-stone-800/90 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-sm shadow-lg shadow-amber-900/30 transition-all duration-200 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating customer account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link back to unified Login */}
        <div className="pt-4 border-t border-stone-800 text-center space-y-2">
          <p className="text-xs text-stone-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 transition-colors"
            >
              Sign In
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Role automatically assigned as verified Customer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
