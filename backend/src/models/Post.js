import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
  content: { type: String, required: true, trim: true, minlength: 3, maxlength: 5000 },
  category: { type: String, enum: ["General Discussion", "College Events", "Hackathons", "Internships", "Coding and Technology", "Academic Questions", "Project Showcase", "Announcements", "Achievements"], default: "General Discussion" },
  imageUrl: { type: String, default: "", maxlength: 1000 },
  tags: { type: [String], default: [] }
}, { timestamps: true });
postSchema.index({ createdAt: -1 });
postSchema.index({ title: "text", content: "text" });
export default mongoose.model("Post", postSchema);
