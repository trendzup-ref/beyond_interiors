import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder or current working directory
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config(); // fallback

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import installationRoutes from "./routes/installationRoutes.js";
import siteVisitRoutes from "./routes/siteVisitRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS Configuration with credentials enabled for HTTP-only cookies
const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Standard Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Uploads Folder
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

// Base Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to BEYOND INTERIORS API",
    healthCheck: "/api/health",
  });
});

// Public Storefront APIs
app.use("/api/public", publicRoutes);
app.use("/api", publicRoutes);

// API Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/customers", customerRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/admin/site-visits", siteVisitRoutes);
app.use("/api/admin/banners", bannerRoutes);
app.use("/api/admin", installationRoutes);
app.use("/api/admin", categoryRoutes);
app.use("/api/admin", authRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on port: ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

export default app;
