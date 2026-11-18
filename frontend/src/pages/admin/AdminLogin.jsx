import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim() || !password) {
      setFormError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-stone-900 to-amber-950/30 opacity-90 pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-stone-850/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-2xl border border-stone-700/60 relative z-10 text-white">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-600/20 text-amber-500 border border-amber-500/30 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
            BEYOND INTERIORS
          </h2>
          <p className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
            Admin Management Portal
          </p>
          <p className="text-xs text-stone-400 pt-1">
            Sign in with authorized administrator credentials
          </p>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="flex items-center gap-2.5 p-3.5 bg-red-950/60 border border-red-500/40 rounded-lg text-red-200 text-xs sm:text-sm animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{formError}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@beyondinteriors.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-800/90 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-stone-800/90 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-sm shadow-lg shadow-amber-900/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-stone-800 text-center">
          <p className="text-[11px] text-stone-500">
            Protected area. Unauthorized access attempts are monitored and logged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
