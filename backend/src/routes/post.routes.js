import { Router } from "express";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import { protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanString, isValidId, asStringArray } from "../utils/validators.js";
const router = Router();
const categories = ["General Discussion", "College Events", "Hackathons", "Internships", "Coding and Technology", "Academic Questions", "Project Showcase", "Announcements", "Achievements"];
const populate = { path: "author", select: "name college branch year profileImage" };

router.get("/", protect, asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const filter = {};
  const q = cleanString(req.query.q).slice(0, 100);
  if (q) filter.$or = [
    { title: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
    { content: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }
  ];
  if (categories.includes(req.query.category)) filter.category = req.query.category;
  const [posts, total] = await Promise.all([
    Post.find(filter).populate(populate).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Post.countDocuments(filter)
  ]);
  const ids = posts.map(p => p._id);
  const [likes, comments, myLikes] = await Promise.all([
    Like.aggregate([{ $match: { post: { $in: ids } } }, { $group: { _id: "$post", count: { $sum: 1 } } }]),
    Comment.aggregate([{ $match: { post: { $in: ids } } }, { $group: { _id: "$post", count: { $sum: 1 } } }]),
    Like.find({ user: req.user._id, post: { $in: ids } }).select("post").lean()
  ]);
  const likeMap = new Map(likes.map(x => [String(x._id), x.count]));
  const commentMap = new Map(comments.map(x => [String(x._id), x.count]));
  const myLikeSet = new Set(myLikes.map(x => String(x.post)));
  res.json({ posts: posts.map(p => ({ ...p, likesCount: likeMap.get(String(p._id)) || 0, commentsCount: commentMap.get(String(p._id)) || 0, likedByMe: myLikeSet.has(String(p._id)) })), page, pages: Math.ceil(total / limit), total });
}));
router.post("/", protect, asyncHandler(async (req, res) => {
  const title = cleanString(req.body.title), content = cleanString(req.body.content);
  const category = req.body.category || "General Discussion";
  if (title.length < 3 || title.length > 120) return res.status(400).json({ message: "Title must be between 3 and 120 characters." });
  if (content.length < 3 || content.length > 5000) return res.status(400).json({ message: "Post content must be between 3 and 5000 characters." });
  if (!categories.includes(category)) return res.status(400).json({ message: "Choose a valid category." });
  const post = await Post.create({ author: req.user._id, title, content, category, imageUrl: cleanString(req.body.imageUrl), tags: asStringArray(req.body.tags) });
  await post.populate(populate);
  res.status(201).json({ post: { ...post.toObject(), likesCount: 0, commentsCount: 0, likedByMe: false } });
}));
router.get("/:postId", protect, asyncHandler(async (req, res) => {
  if (!isValidId(req.params.postId)) return res.status(400).json({ message: "Invalid post ID." });
  const post = await Post.findById(req.params.postId).populate(populate);
  if (!post) return res.status(404).json({ message: "Post not found." });
  const [likesCount, commentsCount, liked] = await Promise.all([Like.countDocuments({ post: post._id }), Comment.countDocuments({ post: post._id }), Like.exists({ post: post._id, user: req.user._id })]);
  res.json({ post: { ...post.toObject(), likesCount, commentsCount, likedByMe: Boolean(liked) } });
}));
router.patch("/:postId", protect, asyncHandler(async (req, res) => {
  if (!isValidId(req.params.postId)) return res.status(400).json({ message: "Invalid post ID." });
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: "Post not found." });
  if (String(post.author) !== String(req.user._id)) return res.status(403).json({ message: "You can only edit your own posts." });
  if (req.body.title !== undefined) post.title = cleanString(req.body.title);
  if (req.body.content !== undefined) post.content = cleanString(req.body.content);
  if (req.body.category !== undefined) post.category = req.body.category;
  if (req.body.imageUrl !== undefined) post.imageUrl = cleanString(req.body.imageUrl);
  if (req.body.tags !== undefined) post.tags = asStringArray(req.body.tags);
  await post.save(); await post.populate(populate);
  res.json({ post });
}));
router.delete("/:postId", protect, asyncHandler(async (req, res) => {
  if (!isValidId(req.params.postId)) return res.status(400).json({ message: "Invalid post ID." });
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: "Post not found." });
  if (String(post.author) !== String(req.user._id) && req.user.role !== "admin") return res.status(403).json({ message: "You can only delete your own posts." });
  await Promise.all([Post.deleteOne({ _id: post._id }), Like.deleteMany({ post: post._id }), Comment.deleteMany({ post: post._id })]);
  res.json({ message: "Post deleted." });
}));
router.post("/:postId/like", protect, asyncHandler(async (req, res) => {
  if (!isValidId(req.params.postId)) return res.status(400).json({ message: "Invalid post ID." });
  if (!await Post.exists({ _id: req.params.postId })) return res.status(404).json({ message: "Post not found." });
  await Like.updateOne({ user: req.user._id, post: req.params.postId }, { $setOnInsert: { user: req.user._id, post: req.params.postId } }, { upsert: true });
  res.json({ liked: true, likesCount: await Like.countDocuments({ post: req.params.postId }) });
}));
router.delete("/:postId/like", protect, asyncHandler(async (req, res) => {
  if (!isValidId(req.params.postId)) return res.status(400).json({ message: "Invalid post ID." });
  await Like.deleteOne({ user: req.user._id, post: req.params.postId });
  res.json({ liked: false, likesCount: await Like.countDocuments({ post: req.params.postId }) });
}));
export default router;
