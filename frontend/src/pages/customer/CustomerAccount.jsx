import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  LogOut,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Lock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Save,
  ShoppingBag,
  Wrench,
  Check,
  Heart,
  Truck,
  Star,
  Bell,
  Clock,
  Sparkles,
  ExternalLink,
  Info,
  ChevronRight,
  ChevronDown,
  Filter,
  Eye,
  EyeOff,
  Package,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";
import { orderService, ORDER_LIFECYCLE_STAGES, OFFLINE_PAYMENT_METHODS } from "../../services/orderService.js";
import { installationService, INSTALLATION_LIFECYCLE_STAGES } from "../../services/installationService.js";
import { reviewService } from "../../services/reviewService.js";
import { profileService } from "../../services/profileService.js";

const CustomerAccount = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout, updateProfile } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Active section tab: 'profile' | 'edit' | 'orders' | 'installations' | 'reviews' | 'notifications'
  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab with URL
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    searchParams.set("tab", tabName);
    setSearchParams(searchParams);
  };

  // ================= 1. PROFILE & ADDRESS DATA =================
  const [profileData, setProfileData] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
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
  const [addressMsg, setAddressMsg] = useState("");

  const loadProfileInfo = async () => {
    const data = await profileService.getProfile(user);
    setProfileData(data);
  };

  useEffect(() => {
    loadProfileInfo();
  }, [user]);

  // ================= 2. EDIT DETAILS & PASSWORD STATE =================
  const [editDetailsForm, setEditDetailsForm] = useState({
    name: user?.name || "Aditya Sharma",
    phone: user?.phone || "9876543210",
  });
  const [editDetailsLoading, setEditDetailsLoading] = useState(false);
  const [editDetailsSuccess, setEditDetailsSuccess] = useState("");
  const [editDetailsError, setEditDetailsError] = useState("");

  useEffect(() => {
    if (user) {
      setEditDetailsForm({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setEditDetailsSuccess("");
    setEditDetailsError("");

    if (!editDetailsForm.name.trim() || editDetailsForm.name.trim().length < 3) {
      setEditDetailsError("Full Name must contain at least 3 characters.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(editDetailsForm.phone.trim())) {
      setEditDetailsError("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    setEditDetailsLoading(true);
    try {
      // 1. Update in AuthContext
      await updateProfile({
        name: editDetailsForm.name.trim(),
        phone: editDetailsForm.phone.trim(),
      });
      // 2. Update in profileService
      await profileService.updateDetails({
        name: editDetailsForm.name.trim(),
        phone: editDetailsForm.phone.trim(),
      });
      await loadProfileInfo();
      setEditDetailsSuccess("Personal details updated successfully across BEYOND INTERIORS.");
      setTimeout(() => setEditDetailsSuccess(""), 4000);
    } catch (err) {
      setEditDetailsError(err.message || "Failed to update profile details.");
    } finally {
      setEditDetailsLoading(false);
    }
  };

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user?.name || "",
      phone: user?.phone || "",
      street: "",
      landmark: "",
      city: "Gurugram",
      state: "Haryana",
      pinCode: "122002",
      isDefault: false,
    });
    setAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      landmark: addr.landmark || "",
      city: addr.city,
      state: addr.state,
      pinCode: addr.pinCode,
      isDefault: Boolean(addr.isDefault),
    });
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.street || !addressForm.pinCode) {
      alert("Please fill in all required address fields.");
      return;
    }

    if (editingAddressId) {
      await profileService.updateAddress(editingAddressId, addressForm);
      setAddressMsg("Address updated successfully.");
    } else {
      await profileService.addAddress(addressForm);
      setAddressMsg("New delivery address saved.");
    }

    await loadProfileInfo();
    setAddressModalOpen(false);
    setTimeout(() => setAddressMsg(""), 3500);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm("Remove this delivery address from your profile?")) {
      await profileService.deleteAddress(id);
      await loadProfileInfo();
      setAddressMsg("Address removed.");
      setTimeout(() => setAddressMsg(""), 3000);
    }
  };

  const handleSetDefaultAddress = async (id) => {
    await profileService.setDefaultAddress(id);
    await loadProfileInfo();
    setAddressMsg("Default delivery address updated.");
    setTimeout(() => setAddressMsg(""), 3000);
  };

  // ================= 3. ORDERS STATE =================
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("all"); // 'all' | 'active' | 'completed'
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const loadOrders = async () => {
    const list = await orderService.getOrders();
    setOrders(list);

    // If URL has order ID, open details
    const orderIdParam = searchParams.get("id");
    if (orderIdParam) {
      const target = list.find(
        (o) => o._id === orderIdParam || o.orderNumber.toUpperCase() === orderIdParam.toUpperCase()
      );
      if (target) setSelectedOrderDetails(target);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "active") return o.orderStatus !== "delivered" && o.orderStatus !== "cancelled";
    if (orderFilter === "completed") return o.orderStatus === "delivered";
    return true;
  });

  // ================= 4. INSTALLATIONS STATE =================
  const [installations, setInstallations] = useState([]);
  const [installationFilter, setInstallationFilter] = useState("all"); // 'all' | 'active' | 'completed'
  const [selectedInstallationDetails, setSelectedInstallationDetails] = useState(null);

  const loadInstallations = async () => {
    const list = await installationService.getInstallations();
    setInstallations(list);

    // If URL has installation booking query
    const insIdParam = searchParams.get("id");
    if (insIdParam && searchParams.get("tab") === "installations") {
      const target = list.find(
        (ins) => ins._id === insIdParam || ins.bookingNumber.toUpperCase() === insIdParam.toUpperCase()
      );
      if (target) setSelectedInstallationDetails(target);
    }
  };

  useEffect(() => {
    loadInstallations();
  }, []);

  const filteredInstallations = installations.filter((ins) => {
    if (installationFilter === "active") return ins.status !== "completed" && ins.status !== "cancelled";
    if (installationFilter === "completed") return ins.status === "completed";
    return true;
  });

  // ================= 5. REVIEWS STATE =================
  const [myReviews, setMyReviews] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null); // { product, order, installation }
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

  const loadReviews = async () => {
    const list = await reviewService.getReviews();
    setMyReviews(list);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Delivered items eligible for review
  const deliveredItemsToReview = orders
    .filter((o) => o.orderStatus === "delivered")
    .flatMap((o) =>
      o.items.map((item) => ({
        ...item,
        orderNumber: o.orderNumber,
        deliveredAt: o.deliveredAt || o.createdAt,
      }))
    )
    .filter(
      (item) =>
        !myReviews.some(
          (r) =>
            r.order === item.orderNumber &&
            (r.product?._id === item.product || r.product?.name === item.name)
        )
    );

  const handleOpenReviewModal = (item) => {
    setReviewTarget(item);
    setReviewRating(5);
    setReviewTitle("");
    setReviewComment("");
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      alert("Please provide a review headline and comment.");
      return;
    }

    setReviewSubmitting(true);
    try {
      await reviewService.submitReview({
        product: {
          _id: reviewTarget.product || reviewTarget.productId,
          name: reviewTarget.name,
          image: reviewTarget.image,
        },
        order: reviewTarget.orderNumber,
        customer: {
          name: user?.name || "Verified Customer",
          email: user?.email || "customer@beyondinteriors.in",
        },
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        reviewType: reviewTarget.includeInstallation ? "product_and_installation" : "product",
      });

      await loadReviews();
      setReviewModalOpen(false);
      setReviewSuccessMsg("Your verified review and architectural rating have been published!");
      setTimeout(() => setReviewSuccessMsg(""), 4000);
    } catch (err) {
      alert(err.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  // ================= 6. LOGOUT =================
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out of your Beyond Interiors account?")) {
      await logout();
      navigate("/");
    }
  };

  const displayUser = profileData || user;

  return (
    <div className="bg-[#FAF8F5] text-stone-900 font-sans min-h-screen flex flex-col flex-1">
      {/* Outer master container max-w-[1520px] */}
      <main className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-stone-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">My Account & Orders</span>
        </nav>

        {/* Global Toast Message */}
        {addressMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{addressMsg}</span>
          </div>
        )}

        {/* Dashboard Grid Layout (Sidebar + Main Content Area) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= SIDEBAR NAVIGATION (Col 4) ================= */}
          <aside className="lg:col-span-4  sticky top-32 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6">
            {/* User Profile Summary Card */}
            <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#A73D4D] to-[#8E3341] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0 shadow-xs">
                {displayUser?.name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0 flex-1">

                <h2 className="font-serif text-lg font-bold text-stone-900 truncate">
                  {displayUser?.name || "Client"}
                </h2>
                <p className="text-xs text-stone-500 truncate">{displayUser?.email}</p>
              </div>
            </div>

            {/* Navigation Menu Links (WoodenStreet functionality with Beyond Interiors Luxury UI) */}
            <nav className="space-y-1">
              {[
                { id: "profile", label: "My Profile", icon: User },
                { id: "edit", label: "Edit Personal Details", icon: Edit2 },
                {
                  id: "orders",
                  label: "Track Orders",
                  icon: Package,
                  badge: orders.filter((o) => o.orderStatus !== "delivered").length || null,
                },
                {
                  id: "installations",
                  label: "Track Installations",
                  icon: Wrench,
                  badge: installations.filter((i) => i.status !== "completed").length || null,
                },
                { id: "reviews", label: "My Reviews & Ratings", icon: Star },
                {
                  id: "notifications",
                  label: "Notifications",
                  icon: Bell,
                  badge: unreadCount > 0 ? unreadCount : null,
                  badgeColor: "bg-[#A73D4D] text-white",
                },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => switchTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${isActive
                      ? "bg-stone-900 text-white shadow-xs"
                      : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#D4C26B]" : "text-stone-400"}`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${item.badgeColor || "bg-amber-100 text-amber-800"
                            }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-stone-400" : "text-stone-300"}`} />
                    </div>
                  </button>
                );
              })}

              {/* Logout Option */}
              <div className="pt-4 border-t border-stone-100 mt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* ================= MAIN CONTENT AREA (Col 8) ================= */}
          <section className="lg:col-span-8 space-y-8">
            {/* ---------------- 1. MY PROFILE SECTION ---------------- */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-stone-900">
                        My Profile
                      </h3>
                    </div>

                    <button
                      onClick={() => switchTab("edit")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-300 hover:border-stone-900 text-xs font-semibold text-stone-800 transition-colors cursor-pointer w-fit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Personal Info</span>
                    </button>
                  </div>

                  {/* Profile Key-Value Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                      <span className="text-stone-400 uppercase tracking-wider block text-[10px] mb-1">
                        Full Name
                      </span>
                      <span className="font-serif font-bold text-base text-stone-900">
                        {displayUser?.name}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                      <span className="text-stone-400 uppercase tracking-wider block text-[10px] mb-1">
                        Registered Email
                      </span>
                      <span className="font-medium text-stone-900 break-all">
                        {displayUser?.email}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                      <span className="text-stone-400 uppercase tracking-wider block text-[10px] mb-1">
                        Mobile Number
                      </span>
                      <span className="font-medium text-stone-900 font-mono">
                        +91 {displayUser?.phone || "9876543210"}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                      <span className="text-stone-400 uppercase tracking-wider block text-[10px] mb-1">
                        Member Since
                      </span>
                      <span className="font-medium text-stone-900">
                        {displayUser?.createdAt
                          ? new Date(displayUser.createdAt).toLocaleDateString("en-IN", {
                            month: "long",
                            year: "numeric",
                          })
                          : "March 2024"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Saved Delivery Addresses */}
                <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-xl font-bold text-stone-900">
                        Saved Delivery Addresses
                      </h4>
                    </div>

                    <button
                      onClick={handleOpenAddAddress}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Address</span>
                    </button>
                  </div>

                  {displayUser?.addresses?.length === 0 ? (
                    <div className="text-center py-10 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                      <MapPin className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <p className="text-xs text-stone-500">No saved addresses yet.</p>
                      <button
                        onClick={handleOpenAddAddress}
                        className="mt-3 text-xs text-[#A73D4D] font-bold hover:underline"
                      >
                        + Add your primary site address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {displayUser?.addresses?.map((addr) => (
                        <div
                          key={addr._id}
                          className={`p-5 rounded-2xl border text-xs relative flex flex-col justify-between transition-all ${addr.isDefault
                            ? "border-stone-900 bg-stone-50/60 ring-1 ring-stone-900/10"
                            : "border-stone-200 bg-white hover:border-stone-300"
                            }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-serif font-bold text-stone-900 text-sm">
                                {addr.fullName}
                              </span>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 rounded-full bg-stone-900 text-white text-[9px] font-bold uppercase tracking-wider">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-stone-600 leading-relaxed">
                              {addr.street}
                              {addr.landmark ? `, ${addr.landmark}` : ""},<br />
                              {addr.city}, {addr.state} —{" "}
                              <strong className="font-mono text-stone-900">{addr.pinCode}</strong>
                            </p>
                            <p className="text-stone-500 font-mono mt-2 text-[11px]">
                              Phone: {addr.phone}
                            </p>
                          </div>

                          <div className="pt-4 mt-4 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleOpenEditAddress(addr)}
                                className="font-semibold text-stone-700 hover:text-stone-900 cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(addr._id)}
                                className="font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>

                            {!addr.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(addr._id)}
                                className="font-bold text-[#A73D4D] hover:underline cursor-pointer"
                              >
                                Set as Default
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------------- 2. EDIT PERSONAL DETAILS SECTION ---------------- */}
            {activeTab === "edit" && (
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
                <div className="pb-4 border-b border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#A73D4D] block mb-1">
                    Account Settings
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    Edit Personal Details
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Update your client name and contact mobile number. Changes are reflected across your orders and deliveries.
                  </p>
                </div>

                {editDetailsSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{editDetailsSuccess}</span>
                  </div>
                )}

                {editDetailsError && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{editDetailsError}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateDetails} className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={editDetailsForm.name}
                      onChange={(e) =>
                        setEditDetailsForm({ ...editDetailsForm, name: e.target.value })
                      }
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                      Email Address (Locked)
                    </label>
                    <input
                      type="email"
                      value={displayUser?.email || ""}
                      disabled
                      className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-500 cursor-not-allowed font-mono"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      To modify your account email, please contact our studio concierge desk.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                      Mobile Number (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={editDetailsForm.phone}
                      onChange={(e) =>
                        setEditDetailsForm({
                          ...editDetailsForm,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      required
                      placeholder="9876543210"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-mono"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={editDetailsLoading}
                      className="px-8 py-3.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
                    >
                      {editDetailsLoading ? "Saving Changes..." : "Save Personal Details"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ---------------- 3. TRACK ORDERS SECTION ---------------- */}
            {activeTab === "orders" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#A73D4D] block mb-1">
                        Fulfillment & Logistics
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-stone-900">
                        Track Orders
                      </h3>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
                      {[
                        { id: "all", label: "All Orders" },
                        { id: "active", label: "In Transit / Active" },
                        { id: "completed", label: "Delivered" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setOrderFilter(tab.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${orderFilter === tab.id
                            ? "bg-white text-stone-900 shadow-xs"
                            : "text-stone-500 hover:text-stone-900"
                            }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                      <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                      <p className="text-sm font-serif font-bold text-stone-800">No orders found in this category.</p>
                      <Link
                        to="/products"
                        className="mt-3 inline-block text-xs font-bold text-[#A73D4D] hover:underline"
                      >
                        Explore the luxury interior catalog →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredOrders.map((order) => {
                        const currentStageIndex = ORDER_LIFECYCLE_STAGES.findIndex(
                          (s) => s.key === order.orderStatus
                        );

                        return (
                          <div
                            key={order._id}
                            className="bg-stone-50/60 rounded-3xl border border-stone-200 p-5 sm:p-7 space-y-6 hover:border-stone-300 transition-all"
                          >
                            {/* Order Header Meta */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/60 text-xs">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-base text-stone-900">
                                    {order.orderNumber}
                                  </span>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.orderStatus === "delivered"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-amber-100 text-amber-800"
                                      }`}
                                  >
                                    {order.orderStatus.replace(/_/g, " ")}
                                  </span>
                                </div>
                                <span className="text-stone-500 text-[11px] mt-0.5 block">
                                  Placed on{" "}
                                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="font-mono text-[10px] px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700">
                                  Offline Payment: <strong>{order.offlinePayment?.status || "Pending"}</strong>
                                </span>
                                <button
                                  onClick={() => setSelectedOrderDetails(order)}
                                  className="px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>

                            {/* 6-Stage Visual Progress Tracker */}
                            <div className="py-2">
                              <div className="relative flex items-center justify-between">
                                {/* Connecting Background Line */}
                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-stone-200 z-0" />
                                {/* Active Filled Line */}
                                <div
                                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#A73D4D] z-0 transition-all duration-500"
                                  style={{
                                    width: `${currentStageIndex >= 0
                                      ? (currentStageIndex / (ORDER_LIFECYCLE_STAGES.length - 1)) * 100
                                      : 0
                                      }%`,
                                  }}
                                />

                                {ORDER_LIFECYCLE_STAGES.map((stage, idx) => {
                                  const isPassed = idx <= currentStageIndex;
                                  const isCurrent = idx === currentStageIndex;

                                  return (
                                    <div
                                      key={stage.key}
                                      className="relative z-10 flex flex-col items-center group cursor-default"
                                    >
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${isPassed
                                          ? "bg-[#A73D4D] border-[#A73D4D] text-white"
                                          : "bg-white border-stone-300 text-stone-400"
                                          } ${isCurrent ? "ring-4 ring-[#A73D4D]/20 scale-110" : ""}`}
                                      >
                                        {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                                      </div>
                                      <span
                                        className={`text-[10px] font-medium mt-1.5 text-center hidden md:block max-w-[75px] leading-tight ${isCurrent
                                          ? "text-[#A73D4D] font-bold"
                                          : isPassed
                                            ? "text-stone-900"
                                            : "text-stone-400"
                                          }`}
                                      >
                                        {stage.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Product Items List */}
                            <div className="space-y-3 pt-2">
                              {order.items.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white border border-stone-200/80"
                                >
                                  <div className="flex items-center gap-3.5">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-14 h-14 rounded-xl object-contain bg-stone-50 border border-stone-100 p-1 shrink-0"
                                    />
                                    <div>
                                      <h5 className="font-serif font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                                        {item.name}
                                      </h5>
                                      <span className="text-[11px] text-stone-500">
                                        Qty: {item.quantity} · ₹{item.price.toLocaleString("en-IN")} each
                                      </span>
                                      {item.includeInstallation && (
                                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 ml-2">
                                          <Wrench className="w-3 h-3 text-amber-700" />
                                          White-Glove Installation Included
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="text-right shrink-0">
                                    <span className="font-serif font-bold text-sm text-stone-900 block">
                                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                    </span>
                                    {order.orderStatus === "delivered" && (
                                      <button
                                        onClick={() =>
                                          handleOpenReviewModal({
                                            ...item,
                                            orderNumber: order.orderNumber,
                                          })
                                        }
                                        className="text-[11px] font-bold text-[#A73D4D] hover:underline mt-1 block"
                                      >
                                        Write Review ★
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Order Total & Footer */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-200/60 text-xs text-stone-600">
                              <span>
                                Expected Delivery:{" "}
                                <strong className="text-stone-900">{order.expectedDeliveryDate}</strong>
                              </span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-stone-400">Total Order Value:</span>
                                <span className="font-serif font-bold text-lg text-stone-950">
                                  ₹{order.totalAmount.toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------------- 4. TRACK INSTALLATIONS SECTION ---------------- */}
            {activeTab === "installations" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#A73D4D] block mb-1">
                        Turnkey Assembly Services
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-stone-900">
                        Track Installations
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        All standalone bookings and turnkey product installations linked with your interior orders.
                      </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
                      {[
                        { id: "all", label: "All Bookings" },
                        { id: "active", label: "Scheduled / Active" },
                        { id: "completed", label: "Completed" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setInstallationFilter(tab.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${installationFilter === tab.id
                            ? "bg-white text-stone-900 shadow-xs"
                            : "text-stone-500 hover:text-stone-900"
                            }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredInstallations.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                      <Wrench className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                      <p className="text-sm font-serif font-bold text-stone-800">
                        No active installation bookings found.
                      </p>
                      <Link
                        to="/services"
                        className="mt-3 inline-block text-xs font-bold text-[#A73D4D] hover:underline"
                      >
                        Book a turnkey installation service →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredInstallations.map((ins) => {
                        const currentStageIndex = INSTALLATION_LIFECYCLE_STAGES.findIndex(
                          (s) => s.key === ins.status
                        );

                        return (
                          <div
                            key={ins._id}
                            className="bg-stone-50/60 rounded-3xl border border-stone-200 p-5 sm:p-7 space-y-6 hover:border-stone-300 transition-all"
                          >
                            {/* Installation Header Meta */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/60 text-xs">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-base text-stone-900">
                                    {ins.bookingNumber}
                                  </span>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ins.status === "completed"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-amber-100 text-amber-800"
                                      }`}
                                  >
                                    {ins.status.replace(/_/g, " ")}
                                  </span>
                                </div>
                                {ins.order && (
                                  <span className="text-stone-500 text-[11px] mt-0.5 block">
                                    Linked to Order:{" "}
                                    <strong className="text-stone-800 font-mono">{ins.order}</strong>
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => setSelectedInstallationDetails(ins)}
                                className="px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold transition-colors cursor-pointer w-fit"
                              >
                                View Timeline
                              </button>
                            </div>

                            {/* 6-Stage Installation Visual Progress Tracker */}
                            <div className="py-2">
                              <div className="relative flex items-center justify-between">
                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-stone-200 z-0" />
                                <div
                                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-700 z-0 transition-all duration-500"
                                  style={{
                                    width: `${currentStageIndex >= 0
                                      ? (currentStageIndex / (INSTALLATION_LIFECYCLE_STAGES.length - 1)) * 100
                                      : 0
                                      }%`,
                                  }}
                                />

                                {INSTALLATION_LIFECYCLE_STAGES.map((stage, idx) => {
                                  const isPassed = idx <= currentStageIndex;
                                  const isCurrent = idx === currentStageIndex;

                                  return (
                                    <div
                                      key={stage.key}
                                      className="relative z-10 flex flex-col items-center group cursor-default"
                                    >
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${isPassed
                                          ? "bg-amber-700 border-amber-700 text-white"
                                          : "bg-white border-stone-300 text-stone-400"
                                          } ${isCurrent ? "ring-4 ring-amber-700/20 scale-110" : ""}`}
                                      >
                                        {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                                      </div>
                                      <span
                                        className={`text-[10px] font-medium mt-1.5 text-center hidden md:block max-w-[75px] leading-tight ${isCurrent
                                          ? "text-amber-800 font-bold"
                                          : isPassed
                                            ? "text-stone-900"
                                            : "text-stone-400"
                                          }`}
                                      >
                                        {stage.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Service & Product Details Box */}
                            <div className="p-4 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={ins.product?.image}
                                  alt={ins.product?.name}
                                  className="w-16 h-16 rounded-xl object-contain bg-stone-50 border border-stone-100 p-1.5 shrink-0"
                                />
                                <div>
                                  <span className="text-[10px] uppercase tracking-wider text-[#A73D4D] font-bold block">
                                    {ins.serviceType}
                                  </span>
                                  <h4 className="font-serif font-bold text-sm text-stone-900 mt-0.5">
                                    {ins.product?.name}
                                  </h4>
                                  <span className="text-[11px] text-stone-500 block mt-0.5">
                                    Appointment: {ins.scheduledDate} ({ins.timeSlot})
                                  </span>
                                </div>
                              </div>

                              {/* Assigned Professional Card */}
                              {ins.assignedProfessional ? (
                                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1 sm:max-w-xs shrink-0">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={ins.assignedProfessional.avatar}
                                      alt={ins.assignedProfessional.name}
                                      className="w-8 h-8 rounded-full object-cover border border-amber-300"
                                    />
                                    <div>
                                      <span className="font-bold text-stone-900 block leading-tight">
                                        {ins.assignedProfessional.name}
                                      </span>
                                      <span className="text-[10px] text-amber-800 font-semibold">
                                        Certified Specialist (★ {ins.assignedProfessional.rating})
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-stone-600 font-mono">
                                    Contact: {ins.assignedProfessional.phone}
                                  </p>
                                </div>
                              ) : (
                                <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-500 sm:max-w-xs">
                                  <Clock className="w-3.5 h-3.5 inline mr-1 text-stone-400" />
                                  <span>Allocating senior technician 24h prior to scheduled date.</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------------- 5. MY REVIEWS & RATINGS SECTION ---------------- */}
            {activeTab === "reviews" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="pb-4 border-b border-stone-100">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#A73D4D] block mb-1">
                      Verified Client Feedback
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      My Reviews & Ratings
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Only verified clients who have received their delivered furnishings or completed installations can submit architectural ratings.
                    </p>
                  </div>

                  {reviewSuccessMsg && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{reviewSuccessMsg}</span>
                    </div>
                  )}

                  {/* Items Eligible for Review */}
                  {deliveredItemsToReview.length > 0 && (
                    <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-700" />
                        <h4 className="font-serif font-bold text-sm text-stone-900">
                          Items Delivered — Ready for Review ({deliveredItemsToReview.length})
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {deliveredItemsToReview.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white rounded-xl border border-amber-200/60 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-11 h-11 rounded-lg object-contain bg-stone-50 p-1"
                              />
                              <div>
                                <h5 className="font-semibold text-stone-900 truncate max-w-[150px]">
                                  {item.name}
                                </h5>
                                <span className="text-[10px] text-stone-400">
                                  Order {item.orderNumber}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleOpenReviewModal(item)}
                              className="px-3 py-1.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-[11px] font-semibold transition-colors shrink-0"
                            >
                              Review Now
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submitted Reviews List */}
                  <div className="space-y-4 pt-2">
                    <h4 className="font-serif font-bold text-base text-stone-900">
                      Published Reviews ({myReviews.length})
                    </h4>

                    {myReviews.length === 0 ? (
                      <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                        <Star className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                        <p className="text-xs text-stone-500">
                          You haven't published any reviews yet. Complete an order to share your feedback.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {myReviews.map((rev) => (
                          <div
                            key={rev._id}
                            className="p-5 rounded-2xl border border-stone-200 bg-white space-y-3 shadow-xs"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                {rev.product?.image && (
                                  <img
                                    src={rev.product.image}
                                    alt={rev.product.name}
                                    className="w-12 h-12 rounded-xl object-contain bg-stone-50 border border-stone-100 p-1 shrink-0"
                                  />
                                )}
                                <div>
                                  <h5 className="font-serif font-bold text-sm text-stone-900">
                                    {rev.product?.name}
                                  </h5>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <div className="flex text-amber-500">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-stone-300"
                                            }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                      Verified Purchase
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <span className="text-[11px] text-stone-400">
                                {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>

                            <div className="text-xs space-y-1">
                              <h6 className="font-bold text-stone-900">{rev.title}</h6>
                              <p className="text-stone-600 leading-relaxed font-normal">{rev.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- 6. NOTIFICATIONS SECTION ---------------- */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#A73D4D] block mb-1">
                      Direct Atelier Alerts
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      Notifications
                    </h3>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-bold text-[#A73D4D] hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                    <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs text-stone-500">No notifications at this time.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          if (notif.link) {
                            if (notif.link.includes("tab=orders")) switchTab("orders");
                            else if (notif.link.includes("tab=installations")) switchTab("installations");
                            else if (notif.link.includes("tab=reviews")) switchTab("reviews");
                            else navigate(notif.link);
                          }
                        }}
                        className={`py-4 px-3 sm:px-4 rounded-2xl flex items-start justify-between gap-4 cursor-pointer transition-colors ${notif.read ? "hover:bg-stone-50/60" : "bg-amber-50/40 hover:bg-amber-50/70"
                          }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${notif.type === "installation"
                              ? "bg-amber-100 text-amber-800"
                              : notif.type === "order"
                                ? "bg-stone-900 text-white"
                                : "bg-emerald-100 text-emerald-800"
                              }`}
                          >
                            {notif.type === "installation" ? (
                              <Wrench className="w-4 h-4" />
                            ) : (
                              <Package className="w-4 h-4" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-serif font-bold text-sm text-stone-900">
                                {notif.title}
                              </h5>
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-[#A73D4D]" />
                              )}
                            </div>
                            <p className="text-xs text-stone-600 leading-relaxed font-normal">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-stone-400 font-mono block">
                              {notif.timestamp}
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-stone-300 shrink-0 self-center" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ================= ORDER DETAILS DRAWER / MODAL ================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A73D4D] block">
                  Order Details
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  {selectedOrderDetails.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Offline Payment Instructions Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-stone-900">
                <span>Payment Mode: {selectedOrderDetails.offlinePayment?.method?.replace(/_/g, " ").toUpperCase()}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-mono">
                  {selectedOrderDetails.offlinePayment?.status || "Payment Pending"}
                </span>
              </div>
              <p className="text-[11px] text-stone-700 whitespace-pre-line leading-relaxed">
                {selectedOrderDetails.offlinePayment?.notes ||
                  OFFLINE_PAYMENT_METHODS[selectedOrderDetails.offlinePayment?.method]?.instructions ||
                  "Offline payment to be collected according to instructions."}
              </p>
            </div>

            {/* Delivery Site Address */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Delivery Destination
              </span>
              <p className="font-bold text-stone-900">
                {selectedOrderDetails.shippingAddress.fullName} (+91 {selectedOrderDetails.shippingAddress.phone})
              </p>
              <p className="text-stone-600">
                {selectedOrderDetails.shippingAddress.street},{" "}
                {selectedOrderDetails.shippingAddress.landmark ? `${selectedOrderDetails.shippingAddress.landmark}, ` : ""}
                {selectedOrderDetails.shippingAddress.city}, {selectedOrderDetails.shippingAddress.state} -{" "}
                <strong className="font-mono text-stone-900">{selectedOrderDetails.shippingAddress.pinCode}</strong>
              </p>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-900 block">Ordered Products</span>
              {selectedOrderDetails.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl border border-stone-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-contain bg-stone-50 p-1 shrink-0"
                    />
                    <div>
                      <h5 className="font-serif font-bold text-stone-900">{item.name}</h5>
                      <span className="text-stone-500 text-[11px]">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-sm text-stone-900">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Products Subtotal</span>
                <span>₹{selectedOrderDetails.subtotal.toLocaleString("en-IN")}</span>
              </div>
              {selectedOrderDetails.installationTotal > 0 && (
                <div className="flex justify-between text-amber-800">
                  <span>Turnkey Installation Services</span>
                  <span>+₹{selectedOrderDetails.installationTotal.toLocaleString("en-IN")}</span>
                </div>
              )}
              {selectedOrderDetails.shippingFee > 0 ? (
                <div className="flex justify-between text-stone-600">
                  <span>Insured Logistics</span>
                  <span>+₹{selectedOrderDetails.shippingFee.toLocaleString("en-IN")}</span>
                </div>
              ) : (
                <div className="flex justify-between text-emerald-700">
                  <span>White-Glove Shipping</span>
                  <span>FREE</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between font-serif font-bold text-base text-stone-950">
                <span>Total Amount</span>
                <span>₹{selectedOrderDetails.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= INSTALLATION TIMELINE MODAL ================= */}
      {selectedInstallationDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A73D4D] block">
                  Installation Tracking
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  {selectedInstallationDetails.bookingNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInstallationDetails(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
              <span className="font-bold text-stone-900 block text-sm">
                {selectedInstallationDetails.serviceType}
              </span>
              <p className="text-stone-600">
                Product: <strong>{selectedInstallationDetails.product?.name}</strong>
              </p>
              <p className="text-stone-600">
                Scheduled Slot: {selectedInstallationDetails.scheduledDate} ({selectedInstallationDetails.timeSlot})
              </p>
            </div>

            {/* Timeline Breakdown */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-stone-900 block">Milestone Timeline</span>
              <div className="space-y-4 pl-2 border-l-2 border-stone-200">
                {selectedInstallationDetails.timeline?.map((step, idx) => (
                  <div key={idx} className="relative pl-4">
                    <span
                      className={`absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 ${step.completed
                        ? "bg-amber-700 border-amber-700"
                        : "bg-white border-stone-300"
                        }`}
                    />
                    <h6 className="font-bold text-xs text-stone-900">{step.label}</h6>
                    <span className="text-[10px] text-stone-400 block font-mono">{step.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedInstallationDetails(null)}
                className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= WRITE REVIEW MODAL ================= */}
      {reviewModalOpen && reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A73D4D] block">
                  Verified Client Review
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Rate Your Experience
                </h3>
              </div>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <img
                src={reviewTarget.image}
                alt={reviewTarget.name}
                className="w-12 h-12 rounded-xl object-contain bg-white p-1 shrink-0"
              />
              <div>
                <h5 className="font-serif font-bold text-stone-900">{reviewTarget.name}</h5>
                <span className="text-[11px] text-stone-500">Order: {reviewTarget.orderNumber}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-5">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Rating (1–5 Stars) *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= reviewRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-stone-300"
                          }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-700 ml-2">
                    {reviewRating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Review Headline *
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Exceptional joinery & acoustic finish"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Your Detailed Feedback *
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the material quality, packaging, structural accuracy, or on-site installation experience..."
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 py-3 rounded-full border border-stone-300 text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="flex-1 py-3 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {reviewSubmitting ? "Publishing..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD/EDIT ADDRESS MODAL ================= */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {editingAddressId ? "Edit Delivery Address" : "Add Delivery Address"}
              </h3>
              <button
                onClick={() => setAddressModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Street / Flat / Villa Address *
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  required
                  placeholder="Villa 14, The Grand Arch"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={addressForm.pinCode}
                    onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value.replace(/\D/g, "") })}
                    required
                    placeholder="122002"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="rounded accent-stone-900"
                  />
                  <span>Make this my primary delivery address</span>
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-stone-300 text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold transition-colors"
                >
                  Save Address
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
