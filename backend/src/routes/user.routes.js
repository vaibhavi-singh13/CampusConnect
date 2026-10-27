import { Router } from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { asStringArray, cleanString, isValidId } from "../utils/validators.js";
const router = Router();
const safe = (u) => ({ _id: u._id, name: u.name, email: u.email, bio: u.bio, college: u.college, branch: u.branch, year: u.year, skills: u.skills, interests: u.interests, profileImage: u.profileImage, createdAt: u.createdAt });

router.get("/me", protect, (req, res) => res.json({ user: safe(req.user) }));
router.patch("/me", protect, asyncHandler(async (req, res) => {
  const allowed = {};
  for (const key of ["name", "bio", "college", "branch", "profileImage"]) {
    if (typeof req.body[key] === "string") allowed[key] = req.body[key].trim();
  }
  if (req.body.year !== undefined) {
    const year = Number(req.body.year);
    if (!Number.isInteger(year) || year < 1 || year > 8) return res.status(400).json({ message: "Year must be a number from 1 to 8." });
    allowed.year = year;
  }
  if (req.body.skills !== undefined) allowed.skills = asStringArray(req.body.skills);
  if (req.body.interests !== undefined) allowed.interests = asStringArray(req.body.interests);
  if (allowed.name !== undefined && allowed.name.length < 2) return res.status(400).json({ message: "Name must be at least 2 characters." });
  const user = await User.findByIdAndUpdate(req.user._id, { $set: allowed }, { new: true, runValidators: true });
  res.json({ user: safe(user) });
}));
router.get("/", protect, asyncHandler(async (req, res) => {
  const q = cleanString(req.query.q).slice(0, 100);
  const filter = { _id: { $ne: req.user._id } };
  if (q) filter.$or = [
    { name: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
    { skills: { $elemMatch: { $regex: q, $options: "i" } } },
    { interests: { $elemMatch: { $regex: q, $options: "i" } } },
    { branch: { $regex: q, $options: "i" } }
  ];
  if (req.query.branch) filter.branch = cleanString(req.query.branch).slice(0, 100);
  const users = await User.find(filter).select("name bio college branch year skills interests profileImage createdAt").sort({ name: 1 }).limit(50);
  res.json({ users });
}));
router.get("/:userId", protect, asyncHandler(async (req, res) => {
  if (!isValidId(req.params.userId)) return res.status(400).json({ message: "Invalid student ID." });
  const user = await User.findById(req.params.userId).select("name bio college branch year skills interests profileImage createdAt");
  if (!user) return res.status(404).json({ message: "Student not found." });
  const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 }).limit(10).populate("author", "name");
  res.json({ user, posts });
}));
export default router;
