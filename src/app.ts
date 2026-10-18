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
  "https://lorenz-allen26-itelect4-project-it-4-b-main2-hd26-64t465a5r.vercel.app",
];

// 1. CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl), allowed origins, or Vercel preview URLs
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || process.env.CORS_ORIGIN === "*") {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// 2. Safe Serverless DB Connection Middleware
app.use(async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ error: "Failed to connect to database" });
  }
});

// 3. Health Check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

// 4. Lost & Found API Routes
app.use("/api/auth", authRouter);
app.use("/api/items", itemRouter);
app.use("/api/claims", claimRouter);

// 5. Root Redirect
app.get("/", (_req: Request, res: Response) => {
  res.redirect("/api/items");
});

// 6. 404 Fallback for Unmatched Routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;