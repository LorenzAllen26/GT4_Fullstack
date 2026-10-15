import { Router, type Request, type Response } from "express";
import { Course } from "../models/Course";

export const courseRouter = Router();

interface CodeParam {
  code: string;
}

// GET /api/courses - Get all courses
courseRouter.get("/", async (_req: Request, res: Response) => {
  const courses = await Course.find().sort({ code: 1 });
  res.json(courses);
});

// GET /api/courses/:code - Get single course by code
courseRouter.get("/:code", async (req: Request<CodeParam>, res: Response) => {
  const course = await Course.findOne({
    code: req.params.code.toUpperCase(),
  });

  if (!course) {
    res.status(404).json({
      message: `No course with code "${req.params.code}"`,
    });
    return;
  }

  res.json(course);
});

// POST /api/courses - Create a new course
courseRouter.post("/", async (req: Request, res: Response) => {
  try {
    const course = new Course(req.body);
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: "Error creating course", error });
  }
});

// PUT /api/courses/:code - Replace/Update an existing course by code
courseRouter.put("/:code", async (req: Request<CodeParam>, res: Response) => {
  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { code: req.params.code.toUpperCase() },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      res.status(404).json({ message: `No course with code "${req.params.code}"` });
      return;
    }

    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: "Error updating course", error });
  }
});

// PATCH /api/courses/:code - Partially update a course by code
courseRouter.patch("/:code", async (req: Request<CodeParam>, res: Response) => {
  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { code: req.params.code.toUpperCase() },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      res.status(404).json({ message: `No course with code "${req.params.code}"` });
      return;
    }

    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: "Error updating course", error });
  }
});

// DELETE /api/courses/:code - Delete a course by code
courseRouter.delete("/:code", async (req: Request<CodeParam>, res: Response) => {
  try {
    const deletedCourse = await Course.findOneAndDelete({
      code: req.params.code.toUpperCase(),
    });

    if (!deletedCourse) {
      res.status(404).json({ message: `No course with code "${req.params.code}"` });
      return;
    }

    res.json({ message: "Course deleted successfully", course: deletedCourse });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
});