/**
 * Standardized API response helper for Beyond Interiors.
 * Ensures consistent JSON response structure across all endpoints.
 */

export const sendSuccess = (res, statusCode = 200, message = "Success", data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, statusCode = 500, message = "Internal Server Error", error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error ? (typeof error === "string" ? error : error.message || error) : undefined,
  });
};

export default {
  sendSuccess,
  sendError,
};
