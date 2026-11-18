import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { admin, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-600">Verifying admin session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || admin?.role !== "admin") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
