import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // nullable if using OAuth
  name: { type: String }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
