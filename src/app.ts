import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { authRouter } from "./routes/authRoutes";
import { courseRouter } from "./routes/courseRoutes";
import { taskRouter } from "./routes/taskRoutes";

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Serverless DB connection middleware
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  await connectDB();
  next();
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/tasks", taskRouter);

export default app;