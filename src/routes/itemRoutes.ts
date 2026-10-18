import { Router, type Request, type Response } from "express";
import { Item } from "../models/Item";

export const itemRouter = Router();

// GET all items
itemRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
});

// GET single item
itemRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching item", error: error.message });
  }
});

// POST create item
itemRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error: any) {
    console.error("Mongoose POST validation error:", error);
    res.status(400).json({ 
      message: "Error creating item", 
      details: error.message || error 
    });
  }
});

// PATCH update item status
itemRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.json(updatedItem);
  } catch (error: any) {
    res.status(400).json({ message: "Error updating item", details: error.message || error });
  }
});