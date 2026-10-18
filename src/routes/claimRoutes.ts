import { Router, type Request, type Response } from "express";
import { Claim } from "../models/Claim";

export const claimRouter = Router();

// GET all claims
claimRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const claims = await Claim.find().sort({ createdAt: -1 });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: "Error fetching claims" });
  }
});

// GET single claim by ID
claimRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      res.status(404).json({ message: "Claim not found" });
      return;
    }
    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: "Error fetching claim" });
  }
});

// POST create claim
claimRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newClaim = new Claim(req.body);
    const savedClaim = await newClaim.save();
    res.status(201).json(savedClaim);
  } catch (error) {
    res.status(400).json({ message: "Error creating claim" });
  }
});

// PATCH update claim status (e.g., approved, pending, rejected)
claimRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const updatedClaim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedClaim) {
      res.status(404).json({ message: "Claim not found" });
      return;
    }
    res.json(updatedClaim);
  } catch (error) {
    res.status(400).json({ message: "Error updating claim" });
  }
});