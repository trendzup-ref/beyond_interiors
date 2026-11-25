import React from "react";
import { Link } from "react-router";
import {
  Compass,
  User,
  ShoppingBag,
  LogOut,
  Shield,
  Sparkles,
  ArrowRight,
  Package,
  Wrench,
  CheckCircle,
  Heart,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart, useWishlist } from "../../context/CartWishlistContext.jsx";
import HeroBanner from "../../components/home/HeroBanner.jsx";
import CategorySection from "../../components/home/CategorySection.jsx";
import RoomSection from "../../components/home/RoomSection.jsx";
import InspirationSection from "../../components/home/InspirationSection.jsx";
import HowItWorksSection from "../../components/home/HowItWorksSection.jsx";
import InstallationVideoSection from "../../components/home/InstallationVideoSection.jsx";
import FaqSection from "../../components/common/FaqSection.jsx";

const CustomerHome = () => {
  return (
    <div className="bg-stone-100 flex flex-col font-sans">
      {/* Hero Banner Section (Full-bleed Background & Absolute Text) */}
      <HeroBanner />

      {/* Shop by Category Section (Bento Grid with Full Background Images) */}
      <CategorySection />

      {/* Shop by Room Section (3D Perspective Gallery / Carousel) */}
      <RoomSection />

      {/* Looks by You / Design Inspiration Section (IKEA-Style Shoppable Gallery) */}
      <InspirationSection />

      {/* How it Works Section (3-Step Process) */}
      <HowItWorksSection />

      {/* Full-Width Installation Video Section (Typewriter Impact Headline) */}
      <InstallationVideoSection />

      {/* Frequently Asked Questions Section */}
      <FaqSection />
    </div>
  );
};

export default CustomerHome;
