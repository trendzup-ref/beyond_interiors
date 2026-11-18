import axios from "axios";

/**
 * Pre-configured Axios client for Beyond Interiors.
 * - baseURL: points to the backend API root
 * - withCredentials: true ensures HTTP-only authentication cookies are automatically sent & received
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Response interceptor for consistent error extraction
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An unexpected network or server error occurred.",
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };
    return Promise.reject(customError);
  }
);

export default axiosClient;
