import { Router } from "express";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const router = Router();
router.use(protect);
router.get("/:userId", asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId) || userId === String(req.user._id)) return res.status(400).json({ message: "Invalid student." });
  const peer = await User.findById(userId).select("_id name");
  if (!peer) return res.status(404).json({ message: "Student not found." });
  const messages = await Message.find({ $or: [
    { sender: req.user._id, recipient: userId },
    { sender: userId, recipient: req.user._id }
  ] }).sort({ createdAt: 1 }).limit(300).populate("sender", "name").populate("recipient", "name");
  res.json({ messages, student: peer });
}));
router.post("/:userId", asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const text = typeof req.body.text === "string" ? req.body.text.trim() : "";
  if (!mongoose.isValidObjectId(userId) || userId === String(req.user._id)) return res.status(400).json({ message: "Invalid student." });
  if (!text || text.length > 2000) return res.status(400).json({ message: "Message must be between 1 and 2000 characters." });
  if (!await User.exists({ _id: userId })) return res.status(404).json({ message: "Student not found." });
  const message = await Message.create({ sender: req.user._id, recipient: userId, text });
  await message.populate("sender", "name");
  await message.populate("recipient", "name");
  res.status(201).json({ message });
}));
export default router;
