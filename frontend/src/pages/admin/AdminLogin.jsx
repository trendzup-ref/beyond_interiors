import React from "react";
import { Navigate } from "react-router";

/**
 * Legacy AdminLogin route handler.
 * Beyond Interiors uses a unified single login system at /login for both Administrators and Customers.
 */
const AdminLogin = () => {
  return <Navigate to="/login" replace />;
};

export default AdminLogin;
