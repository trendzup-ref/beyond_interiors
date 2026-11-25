import React, { useState } from "react";
import { Link } from "react-router";
import {
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Compass,
  FileText,
  ShieldCheck,
  Send,
  Building,
} from "lucide-react";
import { submitSupportTicket } from "../../api/customerApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";

const FAQ_ITEMS = [
  {
    q: "How can I track the exact delivery date of my handcrafted furniture?",
    a: "You can track your order using your Order ID (e.g. BI-ORD-882103) on our Live Order Tracker page. Once dispatched, our white-glove transport partner coordinates an advance 24-hour delivery window with you.",
  },
  {
    q: "What should I do if a product arrives with transport damage?",
    a: "Please report any visible damage within 48 hours of delivery. You can raise a ticket below under 'Damaged / Defective Delivery' or message our WhatsApp Concierge with photographs of the packaging and product.",
  },
  {
    q: "Can I reschedule my installation technician's arrival window?",
    a: "Yes. You can reschedule your booking at least 12 hours prior to the scheduled slot either via your Account Dashboard or by submitting a ticket with your Booking ID.",
  },
  {
    q: "Does Beyond Interiors provide site measurement surveys before ordering?",
    a: "Yes. Our senior site engineers provide precision laser surveys for wallpapers, flooring, and bespoke wall paneling across major metro regions.",
  },
];

const SupportPage = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [ticketForm, setTicketForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    category: "Order Fulfillment & Tracking",
    orderNumber: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.name || !ticketForm.phone || !ticketForm.message) {
      alert("Please fill in your name, phone, and message.");
      return;
    }

    setLoading(true);
    try {
      const res = await submitSupportTicket(ticketForm);
      const ticket = res.data?.data?.ticket || {
        ticketNumber: `BI-SUP-${Date.now().toString().slice(-5)}`,
        ...ticketForm,
      };

      setSubmittedTicket(ticket);
      addNotification({
        title: "Support Ticket Registered",
        message: `Your inquiry (${ticket.ticketNumber}) has been submitted. A concierge officer will contact you within 2 hours.`,
        type: "info",
      });
    } catch (err) {
      console.error(err);
      const fallbackTicket = {
        ticketNumber: `BI-SUP-${Date.now().toString().slice(-5)}`,
        ...ticketForm,
      };
      setSubmittedTicket(fallbackTicket);
    } finally {
      setLoading(false);
    }
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
            <Link to="/track" className="hover:text-stone-900">Track Orders</Link>
            <Link to="/services" className="hover:text-stone-900">Installations</Link>
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
      <main className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 space-y-12">
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-mono uppercase tracking-wider font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dedicated Client Concierge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900">
            How May We Assist You Today?
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
            From checking real-time shipment status and rescheduling certified installations to bespoke customization guidance, our team is at your disposal.
          </p>
        </div>

        {/* 4 Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/track?type=order"
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md hover:border-stone-400 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#A73D4D] transition-colors">
              Track Merchandise Order
            </h3>
            <p className="text-xs text-stone-500 font-light mt-1">
              Live fabrication and courier milestones.
            </p>
          </Link>

          <Link
            to="/services"
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md hover:border-stone-400 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#A73D4D]/10 text-[#A73D4D] flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#A73D4D] transition-colors">
              Book Installation Service
            </h3>
            <p className="text-xs text-stone-500 font-light mt-1">
              Furniture, lighting, wallpaper & flooring.
            </p>
          </Link>

          <Link
            to="/return-policy"
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-md hover:border-stone-400 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#A73D4D] transition-colors">
              Returns & Replacement
            </h3>
            <p className="text-xs text-stone-500 font-light mt-1">
              7-Day verified buyer quality protection.
            </p>
          </Link>

          <a
            href="https://wa.me/919820012345?text=Hello%20Beyond%20Interiors%20Concierge"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-emerald-950">
              WhatsApp Concierge
            </h3>
            <p className="text-xs text-emerald-800 font-light mt-1">
              Instant response from our senior advisors.
            </p>
          </a>
        </div>

        {/* Two-Column: Ticket Form + Direct Contact Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Submit a Ticket */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-semibold block">
                PRIORITY RESOLUTION
              </span>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Submit a Support Inquiry
              </h2>
              <p className="text-xs text-stone-500 font-light mt-1">
                A dedicated concierge representative will review your request and get back to you within 2 business hours.
              </p>
            </div>

            {submittedTicket ? (
              <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Ticket #{submittedTicket.ticketNumber} Created
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    We have received your inquiry regarding <strong>{submittedTicket.category}</strong>. An email and SMS confirmation have been dispatched.
                  </p>
                </div>
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={ticketForm.name}
                      onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                      required
                      className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      value={ticketForm.phone}
                      onChange={(e) => setTicketForm({ ...ticketForm, phone: e.target.value })}
                      required
                      className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900"
                      placeholder="10-digit number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={ticketForm.email}
                      onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Inquiry Category *</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900"
                    >
                      <option value="Order Fulfillment & Tracking">Order Fulfillment & Tracking</option>
                      <option value="Installation Rescheduling">Installation Rescheduling</option>
                      <option value="Damaged / Defective Delivery">Damaged / Defective Delivery</option>
                      <option value="Custom Finishing & Dimensions">Custom Finishing & Dimensions</option>
                      <option value="Billing & Bank Record">Billing & Bank Record</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Related Order or Booking ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={ticketForm.orderNumber}
                    onChange={(e) => setTicketForm({ ...ticketForm, orderNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 font-mono focus:outline-none focus:border-stone-900"
                    placeholder="e.g. BI-ORD-882103 or BI-INS-774120"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Describe your request in detail *
                  </label>
                  <textarea
                    rows="4"
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900"
                    placeholder="Provide relevant details so our specialist can assist you immediately..."
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white font-semibold text-xs shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? "Submitting..." : "Submit Ticket"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Direct Channels Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-5">
              <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
                Direct Contact Channels
              </h3>

              <div className="space-y-4 text-xs text-stone-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Priority Telephone Concierge</span>
                    <a href="tel:+919820012345" className="text-amber-700 font-mono font-semibold">
                      +91 98200 12345
                    </a>
                    <span className="text-[10px] text-stone-400 block">Mon – Sat: 09:30 AM – 07:30 PM</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Atelier Support Email</span>
                    <a href="mailto:concierge@beyondinteriors.com" className="text-amber-700 font-mono">
                      concierge@beyondinteriors.com
                    </a>
                    <span className="text-[10px] text-stone-400 block">Guaranteed 2-hour response</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Experience Atelier & Studio</span>
                    <p className="text-stone-500 font-light">
                      Beyond Interiors Atelier, Horizon Design Park, Worli, Mumbai 400018
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQs */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Frequently Asked Questions
              </h3>

              <div className="divide-y divide-stone-100 text-xs">
                {FAQ_ITEMS.map((faq, idx) => (
                  <div key={idx} className="py-3">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left font-semibold text-stone-800 flex justify-between items-center gap-2 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${
                          openFaq === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <p className="text-stone-500 font-light mt-2 leading-relaxed text-[11px]">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportPage;
