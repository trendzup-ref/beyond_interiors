import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Search,
  Package,
  Wrench,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Phone,
  User,
  ArrowLeft,
  Compass,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { trackOrder, trackInstallation } from "../../api/customerApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

const ORDER_STAGES = [
  { key: "pending", label: "Order Placed", desc: "Registered in system" },
  { key: "confirmed", label: "Payment Confirmed", desc: "Verified via bank/record" },
  { key: "processing", label: "Atelier Inspection", desc: "Crafting & safety packing" },
  { key: "out_for_delivery", label: "Out for Delivery", desc: "White-glove courier en route" },
  { key: "delivered", label: "Delivered", desc: "Handed over safely" },
];

const INSTALLATION_STAGES = [
  { key: "requested", label: "Request Logged", desc: "Service registered" },
  { key: "assigned", label: "Technician Assigned", desc: "Specialist reserved" },
  { key: "in_progress", label: "Installation Active", desc: "On-site assembly underway" },
  { key: "completed", label: "Completed & Inspected", desc: "Quality sign-off verified" },
];

const OrderTracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type") === "installation" ? "installation" : "order";
  const initialId = searchParams.get("id") || "";

  const [activeTab, setActiveTab] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState(initialId || (initialType === "order" ? "BI-ORD-882103" : "BI-INS-774120"));
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [installationResult, setInstallationResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTrack = async (typeToTrack = activeTab, queryToTrack = searchQuery) => {
    if (!queryToTrack.trim()) return;
    setLoading(true);
    setErrorMsg("");

    try {
      if (typeToTrack === "order") {
        const res = await trackOrder(queryToTrack.trim());
        if (res.data?.data?.order) {
          setOrderResult(res.data.data.order);
        } else {
          setErrorMsg("No order record found for this identifier.");
        }
      } else {
        const res = await trackInstallation(queryToTrack.trim());
        if (res.data?.data?.booking) {
          setInstallationResult(res.data.data.booking);
        } else {
          setErrorMsg("No installation booking found for this identifier.");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to retrieve tracking record. Please check the ID or contact concierge.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      setSearchQuery(initialId);
      handleTrack(initialType, initialId);
    } else {
      // Auto-load demo tracking
      handleTrack(initialType, searchQuery);
    }
  }, [initialType, initialId]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrorMsg("");
    const defaultQuery = tab === "order" ? "BI-ORD-882103" : "BI-INS-774120";
    setSearchQuery(defaultQuery);
    handleTrack(tab, defaultQuery);
    searchParams.set("type", tab);
    searchParams.set("id", defaultQuery);
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-[1520px] mx-auto flex items-center justify-between">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront Catalog</span>
          </Link>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-serif text-sm font-bold tracking-wider text-stone-900">
              BEYOND INTERIORS
            </span>
          </Link>

          <div className="flex items-center gap-3 text-xs font-semibold text-stone-600">
            <Link to="/services" className="hover:text-stone-900">Installations</Link>
            <Link to="/support" className="hover:text-stone-900">Help & Support</Link>
            <Link
              to="/account"
              className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
            >
              Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-mono uppercase tracking-wider font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Real-Time Milestone Fulfillment</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Live Order & Installation Tracking
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light">
            Monitor the exact atelier craftsmanship, delivery transit, or on-site installation status of your Beyond Interiors bookings.
          </p>
        </div>

        {/* Tab Toggle & Search Bar */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Dual Tabs */}
          <div className="flex border-b border-stone-200 pb-3 gap-2">
            <button
              onClick={() => switchTab("order")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "order"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track Merchandise Order</span>
            </button>

            <button
              onClick={() => switchTab("installation")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "installation"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Track Installation Service</span>
            </button>
          </div>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === "order"
                    ? "Enter Order Number (e.g. BI-ORD-882103)"
                    : "Enter Booking Number (e.g. BI-INS-774120)"
                }
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-mono tracking-wider uppercase text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-2xl bg-stone-900 hover:bg-[#A73D4D] text-white font-semibold text-xs tracking-wider uppercase shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Searching..." : "Track Live"}
            </button>
          </form>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* ================= TAB 1: ORDER TRACKING DISPLAY ================= */}
        {activeTab === "order" && orderResult && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-8">
            {/* Order Header Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-semibold block">
                  ORDER FULFILLMENT TRACKER
                </span>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  {orderResult.orderNumber}
                </h2>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  Placed on {new Date(orderResult.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full text-xs font-mono uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Status: {orderResult.orderStatus?.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Stages Visual Stepper */}
            <div className="py-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-2">
                {ORDER_STAGES.map((stg, i) => {
                  const isCurrent = orderResult.orderStatus === stg.key;
                  const isPast =
                    ORDER_STAGES.findIndex((s) => s.key === orderResult.orderStatus) >= i;

                  return (
                    <div key={stg.key} className="space-y-2 text-center sm:text-left">
                      <div className="flex items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isPast
                              ? "bg-stone-900 text-white"
                              : "bg-stone-100 text-stone-400 border border-stone-200"
                          }`}
                        >
                          {isPast ? <CheckCircle className="w-4 h-4" /> : i + 1}
                        </div>
                        {i < ORDER_STAGES.length - 1 && (
                          <div
                            className={`hidden sm:block flex-1 h-0.5 mx-2 ${
                              isPast ? "bg-stone-900" : "bg-stone-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className="font-serif font-bold text-xs text-stone-900 leading-tight">
                          {stg.label}
                        </p>
                        <p className="text-[10px] text-stone-400 font-light mt-0.5">
                          {stg.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tracking Milestones Log */}
            {orderResult.trackingMilestones && (
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 space-y-3">
                <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-stone-700">
                  Milestone Activity Log
                </h3>
                <div className="divide-y divide-stone-200/60">
                  {orderResult.trackingMilestones.map((milestone, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            milestone.completed ? "bg-emerald-600" : "bg-stone-300"
                          }`}
                        />
                        <span
                          className={`font-medium ${
                            milestone.completed ? "text-stone-900" : "text-stone-400"
                          }`}
                        >
                          {milestone.title}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-stone-500">
                        {milestone.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Destination & Quick Help */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>White-Glove Delivery Destination</span>
                </div>
                <p className="text-stone-600">
                  {orderResult.shippingAddress?.fullName} - {orderResult.shippingAddress?.city},{" "}
                  {orderResult.shippingAddress?.state} {orderResult.shippingAddress?.pinCode}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-950 block">Need Help with this Order?</span>
                  <span className="text-[11px] text-amber-800">24/7 Beyond Concierge Support</span>
                </div>
                <Link
                  to="/support"
                  className="px-3 py-1.5 rounded-full bg-stone-900 text-white text-[11px] font-semibold"
                >
                  Contact Help
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: INSTALLATION TRACKING DISPLAY ================= */}
        {activeTab === "installation" && installationResult && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-8">
            {/* Header Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-semibold block">
                  CERTIFIED INSTALLATION TRACKER
                </span>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  {installationResult.bookingNumber}
                </h2>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  Service: <strong>{installationResult.serviceType}</strong>
                </p>
              </div>

              <div>
                <span className="px-3.5 py-1 rounded-full text-xs font-mono uppercase font-bold tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  Status: {installationResult.status}
                </span>
              </div>
            </div>

            {/* Assigned Specialist Profile Card */}
            {installationResult.assignedProfessional && (
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stone-800 to-amber-700 text-white flex items-center justify-center font-serif font-bold text-lg shadow-xs">
                    {installationResult.assignedProfessional.name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-base text-stone-900">
                        {installationResult.assignedProfessional.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-semibold">
                        Certified Specialist
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-light">
                      {installationResult.assignedProfessional.specialization} ·{" "}
                      {installationResult.assignedProfessional.experienceYears || 5}+ Years Exp.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${installationResult.assignedProfessional.phone}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-stone-100 text-stone-900 text-xs font-semibold border border-stone-300 shadow-2xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-700" />
                    <span>Call Technician</span>
                  </a>
                </div>
              </div>
            )}

            {/* Stepper Stages */}
            <div className="py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {INSTALLATION_STAGES.map((stg, i) => {
                  const isPast =
                    INSTALLATION_STAGES.findIndex((s) => s.key === installationResult.status) >= i;

                  return (
                    <div key={stg.key} className="space-y-2 text-center sm:text-left">
                      <div className="flex items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isPast
                              ? "bg-stone-900 text-white"
                              : "bg-stone-100 text-stone-400 border border-stone-200"
                          }`}
                        >
                          {isPast ? <CheckCircle className="w-4 h-4" /> : i + 1}
                        </div>
                        {i < INSTALLATION_STAGES.length - 1 && (
                          <div
                            className={`hidden sm:block flex-1 h-0.5 mx-2 ${
                              isPast ? "bg-stone-900" : "bg-stone-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className="font-serif font-bold text-xs text-stone-900 leading-tight">
                          {stg.label}
                        </p>
                        <p className="text-[10px] text-stone-400 font-light mt-0.5">
                          {stg.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Appointment Window Details */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Scheduled Date:</span>
                <span className="font-semibold text-stone-900">
                  {new Date(installationResult.preferredDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Arrival Window:</span>
                <span className="font-semibold text-stone-900">
                  {installationResult.timeSlot || "10:00 AM - 02:00 PM"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Site Location:</span>
                <span className="text-stone-800 text-right max-w-sm truncate">
                  {installationResult.address?.street || ""}, {installationResult.address?.city || "Mumbai"}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderTracking;
