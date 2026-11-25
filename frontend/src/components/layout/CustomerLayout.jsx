import React from "react";
import { Outlet } from "react-router";
import IkeaNavbar from "../common/IkeaNavbar.jsx";
import CommonFooter from "../common/CommonFooter.jsx";

/**
 * CustomerLayout
 * Consistent master layout for all customer-facing storefront pages.
 * Integrates the IKEA-style responsive navigation bar with interactive categories
 * and the rich 5-column luxury footer.
 */
const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 font-sans selection:bg-[#D4C26B]/30 selection:text-stone-900">
      {/* Consistent IKEA-Style Navigation Bar */}
      <IkeaNavbar />

      {/* Main Page View */}
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>

      {/* Consistent 5-Column Luxury Footer */}
      <CommonFooter />
    </div>
  );
};

export default CustomerLayout;
