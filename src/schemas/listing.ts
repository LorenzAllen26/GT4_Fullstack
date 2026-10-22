import { z } from "zod";

// What a client is allowed to send to POST /api/ai. Checked BEFORE
// anything goes to Gemini, so a bad request costs no quota.
export const aiRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, "Describe the item in at least 20 characters.")
    .max(2000, "Keep the description under 2000 characters."),
});

export const CATEGORIES = [
  "electronics",
  "clothing",
  "accessories",
  "bags",
  "documents",
  "keys",
  "other",
] as const;

// What Gemini has to send BACK. Used three ways:
//   1. z.infer -> the Listing type
//   2. z.toJSONSchema -> the schema sent to Gemini
//   3. safeParse in gemini.ts -> the check on the reply
// .describe() text travels to Gemini and tells it what each field is for.
export const listingSchema = z.object({
  title: z
    .string()
    .describe("A short listing title under 60 characters that names the item."),
  category: z
    .enum(CATEGORIES)
    .describe("The one category that best fits the item."),
  tags: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe("Short lowercase keywords (colour, brand, material) that help someone find the item."),
  missingDetails: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe("Details to add so the real owner can be told apart from someone pretending, each written as a question."),
  detailLevel: z
    .enum(["detailed", "vague"])
    .describe("How well the description could identify the item."),
});

export type Listing = z.infer<typeof listingSchema>;

// Computed once, when this file is first imported.
export const listingJsonSchema = z.toJSONSchema(listingSchema);