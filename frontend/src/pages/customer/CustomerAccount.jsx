import React, { useState } from "react";
import { Link } from "react-router";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Calendar,
  Compass,
  MapPin,
  Lock,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Save,
  ShoppingBag,
  Wrench,
  Check,
  Heart,
  Truck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useWishlist, useCart } from "../../context/CartWishlistContext.jsx";

const CustomerAccount = () => {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();
  const { cartCount, setIsCartOpen } = useCart();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'addresses' | 'security' | 'wishlist'

  // Personal Info Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Address Management State
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
    isDefault: false,
  });
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressMsg, setAddressMsg] = useState("");

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    if (!profileForm.name.trim()) {
      setProfileError("Full Name is required.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(profileForm.phone.trim())) {
      setProfileError("Please enter a valid 10-digit mobile number (e.g. 9876543210).");
      return;
    }

    setProfileLoading(true);
    const res = await updateProfile({
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
    });
    setProfileLoading(false);

    if (res.success) {
      setProfileSuccess("Profile details updated successfully!");
      setTimeout(() => setProfileSuccess(""), 4000);
    } else {
      setProfileError(res.error || "Failed to update profile.");
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("Both current and new password are required.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    const res = await changePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );
    setPasswordLoading(false);

    if (res.success) {
      setPasswordSuccess("Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(""), 4000);
    } else {
      setPasswordError(res.error || "Failed to change password.");
    }
  };

  // Handle Adding Address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pinCode) {
      alert("Please fill all mandatory address fields.");
      return;
    }

    setAddressLoading(true);
    let updatedAddresses = [...addresses];

    if (addressForm.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }

    const newAddr = { ...addressForm, _id: "addr-" + Date.now() };
    updatedAddresses.push(newAddr);

    const res = await updateProfile({ addresses: updatedAddresses });
    setAddressLoading(false);

    if (res.success) {
      setAddresses(updatedAddresses);
      setAddressModalOpen(false);
      setAddressForm({
        fullName: "",
        phone: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        pinCode: "",
        isDefault: false,
      });
      setAddressMsg("Address added successfully!");
      setTimeout(() => setAddressMsg(""), 3500);
    } else {
      alert(res.error || "Failed to add address.");
    }
  };

  // Handle Remove Address
  const handleRemoveAddress = async (addrId) => {
    if (!confirm("Are you sure you want to remove this delivery address?")) return;

    const updatedAddresses = addresses.filter((a) => a._id !== addrId);
    const res = await updateProfile({ addresses: updatedAddresses });
    if (res.success) {
      setAddresses(updatedAddresses);
      setAddressMsg("Address removed.");
      setTimeout(() => setAddressMsg(""), 3000);
    }
  };

  return (
    <div className="bg-stone-100 font-sans text-stone-900 flex flex-col flex-1">
      {/* ================= MAIN CONTAINER ================= */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 flex-1">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A73D4D] to-amber-700 text-white flex items-center justify-center font-serif font-bold text-2xl uppercase shadow-md">
              {user?.name?.charAt(0) || "C"}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif text-2xl font-bold text-stone-900">{user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                  {user?.role} Role
                </span>
              </div>
              <p className="text-xs text-stone-500 font-light">{user?.email}</p>
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Customer Account · Turnkey Installation Eligible</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start sm:self-center">
            <Link
              to="/track"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-all"
            >
              <Truck className="w-3.5 h-3.5 text-amber-700" />
              <span>Track Orders & Jobs</span>
            </Link>
            <Link
              to="/wishlist"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>Wishlist ({wishlistItems.length})</span>
            </Link>
            <Link
              to="/cart"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
              <span>Bag ({cartCount})</span>
            </Link>
            <Link
              to="/support"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all"
            >
              <span>Support</span>
            </Link>
            <Link
              to="/products"
              className="px-4 py-2 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold transition-all shadow-xs"
            >
              Catalog
            </Link>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Information</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "addresses"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-200"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Delivery Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "security"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Account Security</span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "wishlist"
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            <span>Saved Wishlist ({wishlistItems.length})</span>
          </button>
        </div>

        {/* ================= TAB 1: PERSONAL PROFILE ================= */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">Personal Information</h2>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                Update your primary contact details used for order confirmations and site surveys.
              </p>
            </div>

            {profileSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-xl">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Email Address (Registered)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs sm:text-sm text-stone-500 cursor-not-allowed"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Email address cannot be modified as it represents your primary login identity.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Mobile Number (10 Digits)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold tracking-wide shadow-md transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{profileLoading ? "Saving Changes..." : "Save Profile Details"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 2: DELIVERY ADDRESSES ================= */}
        {activeTab === "addresses" && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">Saved Delivery Addresses</h2>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Manage shipping addresses for physical deliveries, site visits, and installation appointments.
                </p>
              </div>

              <button
                onClick={() => setAddressModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all shadow-xs self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {addressMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{addressMsg}</span>
              </div>
            )}

            {addresses.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
                <MapPin className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-serif text-base font-bold text-stone-700">No saved addresses yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Add your home or office address to expedite checkout and scheduled site visits.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="p-5 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col justify-between space-y-3 hover:border-stone-400 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-stone-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {addr.street}
                        {addr.landmark ? `, Near ${addr.landmark}` : ""}
                      </p>
                      <p className="text-xs text-stone-600 font-medium">
                        {addr.city}, {addr.state} — {addr.pinCode}
                      </p>
                      <p className="text-xs text-stone-500 pt-1 font-mono">Phone: {addr.phone}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between">
                      <span className="text-[11px] text-stone-400">Doorstep Delivery</span>
                      <button
                        onClick={() => handleRemoveAddress(addr._id)}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: ACCOUNT SECURITY ================= */}
        {activeTab === "security" && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">Change Account Password</h2>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                Ensure your account uses a strong password of at least 6 characters.
              </p>
            </div>

            {passwordSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                    placeholder="Enter current password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  New Password (Min 6 Characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
                    placeholder="Re-type new password"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold tracking-wide shadow-md transition-all disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{passwordLoading ? "Updating Password..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 4: SAVED WISHLIST ================= */}
        {activeTab === "wishlist" && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">Your Saved Wishlist</h2>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Architectural furniture and décor pieces saved to your personal lookbook.
                </p>
              </div>
              <Link
                to="/wishlist"
                className="text-xs font-semibold text-[#A73D4D] hover:underline"
              >
                View Full Page
              </Link>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                  <Heart className="w-7 h-7" />
                </div>
                <p className="font-serif text-base font-bold text-stone-800">Your wishlist is empty</p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Browse our curated interior collections and click the heart icon on any product to save it.
                </p>
                <Link
                  to="/products"
                  className="inline-block mt-2 px-6 py-2.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="p-4 rounded-2xl border border-stone-200 flex flex-col justify-between hover:border-stone-300 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="w-full aspect-square rounded-xl bg-stone-100 overflow-hidden p-2 flex items-center justify-center">
                        <img
                          src={item.images?.[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80"}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-amber-700 font-semibold block">
                          {item.category?.name || item.category || "FURNITURE"}
                        </span>
                        <Link
                          to={`/products/${item._id || item.id}`}
                          className="font-serif font-bold text-sm text-stone-900 hover:text-[#A73D4D] line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <span className="font-serif font-bold text-stone-950 text-sm block mt-1">
                          ₹{(item.basePrice || item.variants?.[0]?.price || 35000).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => removeFromWishlist(item._id || item.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 text-xs"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveToCart(item)}
                        className="px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= ADD ADDRESS MODAL ================= */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-900">Add New Delivery Address</h3>
              <button
                onClick={() => setAddressModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-amber-600"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-600 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-amber-600"
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-600 mb-1">Street Address / House No. *</label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-amber-600"
                  placeholder="Flat 402, Royale Towers, MG Road"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-600 mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  value={addressForm.landmark}
                  onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-amber-600"
                  placeholder="Opposite City Mall"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-600 mb-1">City *</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-amber-600"
                    placeholder="Mumbai"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-600 mb-1">State *</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-amber-600"
                    placeholder="Maharashtra"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-600 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    value={addressForm.pinCode}
                    onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-amber-600"
                    placeholder="400001"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="defaultCheck"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="defaultCheck" className="text-xs text-stone-600 font-medium">
                  Set as default shipping address
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-stone-300 text-stone-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressLoading}
                  className="px-5 py-2 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold shadow-xs"
                >
                  {addressLoading ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAccount;
