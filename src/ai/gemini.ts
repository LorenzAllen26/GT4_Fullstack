import { GoogleGenAI, type Content } from "@google/genai";
import { MODEL, SYSTEM_PROMPT, EXAMPLES, wrap } from "./prompt";
import {
  listingSchema,
  listingJsonSchema,
  type Listing,
} from "../schemas/listing";

// Nothing happens when this file is imported. The client is made on
// the first call, so a missing key is a clear sentence on the first AI
// request instead of a crash for every route.
let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add it to .env, and to Vercel.",
    );
  }
  if (client === null) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

// Two examples become two finished exchanges (user turn, model turn);
// the real description is the last turn. 5 turns in total.
function buildContents(description: string): Content[] {
  const shots: Content[] = EXAMPLES.flatMap((example) => [
    { role: "user", parts: [{ text: wrap(example.description) }] },
    { role: "model", parts: [{ text: JSON.stringify(example.listing) }] },
  ]);
  return [...shots, { role: "user", parts: [{ text: wrap(description) }] }];
}

// Thrown when Gemini answered but the answer is unusable. The route
// turns it into a 502.
export class AiReplyError extends Error {}

export async function analyzeListing(description: string): Promise<Listing> {
  const response = await getClient().models.generateContent({
    model: MODEL,
    contents: buildContents(description),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseJsonSchema: listingJsonSchema,
      // No temperature on purpose: leave it at Google's default.
    },
  });

  // Check 1: is there any text? (a safety-blocked reply has none)
  const text = response.text;
  if (!text) {
    throw new AiReplyError("Gemini sent back no text");
  }

  // Check 2: is it JSON?
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new AiReplyError("Gemini's reply was not JSON");
  }

  // Check 3: does it match the schema?
  const result = listingSchema.safeParse(data);
  if (!result.success) {
    throw new AiReplyError("Gemini's reply did not match the schema");
  }
  return result.data;
}