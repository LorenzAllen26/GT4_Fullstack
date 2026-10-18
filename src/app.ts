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

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.CORS_ORIGIN === "*") {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Serverless DB connection middleware
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  await connectDB();
  next();
});

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

// Lost & Found API Routes
app.use("/api/auth", authRouter);
app.use("/api/items", itemRouter);
app.use("/api/claims", claimRouter);

// Fallback route for items
app.get("/items", (_req: Request, res: Response) => {
  res.redirect("/api/items");
});

// Root redirect
app.get("/", (_req: Request, res: Response) => {
  res.redirect("/api/items");
});

export default app;