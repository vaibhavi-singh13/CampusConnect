import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 70 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  bio: { type: String, default: "", maxlength: 300 },
  college: { type: String, default: "", maxlength: 120 },
  branch: { type: String, default: "", maxlength: 100 },
  year: { type: Number, min: 1, max: 8, default: null },
  skills: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  profileImage: { type: String, default: "" },
  role: { type: String, enum: ["student", "admin"], default: "student" }
}, { timestamps: true });
userSchema.index({ name: "text", skills: "text", interests: "text" });
export default mongoose.model("User", userSchema);
