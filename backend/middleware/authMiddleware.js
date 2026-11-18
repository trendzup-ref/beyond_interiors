import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { sendError } from "../utils/apiResponse.js";

/**
 * Protect middleware: Verifies JWT from HTTP-only cookie (or Bearer header)
 * and attaches authenticated user document to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check HTTP-only cookie first (primary mechanism)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Fallback to Authorization header if present
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, 401, "Authentication required. Please log in.");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return sendError(res, 401, "Invalid token payload.");
    }

    // Fetch user from DB to ensure latest state and role
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return sendError(res, 401, "User belonging to this token no longer exists.");
    }

    // Check if user is active
    if (!user.isActive || user.status === "blocked") {
      return sendError(res, 403, "Your account has been deactivated or blocked. Please contact support.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return sendError(res, 401, "Invalid authentication token.");
    }
    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Authentication token expired. Please log in again.");
    }
    next(error);
  }
};

/**
 * Role authorization middleware
 * Checks if authenticated req.user has one of the allowed roles.
 *
 * @param  {...string} roles - e.g. "admin", "customer"
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, "Authentication required.");
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access denied. Role '${req.user.role}' is not authorized to access this resource.`
      );
    }

    next();
  };
};

export default {
  protect,
  authorize,
};
