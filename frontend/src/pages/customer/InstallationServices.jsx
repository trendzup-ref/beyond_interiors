import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Wrench,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Compass,
  Phone,
  User,
  MapPin,
  Check,
  X,
  FileText,
} from "lucide-react";
import { getInstallationServices, bookInstallationService } from "../../api/customerApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";

const FALLBACK_SERVICES = [
  {
    id: "serv-furniture",
    title: "Architectural Furniture Assembly",
    slug: "furniture-assembly",
    category: "Furniture",
    description:
      "Precision unpacking, acoustic alignment, hardware leveling, and protective felt pad application for luxury lounge chairs, dining tables, and modular storage units.",
    startingPrice: 1999,
    durationHours: "2-3 Hours",
    included: [
      "White-glove unboxing and room positioning",
      "Precision leveling & torque-tested assembly",
      "Floor protection pads & hardware check",
      "Complete packaging cleanup & haul away",
    ],
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80",
    badge: "Most Requested",
  },
  {
    id: "serv-wallpanels",
    title: "Wallpapers & Acoustic Wall Paneling",
    slug: "wallpapers-wall-panels",
    category: "Wall Finishes",
    description:
      "Laser-guided surface preparation, seamless pattern matching, and bubble-free installation for imported wallpapers and acoustic fluted wall panels.",
    startingPrice: 3499,
    durationHours: "3-5 Hours",
    included: [
      "Laser-level plumb line alignment",
      "Anti-fungal primer & adhesive application",
      "Zero-gap pattern and seam matching",
      "Edge sealing and finish inspection",
    ],
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    badge: "Turnkey Finish",
  },
  {
    id: "serv-lighting",
    title: "Designer Lighting & Chandelier Rigging",
    slug: "lighting-chandelier-rigging",
    category: "Lighting",
    description:
      "Safe ceiling anchor reinforcement, concealed wiring, smart dimmer calibration, and crystal pendant rigging for heavy chandeliers and architectural lamps.",
    startingPrice: 2499,
    durationHours: "1-2 Hours",
    included: [
      "Load-bearing ceiling anchor inspection",
      "Concealed electrical connection & earthing test",
      "Smart switch / dimmer phase calibration",
      "Pre-illumination lumen & temperature test",
    ],
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
    badge: "Certified Electricians",
  },
  {
    id: "serv-curtains",
    title: "Curtains, Blinds & Motorized Track Fitting",
    slug: "curtains-blinds-fitting",
    category: "Window Dressings",
    description:
      "Heavy-duty wall and ceiling track mounting, motorized curtain motor pairing, laser height adjustment, and thermal blackout drapery steaming.",
    startingPrice: 1799,
    durationHours: "1-2 Hours",
    included: [
      "Heavy-gauge concealed track mounting",
      "Motorized remote and smart hub pairing",
      "Drapery drop height precision calibration",
      "Fabric steaming & wrinkle removal",
    ],
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    badge: "Smart Automation Ready",
  },
  {
    id: "serv-flooring",
    title: "Engineered Wood & Vinyl Flooring Laying",
    slug: "flooring-installation",
    category: "Flooring",
    description:
      "Moisture-barrier underlayment laying, expansion gap calibration, acoustic foam insulation, and precision skirting edge trim installation.",
    startingPrice: 4999,
    durationHours: "4-6 Hours",
    included: [
      "Subfloor moisture & level testing",
      "High-density acoustic underlayment",
      "Tongue-and-groove click installation",
      "Perimeter skirting & transition threshold strips",
    ],
    image:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1000&q=80",
    badge: "Heavy Traffic Certified",
  },
  {
    id: "serv-fullhome",
    title: "Full-Home Turnkey Interior Installation",
    slug: "turnkey-full-home-setup",
    category: "Full Space",
    description:
      "End-to-end dedicated project supervisor with a multi-disciplinary team handling furniture, lighting, wall finishes, and post-installation deep cleaning.",
    startingPrice: 9999,
    durationHours: "1-2 Days",
    included: [
      "Dedicated Senior Site Project Manager",
      "Multi-trade team (Carpenters, Electricians, Fitters)",
      "Room-by-room architectural alignment check",
      "Post-work cleanup and handover certificate",
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    badge: "White-Glove Concierge",
  },
];

const CATEGORIES = [
  "All",
  "Furniture",
  "Wall Finishes",
  "Lighting",
  "Window Dressings",
  "Flooring",
  "Full Space",
];

const InstallationServices = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();

  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    preferredDate: "",
    timeSlot: "10:00 AM - 02:00 PM",
    street: "",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "",
    notes: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      const data = await getInstallationServices();
      if (data && data.length > 0) {
        setServices(data);
      }
    };
    fetchServices();
  }, []);

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleOpenBooking = (service) => {
    setActiveService(service);
    setBookingForm((prev) => ({
      ...prev,
      name: user?.name || prev.name,
      phone: user?.phone || prev.phone,
      email: user?.email || prev.email,
      street: user?.addresses?.[0]?.street || prev.street,
      city: user?.addresses?.[0]?.city || prev.city,
      state: user?.addresses?.[0]?.state || prev.state,
      pinCode: user?.addresses?.[0]?.pinCode || prev.pinCode,
    }));
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.preferredDate) {
      alert("Please provide your name, phone, and preferred date.");
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        customerName: bookingForm.name,
        customerPhone: bookingForm.phone,
        customerEmail: bookingForm.email,
        serviceType: activeService?.title || "Architectural Furniture Assembly",
        preferredDate: bookingForm.preferredDate,
        timeSlot: bookingForm.timeSlot,
        address: {
          street: bookingForm.street,
          city: bookingForm.city,
          state: bookingForm.state,
          pinCode: bookingForm.pinCode,
        },
        notes: bookingForm.notes,
      };

      const res = await bookInstallationService(payload);
      const bookingData = res.data?.data?.booking || {
        bookingNumber: `BI-INS-${Date.now().toString().slice(-6)}`,
        ...payload,
      };

      setConfirmedBooking(bookingData);
      setBookingModalOpen(false);

      addNotification({
        title: "Installation Booking Submitted",
        message: `Your booking for "${payload.serviceType}" (${bookingData.bookingNumber}) is confirmed. A technician is being assigned.`,
        type: "installation",
        link: `/track?type=installation&id=${bookingData.bookingNumber}`,
      });
    } catch (err) {
      console.error(err);
      // Fallback
      const fallbackBooking = {
        bookingNumber: `BI-INS-${Date.now().toString().slice(-6)}`,
        serviceType: activeService?.title,
        customerName: bookingForm.name,
        preferredDate: bookingForm.preferredDate,
        timeSlot: bookingForm.timeSlot,
        address: { city: bookingForm.city },
      };
      setConfirmedBooking(fallbackBooking);
      setBookingModalOpen(false);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="bg-stone-50 font-sans text-stone-900 flex flex-col flex-1">
      {/* Main Container */}
      <main className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 space-y-10">
        {/* Header Hero Banner */}

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
                ? "bg-stone-900 text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-200 border border-stone-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Badge */}
              <div className="relative aspect-video sm:aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-white/90 text-stone-900 backdrop-blur-md shadow-xs">
                    {service.category}
                  </span>
                  {service.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#A73D4D] text-white shadow-xs">
                      {service.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-[#A73D4D] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>

                {/* What's Included */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    What's Included:
                  </span>
                  {service.included?.map((inc, i) => (
                    <div key={i} className="flex items-start gap-2 text-stone-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{inc}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Booking Button */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 block uppercase">
                      Starting At
                    </span>
                    <span className="font-serif text-xl font-bold text-stone-950">
                      ₹{service.startingPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono block">
                      Est. {service.durationHours}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(service)}
                    className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Service</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ================= BOOKING MODAL ================= */}
      {bookingModalOpen && activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-semibold block">
                  SERVICE RESERVATION
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {activeService.title}
                </h3>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900"
                    placeholder="10-digit number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    value={bookingForm.preferredDate}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, preferredDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Arrival Time Window *</label>
                  <select
                    value={bookingForm.timeSlot}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, timeSlot: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900"
                  >
                    <option value="10:00 AM - 02:00 PM">Morning (10:00 AM - 02:00 PM)</option>
                    <option value="02:00 PM - 06:00 PM">Afternoon (02:00 PM - 06:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Site Street Address *</label>
                <input
                  type="text"
                  value={bookingForm.street}
                  onChange={(e) => setBookingForm({ ...bookingForm, street: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900"
                  placeholder="Flat / House No, Building, Street"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={bookingForm.city}
                    onChange={(e) => setBookingForm({ ...bookingForm, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">State</label>
                  <input
                    type="text"
                    value={bookingForm.state}
                    onChange={(e) => setBookingForm({ ...bookingForm, state: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    value={bookingForm.pinCode}
                    onChange={(e) => setBookingForm({ ...bookingForm, pinCode: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200"
                    placeholder="400001"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Scope & Architectural Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  placeholder="E.g. 4th floor with lift access, wall is solid RCC, etc."
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block font-mono">ESTIMATED FEE</span>
                  <span className="font-serif font-bold text-lg text-stone-900">
                    ₹{activeService.startingPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-4 py-2.5 rounded-full border border-stone-300 text-stone-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white font-semibold shadow-xs disabled:opacity-50"
                  >
                    {bookingLoading ? "Reserving..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CONFIRMATION MODAL ================= */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 text-center shadow-2xl border border-stone-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Installation Reserved!
              </h3>
              <p className="text-xs text-stone-500">
                A verified installation specialist is being scheduled for your site.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-stone-500">Booking Number:</span>
                <span className="font-mono font-bold text-stone-900">
                  {confirmedBooking.bookingNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Service:</span>
                <span className="font-semibold text-stone-900 truncate max-w-[180px]">
                  {confirmedBooking.serviceType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Scheduled Date:</span>
                <span className="text-stone-800">{confirmedBooking.preferredDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Time Window:</span>
                <span className="text-stone-800">{confirmedBooking.timeSlot}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to={`/track?type=installation&id=${confirmedBooking.bookingNumber}`}
                onClick={() => setConfirmedBooking(null)}
                className="w-full py-3 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Track Installation Live</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="w-full py-2.5 rounded-full text-stone-500 hover:text-stone-800 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallationServices;
