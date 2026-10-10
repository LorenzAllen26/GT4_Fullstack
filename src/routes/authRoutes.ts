import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import type { TokenPayload } from "../middleware/auth";

export const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (await User.findOne({ email })) {
    res.status(409).json({ message: "That email is already registered" });
    return;
  }

  const user = await User.create({ name, email, password });
  res.status(201).json(user.toJSON());
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Email or password is incorrect" });
    return;
  }

  const payload: TokenPayload = { userId: String(user._id) };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "2h",
  });

  res.json({ token, user: user.toJSON() });
});