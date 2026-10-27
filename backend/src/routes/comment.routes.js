import { Router } from "express";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanString, isValidId } from "../utils/validators.js";
const router = Router();
const populate = { path: "author", select: "name profileImage" };
router.get("/posts/:postId/comments", protect, asyncHandler(async (req, res) => {
  if (!isValidId(req.params.postId)) return res.status(400).json({ message: "Invalid post ID." });
  if (!await Post.exists({ _id: req.params.postId })) return res.status(404).json({ message: "Post not found." });
  const comments = await Comment.find({ post: req.params.postId }).populate(populate).sort({ createdAt: 1 });
  res.json({ comments });
}));
router.post("/posts/:postId/comments", protect, asyncHandler(async (req, res) => {
  if (!isValidId(req.params.postId)) return res.status(400).json({ message: "Invalid post ID." });
  if (!await Post.exists({ _id: req.params.postId })) return res.status(404).json({ message: "Post not found." });
  const content = cleanString(req.body.content);
  if (!content || content.length > 1200) return res.status(400).json({ message: "Comment must be between 1 and 1200 characters." });
  const comment = await Comment.create({ post: req.params.postId, author: req.user._id, content });
  await comment.populate(populate);
  res.status(201).json({ comment });
}));
router.patch("/comments/:commentId", protect, asyncHandler(async (req, res) => {
  if (!isValidId(req.params.commentId)) return res.status(400).json({ message: "Invalid comment ID." });
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found." });
  if (String(comment.author) !== String(req.user._id)) return res.status(403).json({ message: "You can only edit your own comments." });
  const content = cleanString(req.body.content);
  if (!content || content.length > 1200) return res.status(400).json({ message: "Comment must be between 1 and 1200 characters." });
  comment.content = content; await comment.save(); await comment.populate(populate);
  res.json({ comment });
}));
router.delete("/comments/:commentId", protect, asyncHandler(async (req, res) => {
  if (!isValidId(req.params.commentId)) return res.status(400).json({ message: "Invalid comment ID." });
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found." });
  if (String(comment.author) !== String(req.user._id) && req.user.role !== "admin") return res.status(403).json({ message: "You can only delete your own comments." });
  await comment.deleteOne();
  res.json({ message: "Comment deleted." });
}));
export default router;
