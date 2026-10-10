import { Router, type Request, type Response } from "express";
import { TaskModel } from "../models/Task";
import { requireAuth } from "../middleware/auth";

export const taskRouter = Router();

taskRouter.use(requireAuth);

interface IdParam {
  id: string;
}

// 1. GET ALL
taskRouter.get("/", async (req: Request, res: Response) => {
  const tasks = await TaskModel.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(tasks);
});

// 2. GET ONE
taskRouter.get("/:id", async (req: Request<IdParam>, res: Response) => {
  const task = await TaskModel.findOne({ _id: req.params.id, userId: req.userId });
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.json(task);
});

// 3. CREATE
taskRouter.post("/", async (req: Request, res: Response) => {
  const task = await TaskModel.create({
    ...req.body,
    userId: req.userId,
  });
  res.status(201).json(task);
});

// 4. UPDATE
taskRouter.patch("/:id", async (req: Request<IdParam>, res: Response) => {
  const task = await TaskModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.json(task);
});

// 5. DELETE
taskRouter.delete("/:id", async (req: Request<IdParam>, res: Response) => {
  const task = await TaskModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });
  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }
  res.status(204).send();
});