import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to backend directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import mongoose from "mongoose";
import User from "../models/user.js";

/**
 * Admin Seed Script for Beyond Interiors
 * Run via: npm run admin:seed
 */
const seedAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE, MONGO_URI } = process.env;

    // 1. Validate required environment variables
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error("Error: Missing required admin environment variables (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD).");
      process.exit(1);
    }

    if (!MONGO_URI) {
      console.error("Error: MONGO_URI is not defined in environment variables.");
      process.exit(1);
    }

    // 2. Validate password strength (min 8 chars)
    if (ADMIN_PASSWORD.length < 8) {
      console.error("Error: ADMIN_PASSWORD must be at least 8 characters long.");
      process.exit(1);
    }

    // 3. Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully.");

    const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();

    // 4. Check if account with email exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log(` Admin account already exists for (${normalizedEmail}). Skipping creation.`);
        await mongoose.connection.close();
        process.exit(0);
      } else {
        console.error(
          `Security Conflict: Email (${normalizedEmail}) already belongs to an existing customer account.`
        );
        console.error("Cannot automatically promote customer to admin. Please use a distinct admin email.");
        await mongoose.connection.close();
        process.exit(1);
      }
    }

    // 5. Create new Admin user (password will be hashed by pre-save hook)
    const adminUser = new User({
      name: ADMIN_NAME.trim(),
      email: normalizedEmail,
      password: ADMIN_PASSWORD,
      phone: ADMIN_PHONE ? ADMIN_PHONE.trim() : "9876543210",
      role: "admin",
      status: "active",
      isActive: true,
    });

    await adminUser.save();

    console.log(" Admin account created successfully!");
    console.log(`   Name  : ${adminUser.name}`);
    console.log(`   Email : ${adminUser.email}`);
    console.log(`   Role  : ${adminUser.role}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin user:", error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedAdmin();
