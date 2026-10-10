import type { Types } from "mongoose";

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

// Change 'Task' to your custom application resource
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