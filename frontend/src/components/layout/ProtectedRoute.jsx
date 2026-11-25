import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * Role-Based Route Guard Component
 *
 * @param {Array<string>} allowedRoles - e.g. ['admin'] or ['customer']
 * @param {React.ReactNode} children
 */
const ProtectedRoute = ({ allowedRoles = ["admin"], children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // 1. Show loading indicator while session state is being verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-stone-600 tracking-wide">
            Verifying authentication session...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated user -> redirect to unified login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated customer attempting to access admin route
  if (allowedRoles.includes("admin") && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 4. Authenticated admin attempting to access customer-only route
  if (allowedRoles.includes("customer") && user.role !== "customer") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 5. General check if user's role is in allowedRoles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/"} replace />;
  }

  // Render protected child routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
