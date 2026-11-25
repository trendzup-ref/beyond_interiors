import jwt from "jsonwebtoken";
import { getCookieOptions } from "./cookieOptions.js";

/**
 * Generates a signed JWT containing user MongoDB _id and role.
 * Reusable for both customer and admin authentication.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @param {string} role - 'customer' | 'admin'
 * @param {boolean} rememberMe
 * @returns {string} Signed JWT
 */
export const generateToken = (userId, role = "customer", rememberMe = true) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured in environment variables.");
  }

  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberMe ? (process.env.JWT_EXPIRES_IN || "7d") : "1d",
    }
  );
};

/**
 * Generates JWT and attaches it as an HTTP-only cookie to the Express response.
 *
 * @param {object} res - Express response object
 * @param {string|mongoose.Types.ObjectId} userId
 * @param {string} role - 'customer' | 'admin'
 * @param {boolean} rememberMe - Whether to persist session across restarts
 * @returns {string} token
 */
export const sendTokenCookie = (res, userId, role = "customer", rememberMe = true) => {
  const token = generateToken(userId, role, rememberMe);
  res.cookie("token", token, getCookieOptions(rememberMe));
  return token;
};

export default generateToken;
