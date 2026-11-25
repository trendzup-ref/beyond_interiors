import User from "../models/user.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { sendTokenCookie } from "../utils/generateToken.js";
import { getClearCookieOptions } from "../utils/cookieOptions.js";

/**
 * @desc    Single Unified Login for both Admin and Customer
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe = true } = req.body;

    // 1 & 2. Validate request body
    if (!email || !password) {
      return sendError(res, 400, "Please provide both email and password.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 3. Find user by email and explicitly include password for verification
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return sendError(res, 401, "Invalid email or password.");
    }

    // 4. Compare entered password with hashed password using bcrypt
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password.");
    }

    // 5. Check whether account is active or blocked
    if (!user.isActive || user.status === "blocked") {
      return sendError(
        res,
        403,
        "Your account has been deactivated or blocked. Please contact support."
      );
    }

    // 6. Verify user's role
    if (!user.role || !["customer", "admin"].includes(user.role)) {
      return sendError(res, 403, "Invalid user role assigned to this account.");
    }

    // 7 & 8. Generate JWT containing user ID and role, and store in HTTP-only cookie
    sendTokenCookie(res, user._id, user.role, rememberMe);

    // 9 & 10. Return authenticated user's safe information (never returns hashed password)
    return sendSuccess(res, 200, "Logged in successfully", {
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
 * @desc    Single Unified Logout for both Admin and Customer
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token", getClearCookieOptions());
    return sendSuccess(res, 200, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged-in user profile (Admin or Customer)
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, "User profile retrieved successfully", {
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new customer account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return sendError(res, 400, "Please provide name, email, password, and phone number.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for existing user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return sendError(res, 400, "An account with this email address already exists.");
    }

    if (password.length < 6) {
      return sendError(res, 400, "Password must be at least 6 characters.");
    }

    // Create new customer account (explicitly set role to customer)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone.trim(),
      role: "customer",
      status: "active",
      isActive: true,
    });

    // Auto-login upon registration
    sendTokenCookie(res, user._id, user.role, true);

    return sendSuccess(res, 201, "Customer registered successfully", {
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

// Aliases for full backward compatibility
export const loginAdmin = loginUser;
export const logoutAdmin = logoutUser;
export const getAdminProfile = getCurrentUser;

/**
 * @desc    Update customer/user profile (name, phone, addresses)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(res, 404, "User not found.");
    }

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (trimmedName.length < 3 || trimmedName.length > 50) {
        return sendError(res, 400, "Name must be between 3 and 50 characters.");
      }
      user.name = trimmedName;
    }

    if (phone !== undefined) {
      const trimmedPhone = phone.trim();
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(trimmedPhone)) {
        return sendError(res, 400, "Please provide a valid 10-digit mobile number.");
      }
      user.phone = trimmedPhone;
    }

    if (addresses && Array.isArray(addresses)) {
      user.addresses = addresses;
    }

    await user.save();

    return sendSuccess(res, 200, "Profile updated successfully", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        isActive: user.isActive,
        addresses: user.addresses,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 400, "Please provide both current and new password.");
    }

    if (newPassword.length < 6) {
      return sendError(res, 400, "New password must be at least 6 characters.");
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return sendError(res, 404, "User not found.");
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 400, "Current password does not match.");
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 200, "Password changed successfully");
  } catch (error) {
    next(error);
  }
};

export default {
  loginUser,
  logoutUser,
  getCurrentUser,
  registerCustomer,
  updateProfile,
  changePassword,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
};
