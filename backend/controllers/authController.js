import User from "../models/user.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { sendTokenCookie } from "../utils/generateToken.js";
import { getClearCookieOptions } from "../utils/cookieOptions.js";

/**
 * @desc    Admin login
 * @route   POST /api/auth/admin/login or /api/admin/login
 * @access  Public
 */
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return sendError(res, 400, "Please provide both email and password.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query user and explicitly include password for verification
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return sendError(res, 401, "Invalid email or password.");
    }

    // Strictly enforce admin role (Customers can NEVER log in here)
    if (user.role !== "admin") {
      return sendError(res, 401, "Invalid email or password.");
    }

    // Verify account is active
    if (!user.isActive || user.status === "blocked") {
      return sendError(res, 403, "Admin account is deactivated or blocked. Please contact system owner.");
    }

    // Verify password with bcrypt
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password.");
    }

    // Issue JWT inside secure HTTP-only cookie
    sendTokenCookie(res, user._id);

    // Return safe user object (excluding password and token)
    return sendSuccess(res, 200, "Admin logged in successfully", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin logout (clears HTTP-only authentication cookie)
 * @route   POST /api/auth/admin/logout or /api/admin/logout
 * @access  Private (Admin)
 */
export const logoutAdmin = async (req, res, next) => {
  try {
    res.clearCookie("token", getClearCookieOptions());
    return sendSuccess(res, 200, "Admin logged out successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged-in Admin profile
 * @route   GET /api/auth/admin/me or /api/admin/me
 * @access  Private (Admin)
 */
export const getAdminProfile = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, "Admin profile retrieved successfully", {
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
};
