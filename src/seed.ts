import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { Item } from "./models/Item";

const SAMPLE_ITEMS = [
  {
    name: "Blue Leather Wallet",
    description: "Lost near the library 2nd floor. Contains student ID.",
    category: "Lost",
    location: "Main Library",
    dateReported: "2026-10-18",
    status: "Open",
    contactEmail: "student1@univ.edu",
  },
  {
    name: "Wireless Earbuds Case",
    description: "Found a black charging case on bench near cafeteria.",
    category: "Found",
    location: "Student Center",
    dateReported: "2026-10-19",
    status: "Open",
    contactEmail: "finder@univ.edu",
  },
  {
    name: "TI-84 Graphing Calculator",
    description: "Left in Room 302 after Math lecture.",
    category: "Lost",
    location: "Science Building Room 302",
    dateReported: "2026-10-20",
    status: "Open",
    contactEmail: "student2@univ.edu",
  },
];

async function seed() {
  await connectDB();

  // Clear existing items and insert initial Lost and Found data
  await Item.deleteMany({});
  await Item.insertMany(SAMPLE_ITEMS);

  console.log(`${SAMPLE_ITEMS.length} lost/found items seeded in database: ${mongoose.connection.name}`);
  await mongoose.disconnect();
}

seed().catch((err: unknown) => {
  console.error("Seed failed:", err);
  process.exit(1);
});