import { Router, type Request, type Response } from "express";
import { rateLimit } from "express-rate-limit";
import { ApiError } from "@google/genai";
import { requireAuth } from "../middleware/auth";
import { aiRequestSchema } from "../schemas/listing";
import { analyzeListing, AiReplyError } from "../ai/gemini";

export const aiRouter = Router();

// Private: every call spends YOUR Gemini quota.
aiRouter.use(requireAuth);

// Five requests a minute per ACCOUNT. It sits below requireAuth so
// req.userId exists when the limiter reads it.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  keyGenerator: (req: Request) => req.userId!,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Five requests a minute is the limit. Try again shortly.",
  },
});

aiRouter.use(aiLimiter);

// POST /api/ai
aiRouter.post("/", async (req: Request, res: Response) => {
  // Body is checked before Gemini is called: a bad one costs nothing.
  const parsed = aiRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues.map((issue) => issue.message),
    });
    return;
  }

  try {
    const listing = await analyzeListing(parsed.data.prompt);
    res.json(listing);
  } catch (err) {
    // Gemini's 429 = the Google project's quota is used up.
    if (err instanceof ApiError && err.status === 429) {
      res.status(429).json({
        message: "The AI quota is used up for now. Try again later.",
      });
      return;
    }

    // Gemini failed, or answered with something unusable. Log the real
    // reason; the browser only gets our own sentence.
    if (err instanceof ApiError || err instanceof AiReplyError) {
      console.error(err);
      res.status(502).json({
        message: "The AI service did not answer properly. Try again.",
      });
      return;
    }

    // Anything else is a bug in this app.
    throw err;
  }
});