import express from "express";
import mongoose from "mongoose";
import { sendSuccess } from "../utils/apiResponse.js";

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Basic health-check API to verify server and database connectivity
 * @access  Public
 */
router.get("/", (req, res) => {
  const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const dbState = mongoose.connection.readyState;

  return sendSuccess(res, 200, "Backend API is healthy and operational", {
    status: "UP",
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: {
      status: dbStates[dbState] || "unknown",
      host: mongoose.connection.host || null,
    },
  });
});

export default router;
