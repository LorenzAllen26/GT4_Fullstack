import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  name: string;
  category: string;
  status: string;
  description?: string;
  locationFound?: string;
  dateFound?: string;
}

const ItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, required: true, default: "unclaimed" },
    description: { type: String },
    locationFound: { type: String },
    dateFound: { type: String },
  },
  { timestamps: true }
);

// Reuse model if already registered to prevent OverwriteModelError in serverless environments
export const Item = mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema);