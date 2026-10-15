import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { Course } from "./models/Course";
import { COURSES } from "./data/courses";

async function seed() {
  await connectDB();

  for (const course of COURSES) {
    await Course.updateOne({ code: course.code }, course, { upsert: true });
  }

  console.log(`${COURSES.length} courses seeded in database: ${mongoose.connection.name}`);
  await mongoose.disconnect();
}

seed().catch((err: unknown) => {
  console.error("Seed failed:", err);
  process.exit(1);
});