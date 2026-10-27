import { Router } from "express";
import Resource from "../models/Resource.js";
import { protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanString, isValidId } from "../utils/validators.js";
const router = Router();
const categories = ["Notes", "Study Guide", "Programming", "Project Documentation", "Exam Preparation", "Useful Link", "Other"];
const populate = { path: "uploadedBy", select: "name college branch" };
function validUrl(value) { try { const u = new URL(value); return ["http:", "https:"].includes(u.protocol); } catch { return false; } }
router.get("/", protect, asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(30, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const filter = {};
  const q = cleanString(req.query.q).slice(0, 100);
  if (q) filter.$or = ["title", "subject", "description"].map(k => ({ [k]: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }));
  if (categories.includes(req.query.category)) filter.category = req.query.category;
  const [resources, total] = await Promise.all([Resource.find(filter).populate(populate).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Resource.countDocuments(filter)]);
  res.json({ resources, page, pages: Math.ceil(total / limit), total });
}));
router.post("/", protect, asyncHandler(async (req, res) => {
  const title = cleanString(req.body.title), subject = cleanString(req.body.subject);
  const resourceType = req.body.resourceType === "document" ? "document" : "link";
  const url = cleanString(resourceType === "link" ? req.body.externalUrl : req.body.fileUrl);
  if (title.length < 2 || !subject) return res.status(400).json({ message: "Title and subject are required." });
  if (!categories.includes(req.body.category || "Other")) return res.status(400).json({ message: "Choose a valid resource category." });
  if (!validUrl(url)) return res.status(400).json({ message: "Enter a valid http or https resource URL." });
  const resource = await Resource.create({ title, subject, description: cleanString(req.body.description), category: req.body.category || "Other", resourceType, ...(resourceType === "link" ? { externalUrl: url } : { fileUrl: url }), uploadedBy: req.user._id });
  await resource.populate(populate);
  res.status(201).json({ resource });
}));
router.get("/:resourceId", protect, asyncHandler(async (req, res) => {
  if (!isValidId(req.params.resourceId)) return res.status(400).json({ message: "Invalid resource ID." });
  const resource = await Resource.findById(req.params.resourceId).populate(populate);
  if (!resource) return res.status(404).json({ message: "Resource not found." });
  res.json({ resource });
}));
router.patch("/:resourceId", protect, asyncHandler(async (req, res) => {
  if (!isValidId(req.params.resourceId)) return res.status(400).json({ message: "Invalid resource ID." });
  const resource = await Resource.findById(req.params.resourceId);
  if (!resource) return res.status(404).json({ message: "Resource not found." });
  if (String(resource.uploadedBy) !== String(req.user._id)) return res.status(403).json({ message: "You can only edit your own resources." });
  for (const key of ["title", "description", "subject", "externalUrl", "fileUrl"]) if (typeof req.body[key] === "string") resource[key] = req.body[key].trim();
  if (req.body.category !== undefined) resource.category = req.body.category;
  if (req.body.resourceType !== undefined) resource.resourceType = req.body.resourceType;
  const url = resource.resourceType === "link" ? resource.externalUrl : resource.fileUrl;
  if (!validUrl(url)) return res.status(400).json({ message: "Enter a valid http or https resource URL." });
  await resource.save(); await resource.populate(populate);
  res.json({ resource });
}));
router.delete("/:resourceId", protect, asyncHandler(async (req, res) => {
  if (!isValidId(req.params.resourceId)) return res.status(400).json({ message: "Invalid resource ID." });
  const resource = await Resource.findById(req.params.resourceId);
  if (!resource) return res.status(404).json({ message: "Resource not found." });
  if (String(resource.uploadedBy) !== String(req.user._id) && req.user.role !== "admin") return res.status(403).json({ message: "You can only delete your own resources." });
  await resource.deleteOne();
  res.json({ message: "Resource deleted." });
}));
export default router;
