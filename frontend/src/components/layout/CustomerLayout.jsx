import React from "react";
import { Outlet, Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import IkeaNavbar from "../common/IkeaNavbar.jsx";
import CommonFooter from "../common/CommonFooter.jsx";

/**
 * CustomerLayout
 * Consistent master layout for all customer-facing storefront pages.
 * Integrates the IKEA-style responsive navigation bar with interactive categories
 * and the rich 5-column luxury footer.
 *
 * Strict Role Guard:
 * Blocks Admin users from accessing customer/public shopping pages and redirects
 * them directly to the Admin Dashboard.
 */
const CustomerLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Strict Role Guard: Admin cannot access customer/public pages
  if (!loading && isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

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
