import type { Types } from "mongoose";

// --- Course Types (Added for GT4 Part 2) ---
export interface Course {
  code: string;
  title: string;
  units: number;
  semester: string;
}

export type CourseDoc = Pick<
  Course,
  "code" | "title" | "units" | "semester"
>;

// --- User Types ---
export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
}

export type UserDoc = Omit<User, "id"> & {
  password: string;
};

// --- Task / Resource Types ---
export interface Task {
  id: string;
  userId: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
  priority: number;
  createdAt: Date;
}

export type TaskDoc = Omit<Task, "id" | "userId"> & {
  userId: Types.ObjectId;
};

export type NewTaskBody = Pick<Task, "title" | "status" | "priority">;