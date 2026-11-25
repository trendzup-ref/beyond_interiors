import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import loginVideo from "../../assets/videos/auth/loginVideo.mp4";
import {
  Lock,
  Mail,
  ArrowRight,
  Compass,
  AlertCircle,
  Eye,
  EyeOff,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const { login, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect according to role
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    }
  }, [loading, isAuthenticated, user, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim() || !password) {
      setFormError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password, rememberMe);
    setIsSubmitting(false);

    if (result.success) {
      const authenticatedUser = result.user;
      // Role-based redirection based strictly on the backend response
      if (authenticatedUser?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Section: Muted Video */}
      <div className="w-full lg:w-1/2 flex items-center justify-center overflow-hidden ">
        <video
          src={loginVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-[80%] h-[80vh] object-cover rounded-lg"
        />


      </div>

      {/* Right Section: Login Form */}
      <div className="w-full lg:w-1/2 min-h-[calc(100vh-300px)] lg:min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="max-w-lg w-full space-y-6 text-white relative z-10 ">

          {/* Error Alert Box */}
          {formError && (
            <div className="flex items-center text-primary text-xs sm:text-sm animate-fadeIn">
              <span>{formError}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5 pt-1" onSubmit={handleSubmit}>
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-black/60 rounded-lg text-sm text-black placeholder-stone-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] text-primary uppercase hover:text-accent transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
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
                  className="w-full pl-10 pr-11 py-2.5 border border-black/60 rounded-lg text-sm text-black placeholder-stone-500/50 focus:outline-none  transition-all"
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

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-black/50 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <span >Remember me always</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Link to Customer Registration */}
          <div className="text-center space-y-2 pt-2 border-t border-white/10">
            <p className="text-xs text-black">
              Don't have an account yet?{"  "}
              <Link
                to="/register"
                className="text-primary hover:text-primary/60 uppercase font-semibold underline underline-offset-2 transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Helper */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-sm w-full space-y-4 text-white shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-base font-serif font-bold">Password Recovery</h2>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              To reset your administrator or customer credentials, please contact the Beyond Interiors support desk directly at{" "}
              <span className="text-amber-400 font-medium">support@beyondinteriors.com</span>.
            </p>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
