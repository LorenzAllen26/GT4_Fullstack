import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../app";
import * as geminiModule from "../ai/gemini";

// Mock database connection so tests don't require a live MongoDB instance
vi.mock("../config/db", () => ({
  connectDB: vi.fn().mockResolvedValue(true),
}));

// Mock the Gemini AI service function
vi.mock("../ai/gemini", () => ({
  analyzeListing: vi.fn(),
  AiReplyError: class AiReplyError extends Error {},
}));

const JWT_SECRET = process.env.JWT_SECRET || "test-secret";

describe("AI Route - POST /api/ai", () => {
  let validToken: string;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = JWT_SECRET;
    // Generate a valid JWT token signed with JWT_SECRET
    validToken = jwt.sign({ userId: "user-123", email: "test@example.com" }, JWT_SECRET);
  });

  it("should return 401 Unauthorized when no Authorization header is provided", async () => {
    const res = await request(app).post("/api/ai").send({ prompt: "Lost blue wallet" });

    expect(res.status).toBe(401);
  });

  it("should return 400 Bad Request when request body is invalid", async () => {
    const res = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${validToken}`)
      .send({}); // Missing prompt field

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Validation failed");
  });

  it("should return 200 OK with analyzed listing on valid prompt", async () => {
    const mockAiResponse = {
      title: "Blue Leather Wallet",
      category: "Personal Items",
      description: "A lost blue leather wallet containing IDs",
    };

    vi.spyOn(geminiModule, "analyzeListing").mockResolvedValue(mockAiResponse as any);

    const res = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ prompt: "I lost my blue leather wallet with my student ID inside" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAiResponse);
  });
});