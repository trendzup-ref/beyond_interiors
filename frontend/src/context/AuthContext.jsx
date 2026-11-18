import React, { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verify active session on page mount
  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/auth/admin/me");
      if (res?.data?.user && res.data.user.role === "admin") {
        setAdmin(res.data.user);
      } else {
        setAdmin(null);
      }
    } catch (err) {
      // 401 or no active cookie - normal when not logged in
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Admin Login Handler
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axiosClient.post("/auth/admin/login", { email, password });
      const user = res.data?.user;
      setAdmin(user);
      return { success: true, user };
    } catch (err) {
      const msg = err.message || "Failed to log in. Please check your credentials.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Admin Logout Handler
  const logout = async () => {
    try {
      await axiosClient.post("/auth/admin/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        error,
        setError,
        login,
        logout,
        checkAuth,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
