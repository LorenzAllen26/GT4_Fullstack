import { Router, Request, Response } from "express";
import { Item } from "../models/Item";

export const itemRouter = Router();

// GET all items
itemRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error: any) {
    console.error("Error fetching items:", error);
    res.status(500).json({ 
      message: "Error fetching items", 
      error: error?.message || error 
    });
  }
});

// GET single item
itemRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error: any) {
    console.error("Error fetching item:", error);
    res.status(500).json({ 
      message: "Error fetching item", 
      error: error?.message || error 
    });
  }
});

// POST create item
itemRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error: any) {
    console.error("Error creating item:", error);
    res.status(400).json({ 
      message: "Error creating item", 
      error: error?.message || error 
    });
  }
});

// PATCH update item status
itemRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedItem);
  } catch (error: any) {
    console.error("Error updating item:", error);
    res.status(400).json({ 
      message: "Error updating item", 
      error: error?.message || error 
    });
  }
});