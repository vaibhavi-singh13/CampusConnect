import mongoose from "mongoose";
const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
  description: { type: String, default: "", maxlength: 1500 },
  subject: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, enum: ["Notes", "Study Guide", "Programming", "Project Documentation", "Exam Preparation", "Useful Link", "Other"], default: "Other" },
  resourceType: { type: String, enum: ["link", "document"], default: "link" },
  fileUrl: { type: String, default: "" },
  externalUrl: { type: String, default: "" },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }
}, { timestamps: true });
resourceSchema.index({ title: "text", subject: "text", description: "text" });
export default mongoose.model("Resource", resourceSchema);
