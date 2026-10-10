import { Schema, model } from "mongoose";
import type { TaskDoc } from "../types/index";

const taskSchema = new Schema<TaskDoc>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "title is required"],
    trim: true,
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "in-progress", "completed"],
      message: "status must be pending, in-progress, or completed",
    },
    default: "pending",
  },
  priority: {
    type: Number,
    required: [true, "priority is required"],
    min: [1, "Priority minimum is 1"],
    max: [5, "Priority maximum is 5"],
  },
  createdAt: { type: Date, default: Date.now },
});

taskSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const TaskModel = model<TaskDoc>("Task", taskSchema);