import { Router, Request, Response } from "express";
import { Claim } from "../models/Claim";

export const claimRouter = Router();

// GET all claims
claimRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const claims = await Claim.find();
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: "Error fetching claims" });
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