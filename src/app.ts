import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { authRouter } from "./routes/authRoutes";
import { itemRouter } from "./routes/itemRoutes";
import { claimRouter } from "./routes/claimRoutes";

export const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://lorenz-allen26-itelect4-project-it-seven.vercel.app",
];

// 1. Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.CORS_ORIGIN === "*"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// 3. Database Connection Middleware
app.use(async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ success: false, message: "Failed to connect to database" });
  }
});

// 4. Health Check Endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    ok: true,
    dbConnected: mongoose.connection.readyState === 1,
  });
});

// 5. Lost & Found API Routes
app.use("/api/auth", authRouter);
app.use("/api/items", itemRouter);
app.use("/api/claims", claimRouter);

// 6. Root Redirect
app.get("/", (_req: Request, res: Response) => {
  res.redirect("/api/items");
});

// 7. 404 Fallback for Unmatched Routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// 8. Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Global Error Handler caught:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "An error occurred on the server",
    error: err.errors || err,
  });
});

export default app;