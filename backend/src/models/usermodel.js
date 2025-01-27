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
const usermodel = mongoose.model("user", userSchema);
export default usermodel;
