import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verify active session on page mount using common /auth/me endpoint
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/auth/me");
      if (res?.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      // 401 or no active cookie - normal when not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Common Unified Login Handler (Admin & Customer)
  const login = async (email, password, rememberMe = true) => {
    setError(null);
    try {
      const res = await axiosClient.post("/auth/login", {
        email,
        password,
        rememberMe,
      });

      const authenticatedUser = res.data?.user;
      setUser(authenticatedUser);
      return { success: true, user: authenticatedUser };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to log in. Please check your credentials.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Customer Registration Handler
  const register = async (name, email, password, phone) => {
    setError(null);
    try {
      const res = await axiosClient.post("/auth/register", {
        name,
        email,
        password,
        phone,
      });

      const registeredUser = res.data?.user;
      setUser(registeredUser);
      return { success: true, user: registeredUser };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please check your details.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Common Unified Logout Handler
  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  // Update Profile (Name, Phone, Addresses)
  const updateProfile = async (data) => {
    setError(null);
    try {
      const res = await axiosClient.put("/auth/profile", data);
      const updatedUser = res.data?.data?.user || res.data?.user;
      if (updatedUser) {
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      }
      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Change Password
  const changePassword = async (currentPassword, newPassword) => {
    setError(null);
    try {
      const res = await axiosClient.put("/auth/password", {
        currentPassword,
        newPassword,
      });
      return {
        success: true,
        message: res.data?.message || "Password changed successfully.",
      };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to change password.";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const role = user?.role || null;
  const isAdmin = role === "admin";
  const isCustomer = role === "customer";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        admin: isAdmin ? user : null, // Backwards compatibility for existing admin components
        isAdmin,
        isCustomer,
        isAuthenticated,
        loading,
        error,
        setError,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        checkAuth,
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
