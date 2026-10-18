import mongoose, { Schema, Document } from "mongoose";

export interface IClaim extends Document {
  itemId: string;
  userId: string;
  status: string;
  notes: string;
  submittedAt: string;
}

const ClaimSchema: Schema = new Schema(
  {
    itemId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: String, required: true, default: "pending" },
    notes: { type: String, required: true },
    submittedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const Claim = mongoose.model<IClaim>("Claim", ClaimSchema);