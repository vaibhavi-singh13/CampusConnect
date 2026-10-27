import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidEmail, cleanString } from "../utils/validators.js";
const router = Router();
const publicUser = (user) => ({ _id: user._id, name: user.name, email: user.email, bio: user.bio, college: user.college, branch: user.branch, year: user.year, skills: user.skills, interests: user.interests, profileImage: user.profileImage, role: user.role, createdAt: user.createdAt });
const issueToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", asyncHandler(async (req, res) => {
  const name = cleanString(req.body.name);
  const email = cleanString(req.body.email).toLowerCase();
  const password = req.body.password;
  if (name.length < 2) return res.status(400).json({ message: "Please enter your full name (at least 2 characters)." });
  if (!isValidEmail(email)) return res.status(400).json({ message: "Please enter a valid email address." });
  if (typeof password !== "string" || password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters long." });
  if (await User.findOne({ email })) return res.status(409).json({ message: "An account with this email already exists." });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, college: cleanString(req.body.college) });
  res.status(201).json({ token: issueToken(user), user: publicUser(user) });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const email = cleanString(req.body.email).toLowerCase();
  const password = req.body.password;
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
    return res.status(401).json({ message: "Email or password is incorrect." });
  }
  res.json({ token: issueToken(user), user: publicUser(user) });
}));
router.get("/me", protect, (req, res) => res.json({ user: publicUser(req.user) }));
router.post("/logout", (_req, res) => res.json({ message: "Logged out. Remove the token from this browser." }));
export default router;
