
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import healthRoutes from "./routes/healthRoutes.js";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Third-party middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(cookieParser());

// API routes
app.use("/api/health", healthRoutes);

// Error handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
