import "dotenv/config";
import { analyzeListing } from "./ai/gemini";

// One real request to Gemini from the terminal, no Express, no token.
// If this prints a listing, the key, model name and schema all work.
async function tryAi() {
  const listing = await analyzeListing(
    "Found a blue Hydro Flask water bottle with a dent on the side " +
      "and a Spider-Man sticker, left in Room 204 after the 10 AM class.",
  );
  console.log(JSON.stringify(listing, null, 2));
}

tryAi().catch((err: unknown) => {
  console.error("Gemini call failed:", err);
  process.exit(1);
});