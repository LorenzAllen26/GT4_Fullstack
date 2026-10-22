import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { authRouter } from "./routes/authRoutes";
import { itemRouter } from "./routes/itemRoutes";
import { claimRouter } from "./routes/claimRoutes";
import { aiRouter } from "./routes/aiRoutes"; // GT5

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

// Serverless DB connection middleware with error catching
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error in middleware:", error);
    // Proceed so health routes or error handlers can send proper response
    next();
  }
});

// Redirect root domain (/) directly to items endpoint
app.get("/", (_req: Request, res: Response) => {
  res.redirect("/items");
});

// Standardized health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({ 
    success: true, 
    ok: true, 
    dbConnected: isConnected 
  });
});

// Lost & Found API Routes
app.use("/api/auth", authRouter);
app.use("/items", itemRouter);
app.use("/claims", claimRouter);
app.use("/api/ai", aiRouter); // GT5: the only route that talks to Gemini

export default app;