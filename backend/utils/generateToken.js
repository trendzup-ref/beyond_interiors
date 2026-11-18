import jwt from "jsonwebtoken";
import { getCookieOptions } from "./cookieOptions.js";

/**
 * Generates a signed JWT containing only the user MongoDB _id.
 * Reusable for both customer and admin authentication.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {string} Signed JWT
 */
export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured in environment variables.");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Generates JWT and attaches it as an HTTP-only cookie to the Express response.
 *
 * @param {object} res - Express response object
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {string} token
 */
export const sendTokenCookie = (res, userId) => {
  const token = generateToken(userId);
  res.cookie("token", token, getCookieOptions());
  return token;
};

export default generateToken;
