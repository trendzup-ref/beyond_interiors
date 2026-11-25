/**
 * Centralized Cookie Options for Beyond Interiors.
 * Ensures consistent and secure HTTP-only cookies in development and production.
 */

export const getCookieOptions = (rememberMe = true) => {
  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true, // Prevents client-side JavaScript access (XSS mitigation)
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? "none" : "lax", // 'lax' for local dev, 'none' with secure for cross-site prod
    path: "/",
  };

  // If rememberMe is true, keep cookie valid for 7 days; otherwise session cookie (cleared when browser closes)
  if (rememberMe) {
    options.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  }

  return options;
};

export const getClearCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };
};

export default {
  getCookieOptions,
  getClearCookieOptions,
};
