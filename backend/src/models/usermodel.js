import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);

// Avoid model overwrite by checking if the model exists
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
